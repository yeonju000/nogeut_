const express = require('express');
const router = express.Router();
const promiseController = require('../controllers/promiseController');

router.post("/:roomNum", promiseController.savePromise);
router.post("/:roomNum/:promiseNum", promiseController.confirmDeposit);
router.get('/deposit/:promiseNum/:stdNum', promiseController.showProfileDepoistDetail);

module.exports = router; 