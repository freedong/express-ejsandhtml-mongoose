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
  // 登陆页面 提交数据
  app.post('/login',Admin.checkUser);
  // 首页
  app.get('/admin',Admin.admin);
  // 注销
  app.get('/logout',Admin.logout);

  // 主页  (显示提交表单的数据)
  app.get('/main',Admin.main);

  // 管理员列表
  app.get('/admin_list',Admin.admin_list);

  // 添加管理员
  app.get('/admin_add',Admin.admin_add);
}
