const { Router } = require('express');
const { authRequired, authRestricted } = require('../..');
const router = Router();

router.get('/', (req, res) => {
    res.render(
        'index',
        { user: req.user }
    );
});

router.get('/login', authRestricted, (req, res) => {
    res.render(
        'login',
        { user: req.user, err: req.flash('err')[0] }
    );
});

module.exports = router;