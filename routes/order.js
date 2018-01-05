var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
const { users } = require('../socket/shared');
// const orderEvents = require('../socket/orderEvents')


router.get('/order/detail/:order_id', (req, res, next)=>{
	var data = { }
	Order.findById(req.params.order_id,
		{
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
			attributes: ["lat", "lng", "fullName","business_name","business_name_arb", "address", "location","phone"]
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
		}]
	})
	.then(order=>{
		data.order = order.get({plain:true})

		if(data.order.driver_id)
			return res.status(200).json({
				replyCode: "success",
				status: "accepted",
				data: data.order,
				replyMsg: "Order already accepted"
			});
		else
			return res.status(200).json({
				replyCode: "success",
				status: "waiting",
				data: data.order,
				replyMsg: "Order found"
			});
	})
})


router.get('/order/accept/:order_id', (req, res, next)=>{
 var postData = req.body
 var data ={ }
  // Order.findOne({
 	// 	where:{
 	// 		driver_id: req.user.id,
	 // 		status: {$and:	[{$not:8}]},
	 // 		id: { $not : req.params.order_id}
	 // 	}
	 // })
 	// .then(order=>{
 	// 	data.order = order
 	// 	if(order)
 	// 		return new Promise((resolve, reject) => {
 	// 			reject(new Error(DM.already_have_active_orders))
 	// 		});
	 // 	return	
	 	Order.findById(req.params.order_id)
	 	// })
 	.then(order=>{
 		order = order.get({plain:true})
 		data.order = order
 		if(order.driver_id) 
 				return new Promise((resolve, reject) => {
 					reject(new Error(DM.order_already_assigned))
 				});
		return	Order.update({driver_id: req.user.id}, {
			where:{
				id: req.params.order_id
			}
		})
	})
	.then(done=>{
		//	query to get near by users from this order {geo}
		Object.keys(users).forEach(v=>{
			var client = users[v]
			if(client)
				if(client.user.id != req.user.id)
				client.emit("orderExpire", {id: req.params.order_id})
		})
		
		
		const { customers } = require('../socket/shared')
		console.log(`users.length`, Object.keys(customers))

		let customer = customers[data.order.user_id]
		// console.log(`customer`,customer );
		if(customer && typeof customer.emit == 'function')
			customer.emit("driverLocation", {
				lat:postData.lat,
				lng:postData.lng,
				status:data.order.status
			})

		return res.status(200).json({
			replyCode: "success",
			data:data.order,
			replyMsg: "order acceted successfully"
		});
	})
	.catch(err=>{
	 return next(err);
	});
 
});



router.post('/order/changeStatus', (req, res, next)=>{
	var data = {}
  Order.findOne({
 		where:{
 			driver_id: req.user.id,
	 		status: {$and:	[{$not:7}]},
	 		id: { $not : req.params.order_id}
	 	}
	 })
 	.then(order=>{
 		data.order = order
 		if(order)
 			return new Promise((resolve, reject) => {
 				reject(new Error(DM.already_have_active_orders))
 			});

	 	return Order.update({
		 		status : req.body.status
		 	},
		 	{
		 		where: {
		 			id: req.body.order_id
		 	},
		 		// fields:[],
		})	

	 	})
	.then(done=>{
		return Order.findById(req.body.order_id,
			{
			include:[
			{
				model: User,
				as:"vendor",
				attributes: ["lat", "lng", "fullName","business_name","business_name_arb", "address", "location", "phone", "email"]
			},
			{
				model: User,
				as:"customer",
				attributes: ["fullName", "address", "phone", "email"]
			}]
		})
	})
	.then(order=>{
		res.status(200).json({
			replyCode: "success",
			replyMsg: "order status udpated successfully"
		 });
		order = order.get({plain:true})
		// send email when order picked 	
		var track = `https://web.fudoo.com/track-order/`+ order.order_no
		if(req.body.status==7)

			sequelize.query("insert into order_stages values ('', ?, ?, '')",
				{ replacements: 
							[ req.body.order_id,req.body.status]
				})
			.then(done=>{	
				return Email_template.findOne({
						where:{
							email_type:'order_picked'
						}
					})
			})
			.then(template=>{	
				template = template.toObject()
				var msg = template.message
				msg = msg.replace("\[order_no\]", order.order_no)
				msg = msg.replace("\[driver\]", req.user.name)
				msg = msg.replace("\[track\]", track)
				msg = msg.replace("\[track\]", track)
				msg = msg.replace("\[sitename\]", process.env.sitename)
				template.message  = msg

				return Promise.all([
					PX.sendMail(template, {email:order.customer.email}),
					PX.sendMsg("+40"+order.customer.phone, "Order No"+order.order_no+"is picked by driver "+req.user.name+ " Order will be deliver you soon. you can track your order using "+track)
				])

			})
			.then(done=>{
					console.log(done)
			})

		if(req.body.status==8)
			sequelize.query("insert into order_stages values ('', ?, ?, '')",
				{ replacements: 
							[ req.body.order_id,req.body.status]
				})
			.then(done=>{	

			return Email_template.findOne({
						where:{
							email_type:'order_completed'
						}
					})
			})
			.then(template=>{	
				template = template.toObject()
				var msg = template.message
				msg = msg.replace("\[order_no\]", order.order_no)
				msg = msg.replace("\[order_no\]", order.order_no)
				msg = msg.replace("\[order_amount\]", order.order_amount)
				msg = msg.replace("\[driver\]", req.user.name)
				msg = msg.replace("\[sitename\]", process.env.sitename)
				template.message  = msg
					// console.log(msg);
				return Promise.all([
					PX.sendMail(template, {email:order.vendor.email}),
					PX.sendMail(template, {email:order.customer.email}),
					PX.sendMsg("+40"+order.customer.phone, "Order No"+order.order_no+"is completed by driver "+req.user.name )
				])

			})
			.then(done=>{
					console.log(done)
			})
	})
	.catch(err=>{
	 return next(err);
	});

});


module.exports = router;
