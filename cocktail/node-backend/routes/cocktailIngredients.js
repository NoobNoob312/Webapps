var express = require('express');
var router = express.Router();

var database = require('./database/sequelizeConnection');
var cocktailIngredients = database.sequelizeInstance.import('../models/CocktailIngredients');

// Tabelle erstellt; attributes = Spalte
router.get('/cocktailIngredients', function(req, res, next) {
    cocktailIngredients.findAll({attributes: ['cocktail_id', 'ingredient_id', 'amount']}).then(function (cocktail_ingredients) {
        res.json({"cocktail_ingredients": cocktail_ingredients});
    });
});

module.exports = router; // ohne das, nicht in app.js anwendbar