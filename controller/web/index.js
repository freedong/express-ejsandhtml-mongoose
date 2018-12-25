// 控制器   控制页面跳转和渲染页面的


// 首页
exports.index = function(req,res){
  res.render('websiteHtml/index/index',{
    title:"Home"
  });
};
