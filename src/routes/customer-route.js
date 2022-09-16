const cController = require('../controllers/customer-controller');
const express = require('express');

const multer = require('multer');
const createError = require('http-errors');
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        createError.UnprocessableEntity(
          'only .jpg, .jpeg and .png format are allowed'
        )
      );
    }
  },
});

const customerRouter = express.Router();

customerRouter.use(upload.single('file'));

customerRouter
  .route('/')
  .get(cController.getCustomers)
  .post(cController.createCustomer);
customerRouter.route('/:id').put(cController.updateCustomer);

module.exports = customerRouter;

