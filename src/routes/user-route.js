const cController = require('../controllers/user-controller');
const { validateId } = require('../middlewares');
const express = require('express');

const userRouter = express.Router();

userRouter.route('/').get(cController.getUsers).post(cController.createUser);
userRouter.use('/:id', validateId);
userRouter
  .route('/:id')
  .get(cController.getUserById)
  .put(cController.updateUser)
  .delete(cController.deleteUser);

userRouter.use('/roles/:id', validateId);
userRouter.route('/roles/:id').put(cController.changeUserRole);
userRouter.use('/password/:id', validateId);
userRouter.route('/password/:id').put(cController.changePassword);

module.exports = userRouter;
