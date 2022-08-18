const cController = require('../controllers/log-controller');
const express = require('express');

const logRouter = express.Router();

logRouter.route('/').get(cController.getLogs).post(cController.createLog);

module.exports = logRouter;
