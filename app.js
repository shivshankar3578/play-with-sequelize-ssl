var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var crypto = require('crypto');
var url = require("url");
global.moment = require('moment');
const cors = require('cors');
const nunjucks = require('nunjucks');
const multipart = require('connect-multiparty');
const methodOverride = require('method-override')
const sequelize = require('sequelize');
require('dotenv').load();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
global.sha1 = require('sha1');
const hashids = require('hashids')
global.hashids = new hashids('secret', "4")

global.fs = require('fs');
global.path = require('path');
global.util = require('util');
global.randomString = require("randomstring");
global.flash = require('connect-flash');
global.baseurl = "http://"+process.env.HOST+"/carwah/driver_app/public/"
global.aws_path = 'https://fudoo.s3.amazonaws.com/'
global.PUBLIC = process.env.PUBLIC
global.SALT_FACTOR = process.env.SALT_FACTOR

// require('twilio')(apiKey, apiSecret, { accountSid: accountSid }); 
global.twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN); 
// global.twilio = require('twilio')(
// 	process.env.TWILIO_ACCOUNT_SID,
// 	process.env.TWILIO_AUTH_TOKEN
// );

	// config debug
var debug = require('debug');
Object.keys(console).forEach((v)=>{
	d =  debug(`fudoo:${v}`);
	debug[v] = console.log.bind(console);
	console[v] = d;
})

global.cservice = require("./apn")


global.PX = require('./utils/px.js');
global.defaults = require('./defaults');


global.DM_en = require('./locale/en').APP_MESSAGES;
global.DM_rm = require('./locale/rm').APP_MESSAGES;

global.models = require('./models');
Object.keys(models).forEach((name)=> {
		var Name = name.charAt(0).toUpperCase() + name.slice(1);
		global[Name] = models[name]
})

var index = require('./routes/index');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(logger('dev'));
app.use(cookieParser());
app.use(multipart());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, os, version ssid ");
	next();
});
app.use(methodOverride())

//	middleware throughtout app
app.use(function(req,res,next){
	global.LPP = req.body.limit ? req.body.limit : 5
	// console.log(req.headers);
	if(req.headers.language=='rm')
		global.DM = DM_rm
	else
		global.DM = DM_en
	next();
});

app.use('/app/*', (req, res, next)=>{
	var ctrl = req.baseUrl.split('/')[2];
	var method = req.baseUrl.split('/')[3];
	if(!ctrl) ctrl = 'index'
	if(!method) method = 'index'
	if(req.body.email) req.body.email.toLowerCase()
	res.locals.ctrl = ctrl
	res.locals.method = method
	console.dir({ ctrl: ctrl, 
		method:method, 
		body: req.body, 
		params: req.params,
		query: req.query,
		query: req.headers
	});
		next()
});
//	non auth (public) function are here
app.use('/app/', index);

//	auth start
var auth = require('./auth')
app.use(auth)

//	now all below routes need auth
fs.readdirSync(path.join(__dirname, 'routes'))
	.forEach(function(filename) {   console.log("check");
		if (filename.indexOf('.') != 0 || filename != 'index.js') {
			var route = require(path.join(__dirname, 'routes', filename))
			app.use('/app/', route);
		}
	});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	console.error("app error handler called", err);
		//	change message for production mode
	if(req.app.get('env') != 'development')
		var err = { message: DM.server_error };

	if (err instanceof sequelize.Error)
		err.message =  err.errors[0].message;

	res.locals.error = err.message;
	res.locals.message = err.message;
	res.status(400);

	return res.json({
		replyCode: "error",
		replyMsg: err.message
	})

});

module.exports = app;
