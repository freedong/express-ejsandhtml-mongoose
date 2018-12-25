var Admin = require('../../controller/admin/admin');

module.exports = function(app){
  // 登陆页面
  app.get('/login',Admin.login);
}
