const Sequelize = require('sequelize');
const config = require('./site-config');
const ProductModel = require('./src//model/product');


const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPwd, {
  host: config.dbHost,
  port: config.dbPort,
  dialect: 'postgres'
});

const Product = ProductModel(sequelize, Sequelize);

sequelize.sync()
  .then(() => {
    console.log(`Database & tables created!`)
  });


module.exports = {
  Product
}
