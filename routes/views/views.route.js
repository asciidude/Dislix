const { Router } = require('express');
const { authRequired, authRestricted } = require('../..');
const User = require('../../models/User.model');
const router = Router();

router.get('/', (req, res) => {
    res.render(
        'index',
        { 
            user: req.user,
            err: req.flash('err')[0]
        }
    );
});

router.get('/login', authRestricted, (req, res) => {
    res.render(
        'login',
        {
            user: req.user,
            err: req.flash('err')[0]
        }
    );
});

router.get('/user/:id', authRestricted, async (req, res) => {
    const profile = await User.findOne({ discordId: req.params.id });

    res.render(
        'user',
        {
            profile: profile,
            err: req.flash('err')[0]
        }
    );
});

module.exports = router;