var express = require('express');
var router = express.Router();
let uuidv4 = require('uuid/v4');
const multer = require("multer");
const cors = require('cors');

var database = require('./database/sequelizeConnection');
var cocktails = database.sequelizeInstance.import('../models/Cocktail');

const DIR = './public/uploads/';

router.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// A3: Der GET-Request vom Frontend kommt hier an.
// Die Funktion liest aus der SQLite Datenbank die Daten aus
// und sendet ein JSON mit den Daten zurück
// Tabelle erstellt; attributes = Spalte
router.get('/', function (req, res, next) {
    cocktails.findAll({attributes: ['id', 'name', 'imageName', 'preparation']}).then(function (cocktails) {
        res.json({"cocktails": cocktails});
    })
});

// modify cocktail
router.put('/', function(req, res, next) {

    var id = req.body.id || -1;
    var name = req.body.name || '';
    var imageName = req.body.imageName || '';
    var preparation = req.body.preparation || '';
    console.log('PUT' + name);


    var modifyCocktail = cocktails.update ({
        id: id,
        name: name,
        imageName: imageName,
        preparation: preparation
    });

    modifyCocktail.save().catch(function (error) {
        console.log('Error while modifying: ' + error.stack);
    });
    res.json({"info": "Cocktail modifiziert"});
});

// delete cocktail
router.delete('/:id', function (req, res, next) {
    var id = req.params.id || '';
    console.log(req.params);
    cocktails.destroy({where: {id: id}});
    res.json({info: id.concat(" Cocktail deleted")});
});

// add new cocktail
router.post('/', upload.single('imageName'), function(req, res, next) {

    console.log('BACKEND: ' + req.body.name);
    console.log('BACKEND: ' + req.body.preparation);
    console.log('BACKEND: ' + req.file.filename);

    const url = req.protocol + '://' + req.get('host');



    var name = req.body.name || '';
    var imageName = url + '/public/uploads/' + req.file.filename || '';
    var preparation = req.body.preparation || '';


    var newCocktail = cocktails.build({
        name: name,
        imageName: imageName,
        preparation: preparation
    });

    console.log('BACKEND: ' + newCocktail.imageName);
    newCocktail.save().catch(function (error) {
        console.log('Error while inserting: ' + error.stack);
    });
    res.json({"info": "Neuer Cocktail angelegt"});
});


module.exports = router;