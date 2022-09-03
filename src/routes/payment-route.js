const cController = require('../controllers/payment-controller');
const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: 5 * 1024 * 1024 });

const paymentRouter = express.Router();

paymentRouter.use(upload.single('file'));

paymentRouter
  .route('/')
  .get(cController.getPayments)
  .post(cController.createPayments);

module.exports = paymentRouter;
