var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const RushTime = sequelize.define('user_rush_time',
		{
			id: {
				type:DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			title: DataTypes.STRING,
			user_id: DataTypes.INTEGER,
			from: DataTypes.TIME,
			to: DataTypes.TIME,
			duration: DataTypes.INTEGER,
			status:{
				type:DataTypes.BOOLEAN,
				defaultValue: 1
			},
		},
		{
			// createdAt   : 'created',
			// updatedAt   : 'modified',
			timestamps: false,
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
				// user_detail_id: function () {
				// 	return this.getDataValue('id');
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

	RushTime.associate = models => {
		 RushTime.belongsTo(models.user, {})
	}

	RushTime.prototype.toObject = function () {
		var values = Object.assign({}, this.get({plain:true}));
		return values;
	};

	return RushTime

}
