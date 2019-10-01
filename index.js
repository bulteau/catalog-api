const express = require('express');
const bodyParser = require('body-parser');
const { Product, requestProximity } = require('./sequelize');

const app = express();
app.use(bodyParser.json());

// API ENDPOINTS
const port = 3000;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
})

// API Route which list every products
app.get('/api/products', (req, res) => {
  Product.findAll({ limit: 1000 }).then(products => res.json(products));
})

// API Route which list products with a similar color
app.get('/api/recommandation/:productId?', (req, res) => {

  Product.findOne({ where: {id: req.params.productId}})
    .then(product => {
      if(product) {

        return requestProximity(
          product.dominant_color_l,
          product.dominant_color_a,
          product.dominant_color_b
        );
        //return Product.findAll({ where: {gender_id: product.gender_id}});
      } else {
        return {error: true, msg: `This product doesn't exist`};
      }
    })
    .then(product => res.json(product));

})