// @ts-nocheck
var passport = require('passport');
var User = require('../model/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid Password, password must be 6 charachters').notEmpty().isLength({
        min: 6
    });
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach((error) => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({
        'email': email
    }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {
                message: 'Email is already in use.'
            });
        }
        var NewUser = new User();
        NewUser.email = email;
        NewUser.password = NewUser.encryptPassword(password);
        NewUser.save((err, result) => {
            if (err) {
                return done(err);
            }
            return done(null, NewUser)
        })
    })
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({
        'email': email
    }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: 'User not Found!!'
            });
        }
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: 'Password is incorrect!!'
            });
        }
        return done(null, user);
    });
}));