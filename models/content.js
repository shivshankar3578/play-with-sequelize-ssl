var models = require('../models');
module.exports = function (sequelize, DataTypes) {
	const Content = sequelize.define('content',
		{
			id: {
					type:DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true
			},
			status:{
				type:DataTypes.BOOLEAN,
				defaultValue: 1
			},
			slug: DataTypes.STRING,
			title: DataTypes.STRING,
			title_ar: DataTypes.STRING,
			body: DataTypes.TEXT,
			body_ar: DataTypes.TEXT,
		},
		{
			createdAt   : 'created',
			updatedAt   : 'modified',
			timestamps: true,
			paranoid: false,
			underscored: true,
			// freezeTableName: true,
			// tableName : 't_content',
			getterMethods: {
				content_id: function () {
					return this.getDataValue('id');
				}
			},
			setterMethods: {
					// description: function (value) {
					//     var parts = value.split(' ')
					//     this.setDataValue('lastName', parts[parts.length-1])
					//     this.setDataValue('firstName' parts[0]) // this of course does not work if the content has several first names
					// }
			}
		});

		Content.associate = models => {
				// Content.belongsTo(models.Bank, {})
		}

	return Content
}
