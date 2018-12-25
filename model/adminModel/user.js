// 用户注册表

var mongoose = require("mongoose");

var userschema = new mongoose.Schema({
	username:String,
    password:String,
    realname:String,
    phone:String,
    //用户状态
    status:String
});

mongoose.model('User',userschema);