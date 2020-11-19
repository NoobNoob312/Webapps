var express = require('express');
var router = express.Router();

router.get('/logout', function(req, res) {
    if (req.user) {
        req.logout();
        req.session.destroy(); // Session löschen
        res.redirect('/login'); // umleiten auf login
    } else {
        res.redirect('/login'); // dorthin umleiten, wo der user nach dem Ausloggen hingeleitet werden soll
    }
});

module.exports = router;