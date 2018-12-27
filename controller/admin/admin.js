
// 获取数据库中用户表
var mongoose = require('mongoose');

// 获取用户表对象
var User = mongoose.model('User');
// 获取新闻表对象
var News = mongoose.model('News');
// 获取招聘数据表对象
var Recruit =mongoose.model('Recruit');
// 获取离职公示数据表对象
var Quit =mongoose.model('Quit');



// 登陆页面 渲染
exports.login = function(req,res){
  res.render('adminHtml/login/login',{
    title:"登陆页面"
  });
};

// 注册页面 渲染
exports.register = function(req,res){
	res.render('adminHtml/register/register',{
		title:"注册页面"
	});
};
// 注册页面 提交数据
exports.post_register = function(req,res){
	// 获取提交页面的值
	var username = req.body.username;
    var password = req.body.password;
    var realname = req.body.realname;
    var phone    = req.body.phone;
    var captcha  = req.body.captcha;

    if(captcha!=req.session.captcha){
    	console.log('验证码错误');
    	console.log(captcha+'验证码1');
    	console.log(req.session.captcha+'验证码2');
        res.json({'status':'验证码错误'});
    }else{  //验证码正确
    	var user = new User({
    		username:username,
            password:password,
            realname:realname,
            phone:phone,
            status:'0'
    	});
    	// 检查是否已注册
    	User.findOne({username:username},function(err,doc){
    		if(err){
    			res.json({'status':'error'});
    		}else if(doc){
    			res.json({'status':'用户已注册'});
    		}else{
    			// 创建用户
    			User.create(user,function(err,doc){
    				if(err){
    					res.json({'status':'注册失败'});
    				}
    				res.json({'status':'用户注册成功'});
    			});
    		}
    	});
    }
};

// 注册页面 成功
exports.register_success = function(req,res){
	res.render('adminHtml/register/register_success',{
		title:"注册成功"
	});
};


// 登录页面 提交数据
exports.checkUser = function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var captcha=req.body.captcha;

  if(captcha!=req.session.captcha){
    console.log('captcha error');
    res.json({'status':'captcha error'});
  }else{  //验证码正确
    User.findOne({username:username},function(err,doc){
      if(err){
        console.log('error');
        res.json({'status':'error'});
      }else if(doc==null){
        console.log('not exist');
        res.json({'status':'not exist'});
      }else if(doc.status==='0'){
        //如果是刚注册的用户，还未授权无法登陆。
        console.log('unchecked');
        res.json({'status':'unchecked'});
      }else if(doc.password===password){
        console.log('success');
        //登录成功，将user保存到session中
        req.session.user = doc;
        res.json({'status':'success'});
      }else{
        console.log('password error');
        res.json({'status':'password error'});
      }
    });
  }
};


// 登录成功后的  显示首页
exports.admin = function(req,res){
  var isSuper;
  if(req.session.user.status==='2'){
    isSuper='超级管理员';
  }else{
    isSuper='普通管理员';
  }
  res.render('adminHtml/index',{
    title:"后台首页",
    username:req.session.user.username,
    isSuper:isSuper
  });
};

// 注销
exports.logout = function(req,res){
  req.session.user = null;
  res.redirect('/login');
};


// 主页  (显示提交表单的数据)
exports.main = function(req,res){
  res.render('adminHtml/main');
};
//管理员列表
exports.admin_list = function(req,res){
  res.render('adminHtml/admin_list');
};

//添加管理员
exports.admin_add = function(req,res){
  res.render('adminHtml/admin_add');
};


// 分页获取管理员列表
exports.get_users = function(req,res){
  var curr = req.body.curr;
  //每页大小为10
  var query = User.find({});
  // 根据传递的页数跳过之前的10个
  query.skip((curr-1)*10);
  // 限制10个
  query.limit(10);
  //按照id添加的顺序倒序排列
  query.sort({'_id':-1});
  //计算分页数据
  query.exec(function(err,rs){
    //rs 的结果是根据请求的curr显示数量  每次请求会跳过之前的10个
    console.log(rs+"rs");
    if(err){
      res.send(err);
    }else{
      //计算数据总数  分页
      User.find(function(err,result){
        //result 的结果是显示总数量
        console.log(result+"result");
        if(result.length%10>0){
          // 如果不够10个  页数加1
          pages = result.length/10 + 1;
        }else{
          pages = result.length/10;
        }

        jsonArray = {
          data:rs,
          pages:pages
        };
        res.json(jsonArray);


      });
    }
  });

};

//添加管理员  提交数据
exports.post_user = function(req,res){
  //0表示普通用户，1表示已授权普通用户，2表示高级用户
  if(req.session.user.status!='2'){
    // 没有权限
    res.json({"status":"noRight"});
  }else{
    //超级管理员有权利删除操作
    var username=req.body.username;
    var password=req.body.password;
    var realname=req.body.realname;
    var phone=req.body.phone;
    var status="0";

    var user = new User({
      username:username,
      password:password,
      realname:realname,
      phone:phone,
      status:status
    });

    User.findOne({username:username},function(err,doc){
      if(err){
        res.json({'status':'error'});
      }else if(doc){
        res.json({'status':'user_exist'});
      }else{
        // 创建用户
        User.create(user,function(err,doc){
          if(err){
            res.json({'status':'error'});
          }
          console.log(doc);
          res.json({'status':'success'});
        });
      }
    });
  }
};


exports.user_del = function(req,res){
  // 获取id
  var id = req.body.id;
  //0表示普通用户，1表示已授权普通用户，2表示高级用户
  if(req.session.user.status!='2'){
    res.json({"status":"noRight"});
  }else {
    User.remove({_id:id},function(err,doc){
      if(err){
        res.json({"status":"error"});
      }else{
        res.json({"status":"success"});
      }
    });
  }
};


// 授权验证
exports.authorize = function(req,res){
  var id=req.body.id;
  //0表示普通用户，1表示已授权普通用户，2表示高级用户
  if(req.session.user.status!='2'){
    res.json({"status":"noRight"});
  }else {
    User.findOne({_id:id},function(err,doc){
      if(err){
        res.json({"status":"error"});
      }else {
        doc.status='1';
        //修改后必须的保存
        doc.save(function(err){
          if(err){
              res.json({"status":"error"})
          }else{
              res.json({"status":"success"});
          }
        });
      }
    });
  }
};


// 新闻列表
exports.news_list = function(req,res){
  res.render('adminHtml/news_list');
};
// 新闻添加
exports.add_news = function(req,res){
  res.render('adminHtml/news_add');
};
// 新闻添加  提交数据
exports.post_add_news = function(req,res){
  var title=req.body.title;
  var time=req.body.time;
  var from=req.body.from;
  var category=req.body.category;
  var content=req.body.content;

  // 把数据赋值给对象
  var news = new News({
    title:title,
    time:time,
    from:from,
    category:category,
    content:content
  });

  // 保存到数据库
  news.save(function(err){
    if(err){
      res.json({"status":"error"});
    }else {
      res.json({"status":"success"});
    }
  });

};


// 分页获取新闻列表
exports.post_news_list = function(req,res){
  var curr = req.body.curr;

  var query = News.find({});
  query.skip((curr-1)*10);
  query.limit(10);
  //按照id添加的顺序倒序排列
  query.sort({'_id':-1});
  //计算分页数据
  query.exec(function(err,rs){
    if(err){
      res.send(err);
    }else{
      //计算数据总数  获取总页数
      News.find(function(err,result){
        if(result.length%10>0){
          pages=result.length/10+1;
        }else{
          pages=result.length/10;
        }
        jsonArray = {
          data:rs,
          pages:pages
        };
        res.json(jsonArray);
      });
    }
  });
};


// 新闻删除
exports.news_del = function(req,res){
  var id = req.body.id;
  News.remove({_id:id},function(err,doc){
    if(err){
      res.json({"status":"error"});
    }else{
      res.json({"status":"success"});
    }
  });
};


// 新闻详情
exports.news_details = function(req,res){
  var id = req.body.id;
  News.findOne({_id:id},function(err,doc){
    console.log(doc);
    if(err){
      res.json({"status":"error"});
    }else{
      res.json({"status":"success","data":doc});
    }
  });
};


// 招聘列表
exports.recruit_list = function(req,res){
  res.render('adminHtml/recruit_list');
};
// 招聘添加
exports.add_recruit = function(req,res){
  res.render('adminHtml/add_recruit');
};
// 招聘添加  提交数据
exports.post_add_recruit = function(req,res){
  var position=req.body.position;
  var time=req.body.time;
  var department=req.body.department;
  var category=req.body.category;
  var requirement=req.body.requirement;

  var data=new Recruit(
      {
          position:position,
          time:time,
          department:department,
          category:category,
          requirement:requirement
      }
  );
  data.save(function(err){
      if(err){
          res.json({"status":"error"})
      }else{
          res.json({"status":"success"});
      }
  });
};


// 分页获取招聘列表
exports.get_recruits = function(req, res) {
    var curr=req.body.curr;
    //每页大小为10
    var query=Recruit.find({});
    query.skip((curr-1)*10);
    query.limit(10);
    //按照id添加的顺序倒序排列
    query.sort({'_id': -1});
    //计算分页数据
    query.exec(function(err,rs){
        if(err){
            res.send(err);
        }else{
            //计算数据总数
            Recruit.find(function(err,result){
                if(result.length%10>0){
                    pages=result.length/10+1;
                }else{
                    pages=result.length/10;
                }
                jsonArray={data:rs,pages:pages};
                res.json(jsonArray);
            });
        }
    });
};


//删除一个招聘信息
exports.del_recruit= function(req, res) {
    var id=req.body.id;
    Recruit.remove({_id:id},function(err,doc){
        if(err){
            res.json({"status":"error"});
        }else{
            res.json({"status":"success"})
        }
    });

};



//获取招聘信息详情
exports.get_recruit_details = function(req, res) {

    var id=req.body.id;
    Recruit.findOne({_id:id},function(err,doc){
        if(err){
            res.json({"status":"error"});
        }else{
            res.json({"status":"success","data":doc.requirement})
        }
    });
};


// 添加离职公示
exports.add_quit= function(req, res) {
    var name=req.body.name;
    var time=req.body.time;
    var department=req.body.department;

    var data=new Quit(
        {
            name:name,
            time:time,
            department:department
        }
    );
    data.save(function(err){
        if(err){
            res.json({"status":"error"})
        }else{
            res.json({"status":"success"});
        }
    });
};



// 分页获取离职公示
exports.get_quits = function(req, res) {
    var curr=req.body.curr;
    //每页大小为10
    var query=Quit.find({});
    query.skip((curr-1)*10);
    query.limit(10);
    //按照id添加的顺序倒序排列
    query.sort({'_id': -1});
    //计算分页数据
    query.exec(function(err,rs){
        if(err){
            res.send(err);
        }else{
            //计算数据总数
            Quit.find(function(err,result){
                if(result.length%10>0){
                    pages=result.length/10+1;
                }else{
                    pages=result.length/10;
                }
                jsonArray={data:rs,pages:pages};
                res.json(jsonArray);
            });
        }
    });
};


//删除一个离职公告
exports.del_quit= function(req, res) {
    var id=req.body.id;
    Quit.remove({_id:id},function(err,doc){
        if(err){
            res.json({"status":"error"});
        }else{
            res.json({"status":"success"})
        }
    });

};
// 离职公示
exports.add_quit_notice = function(req,res){
  res.render('adminHtml/add_quit_notice');
};

// 离职公示列表
exports.quit_notice_list = function(req,res){
  res.render('adminHtml/quit_notice_list');
};
