var express = require('express');
var router = express.Router();
const cors = require('cors');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

var database = require('./database/sequelizeConnection');
var User = database.sequelizeInstance.import('../models/User');
router.use(cors());

process.env.SECRET_KEY = 'secret';

// Tabelle erstellt; attributes = Spalte
router.get('/', function(req, res, next) {
    User.findAll({attributes: ['id', 'user_name', 'user_password']}).then(function (user) {
        res.json({"users": user});
    });
});

router.post('/register', (req, res) => {
    console.log('register BACKEND');
    const today = new Date();
    const userData = {
        user_name: req.body.user_name,
        user_password: req.body.user_password,
        created: today
    };

    User.findOne ({
        where: {
            user_name: req.body.user_name
        }
    })
        .then(user => {
            console.log(req.body.user_name);
            console.log(user);
            if(!user) {
                bcrypt.hash(req.body.user_password, 10, (err, hash) => {
                    userData.user_password = hash;
                    User.create(userData)
                        .then(user => {
                            res.json({status: user.user_name + ' registered'});
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                });
            } else {
                res.json({ error: 'User already exists' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
});

router.post('/login', (req, res) => {       //TODO fix issue

    User.findOne ({
        where: {
            user_name: req.body.user_name
        }
    })
        .then(user => {
            if(user) {
                if(bcrypt.compareSync(req.body.user_password, user.user_password)) {
                    let token = jwt.sign(user.dataValues, process.env.Secret_Key, {
                        expiresIn: 1440
                    });
                    res.send(token)
                }
            } else {
                    res.status(400).json({error: 'User does not exist'})
                }
            })
                    .catch(err => {
                        res.status(400).json({error: err})
            })
});

module.exports = router;