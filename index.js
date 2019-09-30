const express = require('express')
const bodyParser = require('body-parser')
const { Product } = require('./sequelize')

const app = express()
app.use(bodyParser.json())

// API ENDPOINTS
const port = 3000
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
})


app.get('/api/products', (req, res) => {
  Product.findAll().then(products => res.json(products.length));
})

app.get('/api/recommandation/:productId?', (req, res) => {
  Product.findOne({ where: {id: req.params.productId}})
    .then(product => {
      if(product) {
        return Product.findAll({ where: {gender_id: product.gender_id}});
      } else {
        return {error: true, msg: `This product doesn't exist`};
      }
    })
    .then(product => res.json(product));

})
