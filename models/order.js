var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Order = sequelize.define('order',
		{
			id: {
				type:DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: DataTypes.INTEGER,
			delivery_location: DataTypes.INTEGER,
			vendor_id: DataTypes.INTEGER,
			driver_id: DataTypes.INTEGER,
			name: DataTypes.STRING,
			order_no: DataTypes.STRING,
			transaction_mode: DataTypes.STRING,
			order_amount: DataTypes.INTEGER,
			tax: DataTypes.INTEGER,
			commission: DataTypes.INTEGER,
			order_total: DataTypes.INTEGER,
			delivery_charge: DataTypes.INTEGER,
			estimated_time: DataTypes.INTEGER,
			delivery_date: DataTypes.DATE,
			order_date: DataTypes.DATE,
			// instruction: DataTypes.TEXT,
			transaction_id: DataTypes.STRING,
			resp: DataTypes.TEXT,
			is_paid: DataTypes.BOOLEAN,
			// is_approved: DataTypes.BOOLEAN,
			status:DataTypes.INTEGER
		},
		{
			createdAt   : 'created',
			updatedAt   : 'modified',
			timestamps: true,
			paranoid: false,
			underscored: true,
			// freezeTableName: true,
			// tableName : 't_order',
			hooks: {
				beforeValidate: (order, options) => {
						// order.ordername = 'Toni';
				},	
				// afterValidate: FX,
				// beforeCreate: FX,
				// beforeUpdate: FX,
				// beforeBulkUpdate: FX
			},
			getterMethods: {
				order_id: function () {
					return this.getDataValue('id');
				},
				// order_no: function () {
				// 	return hashids.encode(this.getDataValue('order_no'));
				// },


				// image: function () {
				// 	return aws_path	 +'uploads/orders/'+ this.getDataValue('profile_image');
				// }
			},
			setterMethods: {
					// description: function (value) {
					//     var parts = value.split(' ')
					//     this.setDataValue('lastName', parts[parts.length-1])
					//     this.setDataValue('firstName' parts[0]) // this of course does not work if the order has several first names
					// }
			}
	});

	Order.associate = models => {
			Order.belongsTo(models.user_location, {foreignKey:"delivery_location" , as: "delivery"})
			Order.belongsTo(models.user, {foreignKey:"vendor_id" ,as : "vendor" })
			Order.belongsTo(models.user, {foreignKey:"user_id" ,as : "customer" })
			// Order.hasOne(models.user_location, {foreignKey:"user_id"})
			Order.hasMany(models.order_detail, {})
	}

	Order.prototype.toObject = function () {
		var values = Object.assign({}, this.get({plain:true}));
		return values;
	};

	return Order

}
