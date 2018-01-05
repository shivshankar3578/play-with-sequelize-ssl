const { users,customers, serverErr } = require('./shared');
module.exports = function(socket, next) {
		// console.log(next.toString());
	// console.log("middleware:",socket.handshake);

	var ssid = socket.handshake.query.ssid;
	var uid = socket.handshake.query.uid;

	if(ssid)
		try{
		 
		 user_id = PX.crypto(ssid.toString(), 'decrypt');
		 Driver.findById(user_id)
		 .then((driver)=>{
		 		if(!driver)
		 		return next(new Error("Invalid driver"))

		 	console.log("before welcome ", user_id);
		 	// if(req.headers.access_token != userData.access_token)
		 	// 	return next(new Error("Invalid access token"))
	 		driver = driver.get({plain:true})
		 	socket.user = driver
		 	// if(client = users[user_id])
		 	// 		client.disconnect()
		 	users[user_id] = socket
		 		next()
		 })
		 .catch((err)=> {
		 			return next(err);
		 });

		}catch(e){
			return next(new Error("wrong ssid"))
		}

	else if(uid)
		 Order.findOne({
					where:{
						user_id:uid
					}
				})
		 .then((order)=>{
		 		if(!order)
		 		return next(new Error("Invalid order")) 	
			 	console.log("before welcome ", uid);
		 		order = order.get({plain:true})
			 	socket.order = order
			 	customers[uid] = socket

			 	next()
		 })
		 .catch((err)=> {
		 			return next(err);
		 });

	else	
		next(new Error("please provide valid arguments"))
		
}
