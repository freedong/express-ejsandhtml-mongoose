var mongoose = require("mongoose");
var config = require("./db_url.js");


module.exports = function(){
	var db = mongoose.connect(config.mongodb);
			 require("../model/adminModel/user.js");
	return db;
}
