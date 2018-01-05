const app = require('../app');
const events = require('events');
const util = require('util');
const { users, serverErr,customers } = require('./shared');
// const {UserInfo	} = require('../app/models/classes');

// const chatEvents = require('./chatEvents');
// const checkinEvents = require('./checkinEvents');
// const groupchatEvents = require('./groupchatEvents');

module.exports = function(io){

	io.use(require('socketio-wildcard')());

	io.use(require('./middleware'));

	io.on('connection', (socket)=>{
		console.log("connection done", socket.user?socket.user.id : 'no user', socket.customer ? socket.customer.user_id : 'no customer' );
		// var ioRoom = io.sockets.adapter.rooms;
		// assert.equal(socket, this)
		// socket.user.online = true
		
		socket.on("*", (packet)=>{
			// return socket.emit("error", new Error(serverErr));
			// packet.data ['event_name', 'postData', [func]]
			// dynamic msg event listing
			console.info(" ***** Event calling *****");
				console.dir({
					listing:packet.data[0],
					postData : packet.data[1],
					socket: socket.id,
					// user: socket.user.id
				});
		})
	
		socket.on("disconnect", ()=>{

			// socket.user.online = false
			if(socket.user)
				delete(users[socket.user.id])
			if(socket.order)
				delete(users[socket.order.user_id])
			console.dir({
				"users": Object.keys(users),
				"customer":Object.keys(customers)
			});
		})

		socket.on("error", (err)=>{
			console.error("server err", err);
			socket.emit("stdErr", serverErr)
		})

	});
}
