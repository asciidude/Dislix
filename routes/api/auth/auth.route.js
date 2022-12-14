require('./Discord/discord.strat');

const { Router } = require('express');
const passport = require('passport');
const User = require('../../../models/User.model');
const { authRequired, authRestricted } = require('../../..');
const router = Router();

// Discord
router.get('/discord', passport.authenticate('discord'));
router.get('/redirect/discord', passport.authenticate('discord', {
    failureRedirect: '/login'
}), async (req, res) => {
    if(req.ip && req.ip.startsWith('::')) {
        await User.updateOne(
            { discordId: req.user.discordId },
            { ip_address: req.ip }
        );
    }

    res.redirect('/');
});

router.get('/logout', authRequired, async (req, res, next) => {
    await req.logout((err) => {
        if(err) return next(err);
    });

    req.session = null;

    req.flash('message', 'You have been logged out');
    req.redirect('/');
});

module.exports = router;