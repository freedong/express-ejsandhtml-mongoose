var Admin = require('../../controller/admin/admin');

module.exports = function(app){
  // 登陆页面 渲染
  app.get('/login',Admin.login);
  // 注册页面 渲染
  app.get('/register',Admin.register);
  // 注册页面 提交数据
  app.post('/register',Admin.post_register);
  // 注册页面 成功
  app.get('/register_success',Admin.register_success);
}
