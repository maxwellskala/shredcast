'use strict';

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_on'
    }
  }, {
    tableName: 'users'
  }
  );

  User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, SALT_ROUNDS)
      .then((hash) => user.password = hash)
      .catch((err) => console.log(err));
  })

  return User;
};
