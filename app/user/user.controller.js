const passport = require('passport'),
    jwt = require("jsonwebtoken"),
    userModel = require('./user.model'),
    config = require('../../config/config')
     _ = require('lodash');

module.exports.signUp = function (req, res) {
    userModel
        .getUser({ email: req.body.email })
        .then(user => {
            if (user) {
                return Promise.reject('Email already exists');
            } else {
                return Promise.resolve(true);
            }
        })
        .then(v => {
            return userModel.createUser(req.body)
        })
        .then(sequelizeInsertObj => {
            
            res.json(userModel.getSafeObject(sequelizeInsertObj.dataValues));
        })
        .catch(err => {
            res.status(400).send({message:err})
        })
}
module.exports.signIn = function (req, res, next) {
    passport.authenticate('local', { session: false }, function (err, user, info) {
        if (err || !user) {
            var error = "Invalid email/password combination.";
            if (info && info.message) error = info.message;
            else if (info && info.error) error = info.error;
            else if (typeof info === 'string') error = info;

            res.status(400).send({ message: error });
        }
        else {
            let data = userModel.getTokenAndPayload(user);
            res.json({
                token: data.token,
                user: data.payload
            });
        }
    })(req, res, next);
}
module.exports.getUser = function (req, res, next) {
    userModel.getUserById(req.params.userId, userModel.ACCESS_LEVEL.OTHER_USERS).then(user => {
        if(user){
            res.json(user);
        }
        else{
            res.status(400).json({message: 'Invalid user'});
        }
    }).catch(err => {
        res.status(500).json({message:err});
    })
}
module.exports.test = function(req,res,next){
    res.json("Success! You can not see this without a token");
}
module.exports.verify = function (req, res, next) {
    let x = passport.authenticate('jwt', { session: false }, function (err, user, info) {
        if (err) {
            res.status(400).json({ message: 'There was an issue logging you in' });
        }
        else if (!user) {
            res.json({ message: 'invalid token', success: false });
        }
        else {
            res.json({ message: 'valid', success: true });
        }
    })
    (req, res, next);
}
