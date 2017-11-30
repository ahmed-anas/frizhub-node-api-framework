const crypto = require('crypto')

module.exports.hashPassword = function (password, salt) {
    if (salt && password && password.length > 3) {
        return crypto.pbkdf2Sync(password, new Buffer(salt, 'base64'), 10000, 64, 'sha512').toString('base64');
    } else {
        return password;
    }


}