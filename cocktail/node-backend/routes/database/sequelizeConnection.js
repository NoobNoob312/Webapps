var sequelize = require('sequelize');

var sequelizeInstance = new sequelize('cocktail', 'user_db', 'user332', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

// Initialize models
var Cocktails = sequelizeInstance.import('../../models/Cocktail');
var Ingredients = sequelizeInstance.import('../../models/CocktailIngredients');
var User = sequelizeInstance.import('../../models/User');

// Create tables with models
sequelizeInstance.sync().then(function () {
}).catch(function (err) {
    console.log(err);
});

module.exports = {
    sequelizeInstance: sequelizeInstance,
    sequelize: sequelize
};