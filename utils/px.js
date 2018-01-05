const EmailTemplate = require('email-templates').EmailTemplate;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const gcm = require('node-gcm');
const apn = require('apn');
global.gservice = new gcm.Sender(process.env.GCM_KEY);

const AWS = require('aws-sdk');
AWS.config.update({
		accessKeyId: process.env.AWS_KeyId,
		secretAccessKey: process.env.AWS_secret,
		// region:process.env.AWS_region  
});

const s3 = new AWS.S3({   signatureVersion: 'v4',  })
var multer = require('multer')
var multerS3 = require('multer-s3')
var photoBucket = new AWS.S3({
	params: {
		Bucket: 'fudoo'
	}
})

const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
		from: process.env.SMTP_FROM,
		host: process.env.SMTP_HOST, // hostname
		service: process.env.SMTP_SERVICE,
		auth: {
				user: process.env.SMTP_AUTH_USER,
				pass: process.env.SMTP_AUTH_PASS
		}
});



module.exports = {
	sendMsg: function(mobile, msg, payload) {
		console.log(`sendMsg called`,mobile);
		var sns = new AWS.SNS();
		var params = {
				Message: msg,
				MessageStructure: 'string',
				PhoneNumber: mobile,
				Subject: 'FUDOO',
				// TopicArn:'arn:aws:sns:us-west-2:490660504137:FUDOO'
		};

		sns.publish(params, function(err, data) {
			console.log(err, data);
		});
	},
	sendPush: function(user, msg, payload) {
		console.log("apn called", user, user.device_token);
		
		// payload.sound = "default";
		if(user.device_type=='ios'){
			payload.sound=  'ctu_ringtone.caf'
			var note = new apn.notification();
			var tokens = [user.device_token];
			note.setAlertText(msg);
			note.badge = user.badge? user.badge: 0;
			note.sound = "ctu_ringtone.caf";
			note.payload = payload
			cservice.pushNotification(note, tokens);
		}

		if(user.device_type=='android'){
			payload.sound=  'ctu_ringtone'
		var bodyData = {
					priority: 'high', 
					contentAvailable: true, 
					delayWhileIdle: true, 
					timeToLive: 10,
					registration_ids: [user.device_token ],
					data: Object.assign({
						vibrate: 1,
						sound: 'ctu_ringtone',
						message: msg,
						title: msg,
						largeIcon: 'large_icon',
						smallIcon: 'small_icon',
					}, payload)
				}

		require('request')({
				url: 'https://android.googleapis.com/gcm/send',
				method: 'POST',
				headers: {
					'Content-Type' :' application/json',
					'Authorization': 'key=' + process.env.GCM_KEY
				},
				body: JSON.stringify(bodyData)
			}, function(error, response, body) {
				console.log(error,body)
		})
		}
	},

	crypto: function(text, type) {
		var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
		var key = 'password';

		if(type.toString() === 'encrypt') {
				var cipher = crypto.createCipher(algorithm, key);
				var encrypted = cipher.update(text.toString(), 'utf8', 'hex') + cipher.final('hex');
				return encrypted;
		} else {
				var decipher = crypto.createDecipher(algorithm, key);
				var decrypted = decipher.update(text.toString(), 'hex', 'utf8') + decipher.final('utf8');
				return decrypted;
		}
	},

	uploadFile: function(file, label, thumb){
		console.log("uploadFile called", file);

		return new Promise((resolve, reject)=>{

			if(!file || !label)  return resolve(null)
			// console.log(file);
			var source = file.path;
			var filename = randomString.generate() + file.name.substr( file.name.lastIndexOf('.'), file.name.length);
			console.log(filename);
				photoBucket.upload({
						ACL: 'public-read', 
						Body: fs.createReadStream(source), 
						Key: filename,
						ContentType: 'application/octet-stream' // force download if it's accessed as a top location
				},(err, response)=>{
					if(err) return reject(err)
					return resolve(filename);
				});
		});
	},

	uploadFileBase64 : function(data, label, thumb){
		 console.log("uploadFileBase64 called");
		return new Promise((resolve, reject)=>{
			 if(!data)  return resolve(null);
			 var filename = randomString.generate()+".jpeg"
				target = path.join(UPLOAD_PATH, label, filename);
				fs.writeFile(target, new Buffer(data, "base64"), function (err) {
					 if(err) return reject(err)
					 return resolve(filename);
				});
		 });
	},
	sendMail: function(template, postData) {
		console.log("sendMail called");
		// console.log(message);
		// return 0;
		new Promise((resolve, reject)=>{
			transport.sendMail({
					from: process.env.FROM_MAIL,
					to: postData.email,
					subject: template.subject,
					html: template.message,
				}, (err, responseStatus)=> {
					if(err) return reject(err)
					return resolve(responseStatus);
			});
		})
	}
}
