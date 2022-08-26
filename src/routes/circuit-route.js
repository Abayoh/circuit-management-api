const cController = require('../controllers/circuit-controller');
const express = require('express');

const circuitRouter = express.Router();

circuitRouter
  .route('/')
  .get(cController.getCircuits)
  .post(cController.createCircuit);
  circuitRouter.route('/:id').put(cController.updateCircuit);
  

module.exports = circuitRouter;
