var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const OrderDetail = sequelize.define('order_detail',
		{
			id: {
				type:DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			order_id: DataTypes.INTEGER,
			product_id: DataTypes.INTEGER,
			unitprice: DataTypes.INTEGER,
			quantity: DataTypes.INTEGER,
			amount: DataTypes.INTEGER,
			// attributes: DataTypes.STRING,
			status:{
				type:DataTypes.BOOLEAN,
				defaultValue: 1
			},
		},
		{
			createdAt   : 'created',
			updatedAt   : 'modified',
			timestamps: true,
			paranoid: false,
			underscored: true,
			// freezeTableName: true,
			// tableName : 't_order_detail',
			hooks: {
				beforeValidate: (order_detail, options) => {
						// order_detail.order_detailname = 'Toni';
				},	
				// afterValidate: FX,
				// beforeCreate: FX,
				// beforeUpdate: FX,
				// beforeBulkUpdate: FX
			},
			getterMethods: {
				order_detail_id: function () {
					return this.getDataValue('id');
				},

			},
			setterMethods: {
					// description: function (value) {
					//     var parts = value.split(' ')
					//     this.setDataValue('lastName', parts[parts.length-1])
					//     this.setDataValue('firstName' parts[0]) // this of course does not work if the order_detail has several first names
					// }
			}
	});

	OrderDetail.associate = models => {
			OrderDetail.belongsTo(models.order, {})
			OrderDetail.belongsTo(models.product, {})
	}

	OrderDetail.prototype.toObject = function () {
		var values = Object.assign({}, this.get({plain:true}));
		return values;
	};

	return OrderDetail

}
