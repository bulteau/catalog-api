const csv = require('csv-parser');
const fs = require('fs');
const { Product, sequelize } = require('../../sequelize');

const results = [];

var args = process.argv.slice(2)[0];
if(args && args.length > 0) {
  // Read csv file
  fs.createReadStream(args)
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      sequelize.sync()
        .then(() => {
          Product.bulkCreate(results, {returning: true})
          .then(function(response){
              console.log('\x1b[32m', `${response.length} products added`, '\x1b[37m');
          })
          .catch(function(error){
              console.log(error);
          })
        });
    });
} else {
  console.log("Wrong parameter");
}
