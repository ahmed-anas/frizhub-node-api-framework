'use strict';
const table_name = "Users"
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      table_name,
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        email: {
          type: Sequelize.STRING
        },
        password: {
          type: Sequelize.STRING
        },
        salt: {
          type: Sequelize.STRING,
          allowNull: false
        },
        role: {
          type: Sequelize.STRING,
          default: 'user'
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(table_name)
  }
};
