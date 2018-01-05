var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Email_template = sequelize.define('email_template',
		{
			id: {
				type:DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			title: DataTypes.STRING,
			email_type: DataTypes.STRING,
			sender_name: DataTypes.STRING,
			sender_email: DataTypes.STRING,
			subject: DataTypes.STRING,
			message: DataTypes.STRING,
			// status:{
			// 	type:DataTypes.BOOLEAN,
			// 	defaultValue: 1
			// },
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

	Email_template.associate = models => {
			// Email_template.belongsTo(models.order_detail, {})
	}

	Email_template.prototype.toObject = function () {
		var values = Object.assign({}, this.get({plain:true}));
		return values;
	};

	return Email_template

}
