const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');

const User = require('../../../../models/User.model');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    if(user) done(null, user);
});

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: ['identify', 'email', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    profile.refreshToken = refreshToken;
    
    try {
        // servers_owned refers to the servers owned by the user
        // servers refers to the servers the user has posted
        const foundUser = await User.findOne({ discordId: profile.id });

        if(!foundUser) {
            let serversOwned = [];
            for (let i=0; i < profile.guilds.length; i++) {
                if (profile.guilds[i].owner == true) {
                    serversOwned.push(profile.guilds[i]);
                }
            }

            const user = await User.create({
                // General user data
                discordId: profile.id,

                username: profile.username,
                discriminator: profile.discriminator,
                email: profile.email,

                createdAt: profile.fetchedAt,
            
                // Profile data
                avatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : '/images/svg/male-avatar.svg',
                banner: profile.banner,
                bannerColor: profile.banner_color || '4B92FF',
                servers: [],
                servers_owned: serversOwned,
            
                // Banned information
                banned: false,
                ban_expires: null,
                ip_address: null
            });

            return done(null, user);
        } else {
            let serversOwned = [];
            for (let i=0; i < profile.guilds.length; i++) {
                if (profile.guilds[i].owner == true) {
                    serversOwned.push(profile.guilds[i]);
                }
            }

            await User.updateOne({
                username: profile.username,
                discriminator: profile.discriminator,
                email: profile.email,
            
                avatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : '/images/svg/male-avatar.svg',
                banner: profile.banner,
                bannerColor: profile.banner_color || '4B92FF',
                servers_owned: serversOwned
            });

            return done(null, foundUser);
        }
    } catch(err) {
        console.log(err);
        done(err, null);
    }
}));