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
        if(err) return process.stderr.write(`[ERROR] Could not connect to MongoDB\n${err}\n`)
        process.stdout.write('[SUCCESS] Connected to MongoDB');
    }
)

// 🙋‍♂️ Important Middleware //
/* Verify the user exists */
const User = require('./models/User.model');
app.use((req, res, next) => {
    if(req.isAuthenticated()) {
        const user = User.findOneById(req.user._id);

        if(!user || user.banned) {
            req.flash('error', 'Your account has been deleted or banned');
            next();
        }

        next();
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