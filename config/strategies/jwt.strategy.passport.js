const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt,
passport = require('passport'),
config = require('../config'),
userModel = require('../../app/user/user.model')
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
ExtractJwt.fromBodyField('token');
module.exports = function(){
    opts.secretOrKey = config.jwtSecret;

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

        if(!jwt_payload.userId){

            process.nextTick(function(){
                done({status: 401, message: "Invalid Token Payload"}, null);
            })
        }
        else 
        {
            userModel.getUserById(jwt_payload.userId).then(user => {
                if(user){
                    done(null, user);
                } 
                else {
                    done({
                        message: 'Unknown error. Bad data',
                        status: 401
                    }, false);
                }
                return null;
            })
            .catch(err => {
                return done(err, false);
            })
        }
    }))
}