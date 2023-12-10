const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DATABASE, 
    process.env.USER, 
    process.env.PASSWORD, 
    {
        host: process.env.HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        pool: {
            max: 10,
            min: 0,
            idle: 10000
        },
        logging: false
    }
);

module.exports = sequelize;