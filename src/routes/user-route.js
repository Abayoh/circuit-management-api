const cController = require('../controllers/user-controller');
const { validateId } = require('../middlewares');
const express = require('express');

const userRouter = express.Router();

userRouter.route('/').get(cController.getUsers).post(cController.createUser);
userRouter.use('/:id', validateId);
userRouter
  .route('/:id')
  .get(cController.getUserById)
  .patch(cController.updateUser)
  .delete(cController.deleteUser);

userRouter.use('/:id/roles', validateId);
userRouter.route('/:id/roles').put(cController.changeUserRole);
userRouter.use('/:id/password', validateId);
userRouter.route('/:id/reset-password').put(cController.resetPassword);
userRouter.route('/:id/password').put(cController.changePassword);

module.exports = userRouter;
