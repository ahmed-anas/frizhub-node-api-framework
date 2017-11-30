'use strict';

/**
 * Module dependencies.
 */
const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    userModel = require('../../app/user/user.model'),
     hash_helper = require('../../helpers/hash.helper');


module.exports = function () {
    // Use local strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        function (email, password, done) {
            userModel.getUser({
                email: email
            }).then(user => {
                if (!user) {
                    return done(new Error('Invalid email and password combination'));
                }

                if (user.password === hash_helper.hashPassword(password, user.salt)) {

                    return done(null, userModel.getSafeObject(user));
                }
                return done(new Error('Invalid email and password combination'));

            })
                .catch(err => {
                    return done(err);
                })


        }
    ));
};
