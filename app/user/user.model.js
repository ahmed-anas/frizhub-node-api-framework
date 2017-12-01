const _ = require('lodash'),
    crypto = require('crypto'),
    db = require('../../config/db'),
    config = require('../../config/config'),
    hash_helper = require('../../helpers/hash.helper'),
    jwt = require("jsonwebtoken"),
    UserModel = require('./user.sequelize.model');

const userCreateableFields = [

    'email',
    'name',
    'password',
    'role'
];

module.exports.ACCESS_LEVEL = {
    UPDATABLE_FIELDS: [
        'password',
        'name',
    ],
    OTHER_USERS: [
        'id',
        'email',
        'name',
    ],
    THIS_USER_SAFE: [
        'id',
        'email',
        'name',
        'role'
    ]
};
module.exports.getUser = function (userObj, ACCESS_LEVEL = module.exports.ACCESS_LEVEL.OTHER_USERS) {
    return UserModel.findOne({
        where: userObj
    });
}
module.exports.getUserById = function (userId, ACCESS_LEVEL = module.exports.ACCESS_LEVEL.OTHER_USERS) {
    return UserModel.findOne({
        where: {
            id: userId
        }
    });
}
module.exports.getSafeObject = function (userObj, ACCESS_LEVEL) {
    return _.pick(userObj, ACCESS_LEVEL || module.exports.ACCESS_LEVEL.THIS_USER_SAFE);
}
function getTokenAndPayload(user) {
    var payload = { userId: user.id, role: user.role };
    var token = jwt.sign(payload, config.jwtSecret, { expiresIn: 15000 });
    return {
        token: token,
        payload: payload
    };
}
module.exports.getTokenAndPayload = getTokenAndPayload
module.exports.createUser = function (userObj) {
    var safeObj = _.pick(userObj, userCreateableFields);
    if (Object.keys(safeObj).length <= 0) {
        return Promise.reject(new Error('No valid fields given'));
    }
    safeObj.role = 'user';
    if (safeObj.password) {
        safeObj.salt = crypto.randomBytes(16).toString('base64');
        safeObj.password = hash_helper.hashPassword(safeObj.password, safeObj.salt);
    }
    return UserModel.create(safeObj);

}