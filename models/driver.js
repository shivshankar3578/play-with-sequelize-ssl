var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Driver = sequelize.define('driver',
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
			otp: DataTypes.INTEGER,
			lat: DataTypes.INTEGER,
			lng: DataTypes.INTEGER,
			country_code: DataTypes.STRING,
			name:DataTypes.STRING,
			dob: DataTypes.DATE,
			model_name: DataTypes.STRING,
			device_type: DataTypes.STRING,
			device_token: DataTypes.STRING,
			access_token: DataTypes.STRING,
			car_no: DataTypes.STRING,
			license: DataTypes.STRING,
			car_document: DataTypes.STRING,
			car_insurance: DataTypes.STRING,
			description: DataTypes.TEXT,
			approved: DataTypes.BOOLEAN,
			offline: DataTypes.DATE,
			online: DataTypes.DATE,
			is_online: DataTypes.BOOLEAN,
			verified: DataTypes.BOOLEAN,
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
			// tableName : 't_driver',
			hooks: {
				beforeValidate: (driver, options) => {
						// driver.drivername = 'Toni';
				},	
				// afterValidate: FX,
				// beforeCreate: FX,
				// beforeUpdate: FX,
				// beforeBulkUpdate: FX
			},
			getterMethods: {
				driver_id: function () {
					return this.getDataValue('id');
				},
				picture: function () {
					return this.getDataValue('image');
				},
				// picture: function () {
				// 	return aws_path	 + this.getDataValue('image');
				// },
				// phone: function () {
				// 	return this.getDataValue('country_code')+this.getDataValue('phone');
				// },
				fullName: function () {
					return this.getDataValue('name');
				},
				
			},
			setterMethods: {
				image: function (value) {
					this.setDataValue('image',aws_path+value )
				},
				name: function (value) {
					this.setDataValue('name',decodeURI(value) )
				}
			}
	});

	Driver.associate = models => {
			// Driver.belongsTo(models.bank, {})
	}

	// Driver.auth = sid => {
	// 	return Driver.findOne()
	// }

	Driver.prototype.toObject = function () {
		var values = Object.assign({}, this.get({plain:true}));
		delete values.password;
		return values;
	};

	return Driver

}
