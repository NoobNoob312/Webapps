var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("In secret Route");
    console.log(req.user);
    if (req.user) {
        var info = "";
        if (req.user.roleAdmin == 1) {
            info = "Adminrechte"
        }
        res.render('secret', {title: 'top secret: ' + info});
    }
    else {
        res.render('login', { title: 'Login' });
    }
});

module.exports = router;
