const express = require('express');
const router = express.Router();

const products = [
  {
    name: 'Product A',
    price: 100,
    quantity: 1,
    description: 'Description Product A',
    id: 123
  }
];

module.exports = app => {
  app.use('/products', router);

  router.get('/', (req, res) => {
    res.json({
      records: products
    });
  });
};
