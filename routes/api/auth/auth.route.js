require('./Discord/discord.strat');

const { Router } = require('express');
const passport = require('passport');
const User = require('../../../models/User.model');
const router = Router();

// Discord
router.get('/discord', passport.authenticate('discord'));
router.get('/redirect/discord', passport.authenticate('discord', {
    failureRedirect: '/login'
}), async (req, res) => {
    await User.updateOne(
        { discordId: req.user.discordId },
        { ip_address: req.socket.remoteAddress }
    );

    res.redirect('/');
});

module.exports = router;