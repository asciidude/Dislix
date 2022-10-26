/**
 * Dislix description:
 * An open-source Discord server list,
 * intended for ease-of-use and vanity links.
 * 
 * Vanity:
 * app.get('/servers/:vanity') or app.get('/:vanity')
 */

require('dotenv').config();

// 💁‍♂️ Dependencies //
const mongoose = require('mongoose');

const express = require('express');

const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const path = require('path');

// 🍎 Setup Express Server //
const app = express();
app.set('trust proxy', true);

app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'routes', 'views', 'ejs'));
app.use(express.static(path.join(__dirname, 'routes', 'public')));
app.set('view engine', 'ejs');

app.use(require('cookie-parser')());
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: false
    }
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
const verify = require('./utils/verify.util');

app.use(async (req, res, next) => {
    if(req.isAuthenticated()) {
        // Verify account exists first
        if(!await verify.exists(req.user)) {
            await req.logout((err) => {
                if(err) return next(err);
            });
            
            req.session = null;
    
            req.flash('err', '😢 Your account has been deleted.');
            return res.redirect('/');
        }
    
        // ...then check if it has ever been banned
        if(await verify.banned(req.user)) {
            await req.logout((err) => {
                if(err) return next(err);
            });

            req.session = null;
    
            req.flash('err', '😬 Sorry, your account has been banned.');
            return res.redirect('/');
        }
    }

    next();
});

/** Add default response locals */
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.err = req.flash('err')[0];
    res.locals.message = req.flash('message')[0];
    next();
});

/** Restrict from authenticated users */
module.exports.authRestricted = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    next();
  } catch(err) {
    return res.status(401).json({
        message: '[AuthRestricted] Invalid request!',
        error: err.toString()
    });
  }
}

/** Restrict to authenticated users only */
module.exports.authRequired = (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    next();
  } catch(err) {
    return res.status(401).json({
        message: '[AuthRequired] Invalid request!',
        error: err.toString()
    });
  }
}

// 👉 Views Routing //
app.use(require('./routes/views/views.route'));

// 🤖 API Routing //
/* Authentication */
app.use('/auth', require('./routes/api/auth/auth.route'));

// 👂 Listen to app //
app.listen(
    process.env.PORT || 8000,
    () => process.stdout.write(`[SUCCESS] Listening on localhost:${process.env.PORT || 8000}\n`)
);