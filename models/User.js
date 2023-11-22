const sequelize = require('../configs/db/index');
const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize('sqlite::memory:');
const User = sequelize.define('Users', {
    userId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    role: {type: DataTypes.STRING, defaultValue: 'user', allowNull: false, validate: {isIn: [['user', 'admin']]}},
    username: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    createdAt: {type: DataTypes.DATE, defaultValue: Sequelize.NOW},
    updatedAt: {type: DataTypes.DATE, defaultValue: Sequelize.NOW}
});

module.exports = User;