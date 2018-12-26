
// 获取数据库中用户表
var mongoose = require('mongoose');

// 获取用户表对象
var User=mongoose.model('User');



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
