const csv = require('csv-parser');
const fs = require('fs');
const { Client } = require("pg");
const Sequelize = require('sequelize');
const results = [];

const sequelize = new Sequelize('catalog-db', 'catalog-user', 'kT6xMdTqahVCvYAN', {
  host: 'localhost',
  port: 54320,
  dialect: 'postgres'
});

const Model = Sequelize.Model;
class Product extends Model {}
Product.init({
  // attributes
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING
  },
  gender_id: {
    type: Sequelize.STRING
  },
  composition: {
    type: Sequelize.STRING
  },
  sleeve: {
    type: Sequelize.STRING
  },
  photo: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
}, {
  sequelize,
  modelName: 'product'
});

// Temporary - delete all products
sequelize.models.product.destroy({
  where: {},
  truncate: true
})

var args = process.argv.slice(2)[0];
if(args && args.length > 0) {
  fs.createReadStream(args)
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        sequelize.sync()
          .then(
            sequelize.models.product.bulkCreate(results, {returning: true})
            .then(function(response){
                console.log(response);
            })
            .catch(function(error){
                console.log(error);
            })
        ).then(

        );

    });
} else {
  console.log("Wrong parameter");
}

// Temporary - Find all products
/*Product.findAll().then(products => {
  console.log("All products:", JSON.stringify(products, null, 4));
});*/
