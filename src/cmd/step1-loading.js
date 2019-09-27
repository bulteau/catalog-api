const csv = require('csv-parser');
const fs = require('fs');
const { Product } = require('../../sequelize');

const results = [];

var args = process.argv.slice(2)[0];
if(args && args.length > 0) {
  // Read csv file
  fs.createReadStream(args)
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Create all products
      Product.bulkCreate(results, {returning: true})
      .then(function(response){
          console.log(response);
      })
      .catch(function(error){
          console.log(error);
      })
    });
} else {
  console.log("Wrong parameter");
}
