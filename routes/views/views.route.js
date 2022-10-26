const { Router } = require('express');
const { authRequired, authRestricted } = require('../..');
const User = require('../../models/User.model');
const router = Router();


router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', authRestricted, (req, res) => {
    res.render('login');
});

router.get('/users/:id', async (req, res) => {
    const profile = await User.findOne({ discordId: req.params.id });

    res.render(
        'user',
        { profile: profile }
    );
});

module.exports = router;