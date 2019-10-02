const Sequelize = require('sequelize');
const config = require('./site-config');
const ProductModel = require('./src/model/product');


const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPwd, {
  host: config.dbHost,
  port: config.dbPort,
  dialect: 'postgres',
  logging: false
});

const Product = ProductModel(sequelize, Sequelize);

/*
Function using https://github.com/gausie/colour-proximity alogorithm
maxScore declare a threshold : 0 is maximum proximity, 1 is minimum proximity
*/
async function requestProximity(l, a, b, limit = 10) {
  return await sequelize.query('SELECT * FROM products ORDER BY (sqrt(power(dominant_color_l - ?, 2) + power(dominant_color_a - ?, 2) + power(dominant_color_b - ?, 2))) ASC LIMIT ?',
    { replacements: [l, a, b, limit], type: sequelize.QueryTypes.SELECT }
  );
}

module.exports = {
  Product,
  requestProximity,
  sequelize
}
