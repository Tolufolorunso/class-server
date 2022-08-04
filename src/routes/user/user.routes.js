const express = require('express');

const { upload } = require('../../utils');
const authenticateUser = require('../../middlewares/authentication');

const {
  register,
  login,
  getUser,
  updateProfile,
  uploadProfileImage,
  forgotPassword,
} = require('./user.controllers');
const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/profile', authenticateUser, getUser);
userRouter.patch('/update-user', authenticateUser, updateProfile);
userRouter.patch(
  '/image',
  authenticateUser,
  upload.single('image'),
  uploadProfileImage
);

userRouter.post('/forgotpassword', forgotPassword);

module.exports = userRouter;
