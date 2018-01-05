var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Product = sequelize.define('product',
		{
			id: {
				type:DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: DataTypes.INTEGER,
			category_id: DataTypes.INTEGER,
			item: DataTypes.STRING,
			item_ar: DataTypes.STRING,
			price: DataTypes.INTEGER,
			prep_time: DataTypes.INTEGER,
			unit: DataTypes.INTEGER,
			description: DataTypes.TEXT,
			description_ar: DataTypes.TEXT,
			image: DataTypes.STRING,
			instant: DataTypes.INTEGER,
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
				// image: function () {
				// 	return aws_path	 + this.getDataValue('profile_image');
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

	Product.associate = models => {
			// Product.belongsTo(models.order_detail, {})
	}

	Product.prototype.toObject = function () {
		var values = Object.assign({}, this.get({plain:true}));
		return values;
	};

	return Product

}
