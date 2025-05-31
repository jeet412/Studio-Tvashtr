const express = require('express');
const router = express.Router();
const { sendContact } = require('../Controllers/ContactController');

router.post('/', sendContact);

module.exports = router;
