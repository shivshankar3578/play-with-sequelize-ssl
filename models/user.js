var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const User = sequelize.define('user',
		{
			id: {
				type:DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			email:{
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			phone:{
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			status:{
				type:DataTypes.BOOLEAN,
				defaultValue: 1
			},
			password: DataTypes.STRING,
			// otp: DataTypes.INTEGER,
			lat: DataTypes.INTEGER,
			lng: DataTypes.INTEGER,
			prep_time: DataTypes.INTEGER,
		  fullName:DataTypes.STRING,
		  business_name:DataTypes.STRING,
		  business_name_arb:DataTypes.STRING,
			// online: DataTypes.DATE,
			// offline: DataTypes.DATE,
			address: DataTypes.STRING,
			device_type: DataTypes.STRING,
			device_token: DataTypes.STRING,
			image:{
				type:	DataTypes.STRING,
				// defaultValue:'user.png'
			},
		},
		{
			createdAt   : 'created',
			updatedAt   : 'modified',
			timestamps: true,
			paranoid: false,
			underscored: true,
			// freezeTableName: true,
			// tableName : 't_user',
			hooks: {
				beforeValidate: (user, options) => {
						// user.username = 'Toni';
				},	
				// afterValidate: FX,
				// beforeCreate: FX,
				// beforeUpdate: FX,
				// beforeBulkUpdate: FX
			},
			getterMethods: {
				user_id: function () {
					return this.getDataValue('id');
				},
				image: function () {
					return aws_path	 + this.getDataValue('image');
				},
				picture: function () {
					return aws_path	 + this.getDataValue('image');
				},
				address: function () {
					return this.getDataValue('location');
				},
				name: function () {
					return this.getDataValue('role_id')==2 ? this.getDataValue('business_name') : this.getDataValue('name') ;
				}
			},
			setterMethods: {
					// description: function (value) {
					//     var parts = value.split(' ')
					//     this.setDataValue('lastName', parts[parts.length-1])
					//     this.setDataValue('firstName' parts[0]) // this of course does not work if the user has several first names
					// }
			}
	});

	User.associate = models => {
			User.hasOne(models.user_rush_time, {})
	}

	// User.auth = sid => {
	// 	return User.findOne()
	// }

	User.prototype.toObject = function () {
		var values = Object.assign({}, this.get({plain:true}));
		delete values.password;
		return values;
	};

	return User

}
