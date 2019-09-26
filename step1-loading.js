const csv = require('csv-parser')
const fs = require('fs')
const results = [];

var args = process.argv.slice(2)[0];
if(args && args.length > 0) {
  fs.createReadStream(args)
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      results.forEach(function (value) {
        console.log(value.id);
      });
      // [
      //   { NAME: 'Daffy Duck', AGE: '24' },
      //   { NAME: 'Bugs Bunny', AGE: '22' }
      // ]
    });
} else {
  console.log("Wrong parameter");
}
