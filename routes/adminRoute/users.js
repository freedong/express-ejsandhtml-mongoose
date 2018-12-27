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

  // 分页获取管理员列表
  app.post('/admin/get_users',Admin.get_users);
  // 添加管理员
  app.post('/admin/post_user',Admin.post_user);
  // 删除管理员
  app.post('/admin/user_del',Admin.user_del);

  // 授权验证
  app.post('/admin/authorize',Admin.authorize);


  // 新闻列表
  app.get('/news_list',Admin.news_list);
  // 分页获取新闻列表
  app.post('/post_news_list',Admin.post_news_list);

  // 新闻添加
  app.get('/add_news',Admin.add_news);
  // 新闻添加 提交数据
  app.post('/admin/post_add_news',Admin.post_add_news);
  // 新闻删除
  app.post('/admin/news_del',Admin.news_del);

  // 新闻详情
  app.post('/admin/news_details',Admin.news_details);


  // 招聘列表
  app.get('/recruit_list',Admin.recruit_list);
  // 分页获取招聘列表
  app.post('/admin/get_recruits', Admin.get_recruits);

  // 招聘添加
  app.get('/add_recruit',Admin.add_recruit);
  // 招聘添加  提交数据
  app.post('/admin/post_add_recruit',Admin.post_add_recruit);

  // 招聘删除
  app.post('/admin/recruit_del',Admin.del_recruit);
  // 招聘详情
  app.post('/admin/recruit_details', Admin.get_recruit_details);
  // 离职公示
  app.get('/add_quit_notice', Admin.add_quit_notice);
  // 离职公示 添加数据
  app.post('/admin/add_quit', Admin.add_quit);
  // 离职公示列表
  app.get('/quit_notice_list', Admin.quit_notice_list);
  // 获取离职公示列表
  app.post('/admin/get_quits', Admin.get_quits);
  // 离职公示 删除
  app.post('/admin/quit_del', Admin.del_quit);

}
