const cController = require('../controllers/cheque-controller');
const express = require('express');

const chequeRouter = express.Router();

chequeRouter
  .route('/')
  .get(cController.getCheques)
  .post(cController.createCheque);
chequeRouter.route('/:id').put(cController.updateCheque);

module.exports = chequeRouter;
