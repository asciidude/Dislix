/**
 * Dislix description:
 * An open-source Discord server list,
 * intended for ease-of-use and vanity links.
 * 
 * Vanity:
 * app.get('/servers/:vanity') or app.get('/:vanity') - restricting some things
 */

require('dotenv').config();

// 💁‍♂️ Dependencies //
const mongoose = require('mongoose');

const express = require('express');

const passport = require('passport');
const session = require('cookie-session');
const flash = require('connect-flash');

const path = require('path');

// 🍎 Setup Express Server //
const app = express();

app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'routes', 'views', 'ejs'));
app.use(express.static(path.join(__dirname, 'routes', 'public')));
app.set('view engine', 'ejs');

app.use(require('cookie-parser')());
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookieAge: 1000 * 60 * 60 * 24 * 7 // 7 days
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// 💿 Setup MongoDB Database //
mongoose.connect(
    process.env.MONGO_URI,
    (err) => {
        if(err) return process.stderr.write(`[ERROR] Could not connect to MongoDB\n${err}\n`);
        process.stdout.write('[SUCCESS] Connected to MongoDB\n');
    }
)

// 🙋‍♂️ Important Middleware //
/* Verify the user exists or is not banned */
/* This function should make it to where I don't have to check on login! :D */
const verify = require('./utils/verify.util');

app.use((req, res, next) => {
    if(req.isAuthenticated()) {
        // Verify account exists first
        if(verify.exists(req.user)) {
            req.flash('😢 Your account has been deleted.');
            next();
        }

        // ...then check if it has ever been banned
        if(verify.banned(req.user)) {
            req.flash('😬 Sorry, your account has been banned.');
            next();
        }
    }

    next();
});

// 👉 Routing //
app.use(require('./routes/views/views.route'));

// 👂 Listen to app //
app.listen(
    process.env.PORT || 8000,
    () => process.stdout.write(`[SUCCESS] Listening on localhost:${process.env.PORT || 8000}\n`)
);