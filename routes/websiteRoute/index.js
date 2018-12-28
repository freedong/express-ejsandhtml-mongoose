var Index = require("../../controller/web/index");


module.exports = function(app){
  // 首页路由
  app.get('/',Index.index);
  // 首页获取6条新闻
  app.get('/web/get_news', Index.get_news);
  // 获取三条招聘信息
  app.get('/web/get_recruits', Index.get_recruits);
  // 获取离职公示信息2条
  app.get('/web/get_quits', Index.get_quits);
  // 走进车协
  app.get('/company_intro', Index.company_intro);
};
