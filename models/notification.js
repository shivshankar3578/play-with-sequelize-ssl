var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Notification = sequelize.define('notification',
		{
			id: {
				type:DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			driver_id: DataTypes.INTEGER,
			order_id: DataTypes.INTEGER,
			message: DataTypes.TEXT,
			type: DataTypes.INTEGER,

			status:{
				type:DataTypes.BOOLEAN,
				defaultValue: 1
			},
	
			// image:{
			// 	type:	DataTypes.STRING,
			// 	// defaultValue:'user.png'
			// },
		},
		{
			createdAt   : 'created',
			updatedAt   : 'modified',
			timestamps: true,
			paranoid: false,
			underscored: true,
			// freezeTableName: true,
			tableName : 'driver_notifications',
			hooks: {
				beforeValidate: (notification, options) => {
						// notification.notificationname = 'Toni';
				},	
				// afterValidate: FX,
				// beforeCreate: FX,
				// beforeUpdate: FX,
				// beforeBulkUpdate: FX
			},
			getterMethods: {
				notification_id: function () {
					return this.getDataValue('id');
				},
				
			},
			setterMethods: {
				// image: function (value) {
				// 	this.setDataValue('image',aws_path+value )
				// },
			}
	});

	Notification.associate = models => {
			Notification.belongsTo(models.order, {})
	}

	// Notification.auth = sid => {
	// 	return Notification.findOne()
	// }

	Notification.prototype.toObject = function () {
		var values = Object.assign({}, this.get({plain:true}));
		delete values.password;
		return values;
	};

	return Notification

}
