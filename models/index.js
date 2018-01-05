var fs = require('fs'),
	path = require('path'),
	Sequelize = require('sequelize'),
	db = {};
var sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
	"host": process.env.MYSQL_HOST,
	"dialect": "mysql"
});
global.sequelize = sequelize
sequelize
	.authenticate()
	.then(function(err) {
		console.log('Connection has been established successfully.');
	}, function(err) {
		console.log('Unable to connect to the database:', err);
	});

 // sequelize.sync()


fs.readdirSync(__dirname).filter(function(file) {
	return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function(file) {
	var model = sequelize.import(path.join(__dirname, file));
	db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
});


module.exports = db;
