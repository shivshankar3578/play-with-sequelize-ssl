var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
// var { DriverInfo } =  require('./utils/classes');

// console.log(PX.crypto("1", "encrypt"));
router.get('/driver/activeOrder', activeOrder)

function activeOrder(req, res, next){
	Order.findAll({
		where: {
			status:{ 
				$and:	[{$not:8}]
			},
			driver_id: req.user.id
		},
		include:[{
			model:Order_detail,
			// attributes: ["item"],
			include:[{
				model:Product,
				attributes: ["item", "prep_time", "unit", "description", "image"]
			}]
		}, 
		{
			model: User,
			as:"vendor",
			attributes: ["lat", "lng", "fullName","business_name","business_name_arb","location", "address","phone"]
		},
		{
			model: User_location,
			as:"delivery",
			attributes: ["lat", "lng", "location", "address"]
		}, 
		{
			model: User,
			as:"customer",
			attributes: ["fullName", "address", "phone"]
		}]
	})
	.then(order=>{
		if(!order)
			return res.status(200).json({
				replyCode: "success",
				data:[],
				replyMsg: "no order found"
			 });
		// var order = order.get({plain:true})
		console.log(order.id);
	 res.status(200).json({
		replyCode: "success",
		data: order,
		replyMsg: "order found"
	 });
	})
	.catch(err=>{
		return next(err);
	});


}
router.get('/driver/orders', (req, res, next)=>{
	if(req.query.status==1)
			return activeOrder(req, res, next)
	var where = {
			driver_id: req.user.id
		}
	where.status = req.query.status

	Order.findAll({
		where:where,
		include:[{
			model:Order_detail,
			// attributes: ["item"],
			include:[{
				model:Product,
				attributes: ["item", "prep_time", "unit", "description", "image"]
			}]
		}, 
		{
			model: User,
			as:"vendor",
			attributes: ["lat", "lng", "fullName","business_name","business_name_arb", "address", "location", "phone"]
		},
		{
			model: User_location,
			as:"delivery",
			attributes: ["lat", "lng", "location"]
		}, 
		{
			model: User,
			as:"customer",
			attributes: ["fullName", "address", "phone"]
		}]
	})
	.then(orders=>{
		// if(!orders.length)
		// 	return new Promise((resolve, reject) => {
		// 		reject(new Error("Order Not found"))
		// 	});

		res.status(200).json({
			replyCode: "success",
			data: orders,
			replyMsg: "orders found"
		 });
	})
	.catch(err=>{
		return next(err);
	});
})


router.post('/driver/changePassword', (req, res, next)=>{
	req.user.password =  sha1(process.env.secret + req.body.password)
	req.user.save()
	.then(user=>{
		return res.status(200).json({
			replyCode: "success",
			replyMsg: "password change successfully"
		 });
	
	})
	.catch(err=>{
	 return next(err);
	});
 
});
	
router.get('/driver/goOnline', (req, res, next)=>{
	req.user.online = new Date()
	req.user.is_online = 1
	req.user.save()
	.then(done=>{
		return res.status(200).json({
			replyCode: "success",
			replyMsg: "You are now online"
		 });
	
	})
	.catch(err=>{
	 return next(err);
	});
 
});


router.post('/driver/updateLocation', (req, res, next)=>{
	var postData = req.body
	var data = { }
	Driver.update(postData,{
		fields:["lat", "lng"],
		where: {
			id:req.user.id
		}
	})
	.then(done=>{
		return Order.findOne({
			where:{
					status:7,
					driver_id: req.user.id
				}
		})
	})
	.then(order=>{
		res.status(200).json({
			replyCode: "success",
			replyMsg: "location updated successfully"
		 });
		if(!order) return ;
		var order = order.get({plain:true})
		console.log(`order.id`,order.id);

		const { customers } = require('../socket/shared')
		console.log(`customers.length`, Object.keys(customers))

		let customer = customers[order.user_id]
		// console.log(`customer`,customer );
		if(customer && typeof customer.emit == 'function'){
			console.log("emited to", customer.order.id)
			customer.emit("driverLocation", {
				lat      : postData.lat,
				lng      : postData.lng,
				order_id : order.id,
				status   : order.status
			})
		}
	})
	.catch(err=>{
	 return next(err);
	});
 
});

// setInterval(function() {

// 	const { customers } = require('../socket/shared')
// 	console.log(`users.length`, Object.keys(customers))
// 	for(key in customers){
// 		let customer = customers[key]
// 		// console.log(`customer`,customer );
// 		if(customer && typeof customer.emit == 'function')
// 			customer.emit("driverLocation", {
// 				lat:23.157821,
// 				lng:75.135782,
// 				status:3,
// 				eta:"14 min"
// 			})
// 	}

// }, 3000);
// 

router.post('/driver/editProfile', (req, res, next)=>{
	var postData = req.body
	if(postData.new_picture) postData.picture = postData.new_picture

	Driver.update(postData,{
		fields:["name","image", "lat", "lng"],
		where: {
			id:req.user.id
		}
	})
	// .then(done=>{
	// 	// return Driver.findById(req.user.id)
	// })
	.then(user=>{
		postData.ssid = PX.crypto(req.user.id, 'encrypt')
		res.status(200).json({
			replyCode: "success",
			data: Object.assign(req.user.toObject(), postData),
			replyMsg: DM.profile_updated
		 });
	
	})
	.catch(err=>{
	 return next(err);
	});
 
});


router.get('/driver/goOffline', (req, res, next)=>{
	req.user.offline = new Date()
	req.user.is_online = 0
	req.user.save()
	.then(done=>{
		return res.status(200).json({
			replyCode: "success",
			replyMsg: "You are now offline"
		 });
	
	})
	.catch(err=>{
	 return next(err);
	});
 
});



router.get('/driver/logout', (req, res, next)=>{
	Driver.update({
		device_type: "",
		is_online : 0,
		offline : new Date(),
	},
	{
		where:{
			id:req.user.id
		}
	})
	.then(done=>{
		return res.status(200).json({
			replyCode: "success",
			replyMsg: "logout successfully"
		 });
	})
	.catch(err=>{
	 return next(err);
	});
})

router.get('/driver/myOrders', (req, res, next)=>{
 var postData = req.body
	 where  = {
			driver_id : req.user.id
		}
	Object.assign(where, req.query)
 	Order.findAll({
		where: where,
		include:[{
			model:Order_detail
		}]
	})
	.then(orders=>{
		return res.status(200).json({
			replyCode: "success",
			data: orders,
			replyMsg: "Orders found"
		 });
	})
	.catch(err=>{
	 return next(err);
	});
 
});


router.get('/driver/notifications', (req, res, next)=>{
 	Notification.findAll({
		where: {
			driver_id : req.user.id
		},
		include:[{
			model:Order,
			include:[
			{
				model:Order_detail,
				// attributes: ["item"],
				include:[{
					model:Product,
					attributes: ["item", "prep_time", "unit", "description", "image"]
				}]
			},
			{
				model: User_location,
				as:"delivery",
				attributes: ["lat", "lng", "address", "location"]
			}, 
			{
				model: User,
				as:"customer",
				attributes: ["fullName", "address", "phone"]
			},
			{
				model: User,
				as:"vendor",
				attributes: ["lat", "lng", "fullName","business_name","business_name_arb", "prep_time", "address", "location", "image", "phone"],
				include:[{
					model:User_rush_time,
				}]
			}]
		}]
	})
	.then(data=>{
		return res.status(200).json({
			replyCode: "success",
			data: data,
			replyMsg: "notification found"
		 });
	})
	.catch(err=>{
	 return next(err);
	});
 
});




module.exports = router;
