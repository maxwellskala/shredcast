'use strict';

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

  return User;
};