var Index = require("../../controller/web/index");


module.exports = function(app){
  // 首页路由
  app.get('/',Index.index);
};
