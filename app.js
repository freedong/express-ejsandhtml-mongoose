var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// session插件
var session = require('express-session');

//加载ueditor 模块
var ueditor = require("ueditor");

// 图片验证码插件的使用
var svgCaptcha = require('svg-captcha');



var app = express();

// 执行和连接数据库
var mongoose = require("./db_config/mongoose.js");
var db = mongoose();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',require('ejs').__express);
app.set('view engine', 'html');
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//这里周期只设置为20秒，为了方便测试
//secret在正式用的时候务必修改
//express中间件顺序要和下面一致

app.use(session({//session持久化配置
  secret: "zxd",
  key: "zxd",
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//超时时间
  saveUninitialized: true,
  resave: false,
}));


// 请求后台配置项http错误，上传功能将不能正常使用！ueditor.all.min.js
// 后端配置ueditor的上传图片
app.use("/ueditor/ue",ueditor(path.join(__dirname,'public'),function(req,res,next){
  // ueditor 客户发起上传图片请求
  if(req.query.action === 'uploadimage'){
    var foo = req.ueditor;
    var imgname = req.ueditor.filename;
    var img_url = '/images/ueditor/';
    res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage') {
    var dir_url = '/images/ueditor/';
    res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起其它请求
  else {
    // console.log('config.json')
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/ueditor/jsp/config.json');
  }
}));
// 后端配置ueditor的上传图片



// 图片验证码插件的使用

app.get('/captcha', function (req, res) {
  var captcha = svgCaptcha.create({
    size: 4, // 验证码长度
    ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    noise: 1, // 干扰线条的数量
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    background: '#c4c4c5' // background color of the svg image
  });
  console.log("session");
  //将生成的验证码放在session中
  req.session.captcha = captcha.text;
  console.log( req.session.captcha);
  res.set('Content-Type', 'image/svg+xml');
  res.status(200).send(captcha.data);
});


// 网站页面
require('./routes/websiteRoute/index')(app);
// var indexRouter = require('./routes/websiteRoute/index');
// app.use('/web', indexRouter);
// 后台管理页面
require("./routes/adminRoute/users")(app);
// var usersRouter = require('./routes/adminRoute/users');
// app.use('/admin', usersRouter);


/*官网后台做操作是需要，登录验证*/
app.use(function(req,res,next){
  if(!req.session.user){
    if(req.url == '/login'||req.url == '/register'){
      //如果请求的地址是登录则通过，进行下一个请求
      next();
    }else{
      res.redirect('/login')
    }
  }else if(req.session.user){
    next();
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('websiteHtml/index/error');
});

module.exports = app;
