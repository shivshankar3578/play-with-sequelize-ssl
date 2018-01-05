module.exports = function(req, res, next) {
	console.log(`auth stage called`);
	var ssid = req.headers.ssid;
	if(!ssid)		
		return  next(new Error("Please provide ssid")); 

	try{
		var user_id = PX.crypto(ssid.toString(), 'decrypt');
	}catch(e){
		return next(new Error("wrong ssid"))
	}

	console.log("before welcome ", user_id);
	Driver.findOne({
		where:{ id: user_id }
	})
	.then((user)=>{
		if(!user)
			return next(new Error("Invalid user"))

		// user=	user.get({ plain: true})
		// if(req.headers.access_token != userData.access_token)
		// 	return next(new Error("Invalid access token"))
		req.user = user
		next()
	})
	.catch((err)=> {
				return next(err);
	});

}
