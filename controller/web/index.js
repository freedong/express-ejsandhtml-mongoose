// 控制器   控制页面跳转和渲染页面的
var mongoose=require('mongoose');
var News =mongoose.model('News');
var Recruit =mongoose.model('Recruit');
var Quit =mongoose.model('Quit');


// 首页
exports.index = function(req,res){
  res.render('websiteHtml/index/index',{
    title:"Home"
  });
};

// 首页获取6条新闻
exports.get_news = function(req,res){
	//获取新闻处理逻辑
	News.find({category:'0'}).sort('-_id').limit(6).exec(function(err,datas){
		if(err){
			console.log('获取数据失败');
            var data={
                status: 'failed',
            };
            res.json(data);
		}else{
			var data={
                status: 'success',
                datas: datas
            };
            res.json(data);
		}
	});
};



// 首页获取3条招聘
exports.get_recruits= function(req, res) {
    //获取招聘处理逻辑
    Recruit.find({}).sort('-_id').limit(3).exec(function(err,datas){
        console.log(datas);
        if(err){
            console.log('获取数据失败');
            var data={
                status: 'failed',
            };
            res.json(data);
        }else{
            var data={
                status: 'success',
                datas: datas
            };
            res.json(data);
        }
    });
};



// 首页获取2条离职公告
exports.get_quits= function(req, res) {
    //获取招聘处理逻辑
    Quit.find({}).sort('-_id').limit(2).exec(function(err,datas){
        if(err){
            console.log('获取数据失败');
            var data={
                status: 'failed',
            };
            res.json(data);
        }else{
            var data={
                status: 'success',
                datas: datas
            };
            res.json(data);
        }
    });
};
