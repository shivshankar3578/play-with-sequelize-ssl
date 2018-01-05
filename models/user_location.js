var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const UserLocation = sequelize.define('user_location',
		{
			id: {
				type:DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: DataTypes.INTEGER,
			title: DataTypes.STRING,
			location: DataTypes.STRING,
			address: DataTypes.STRING,
			lat: DataTypes.INTEGER,
			lng: DataTypes.INTEGER,
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
			// tableName : 't_user_detail',
			hooks: {
				beforeValidate: (user_detail, options) => {
						// user_detail.user_detailname = 'Toni';
				},	
				// afterValidate: FX,
				// beforeCreate: FX,
				// beforeUpdate: FX,
				// beforeBulkUpdate: FX
			},
			getterMethods: {
				user_detail_id: function () {
					return this.getDataValue('id');
				},

				// location: function () {
				// 	return this.getDataValue('address');
				// },

			},
			setterMethods: {
					// description: function (value) {
					//     var parts = value.split(' ')
					//     this.setDataValue('lastName', parts[parts.length-1])
					//     this.setDataValue('firstName' parts[0]) // this of course does not work if the user_detail has several first names
					// }
			}
	});

	UserLocation.associate = models => {
			// UserLocation.belongsTo(models.order, {})
	}

	UserLocation.prototype.toObject = function () {
		var values = Object.assign({}, this.get({plain:true}));
		return values;
	};

	return UserLocation

}
