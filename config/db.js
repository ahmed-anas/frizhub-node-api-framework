var mysql = require('mysql');
var config = require('./config');
var pool = mysql.createPool(config.db.mysql);
var Sequelize = require('sequelize');

module.exports.getConnection = function () {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            return resolve(connection);
        })
    })
}

// const fs = require('fs');
var sequelizeInstance = null;
module.exports.getSequelize = function () {
    if (!sequelizeInstance) {
        sequelizeInstance = new Sequelize(config.db.mysql.database, config.db.mysql.user, config.db.mysql.password, {
            host: config.db.mysql.host,
            dialect: 'mysql',
            // logging : function(log){
            //     fs.appendFileSync('seq_log.txt', log + "\r\n");
            // },
            logging: false,
             pool: {
                max: 10,
                min: 0,
                idle: 10000
            },

        });
        
    }
    return sequelizeInstance;


}

