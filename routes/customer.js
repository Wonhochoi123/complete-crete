const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Register a new customer
router.post('/new', customerController.createCustomer);


// Login an existing customer
router.post('/login', customerController.loginCustomer);

router.put('/update', customerController.updateCustomer);


module.exports = router;
