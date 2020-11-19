var express = require('express');
var router = express.Router();

var database = require('./database/sequelizeConnection');
var ingredients = database.sequelizeInstance.import('../models/Ingredient');

// Tabelle erstellt; attributes = Spalte
router.get('/ingredients', function (req, res, next) {
    ingredients.findAll({attributes: ['id', 'ingredient_name']}).then(function (ingredients) {
        res.json({"ingredients": ingredients});
    })
});

module.exports = router;