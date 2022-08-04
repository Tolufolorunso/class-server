const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const User = require('../../models/user.models');
const CustomError = require('../../errors');
const { createJWT } = require('../../utils');
const { findByIdAndUpdate } = require('../../models/user.models');
const deleteImg = require('../../utils/deleteImage');

const register = async (req, res) => {
  const { email, password, confirmPassword, name, gender } = req.body;

  if (!email || !password || !confirmPassword || !name || !gender) {
    throw new CustomError.BadRequestError('All fields required');
  }

  if (password !== confirmPassword) {
    throw new CustomError.BadRequestError('Passwords not matched');
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new CustomError.BadRequestError('User already exist');
  }

  await User.create({ email, password, name, gender });

  res.status(StatusCodes.CREATED).json({
    status: true,
    message: `User created successfully`,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  let user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new CustomError.BadRequestError('invalid credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError('invalid credentials');
  }

  const token = createJWT({
    payload: {
      id: user._id,
      email: user.email,
    },
  });
  user = user.toObject();
  delete user.password;

  res.status(StatusCodes.OK).json({
    status: true,
    message: 'User logged in successfully',
    user,
    token,
  });
};

const getUser = async (req, res) => {
  // const { userID } = req.params;
  // console.log(req.user);
  const userProfile = await User.findById(req.user._id);

  if (!userProfile) {
    throw new CustomError.NotFoundError('User not found');
  }

  res.status(StatusCodes.OK).json({
    status: true,
    message: 'User is fetched',
    user: userProfile,
  });
};

const updateProfile = async (req, res) => {
  // const { userID } = req.params;
  // console.log(req.user);
  const { phone, name, bio, email, address, gender } = req.body;

  const userProfile = await User.findOne({ _id: req.user._id });

  if (!userProfile) {
    throw new CustomError.NotFoundError('User not found');
  }

  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new CustomError.BadRequestError(
        'Email is already exist, try another'
      );
    }
    userProfile.email = email;
  }

  if (phone) {
    userProfile.phone = phone;
  }

  if (name) {
    userProfile.name = name;
  }

  if (bio) {
    userProfile.bio = bio;
  }

  if (gender) {
    userProfile.gender = gender;
  }
  if (address) {
    userProfile.address = address;
  }

  await userProfile.save();

  res.status(StatusCodes.OK).json({
    status: true,
    message: 'Profile updated successfully',
    user: userProfile,
  });
};

const uploadProfileImage = async (req, res) => {
  // const { userID } = req.params;
  let oldImageUrl;

  const userProfile = await User.findById(req.user._id);

  if (!userProfile) {
    throw new CustomError.NotFoundError('User not found');
  }

  if (!req.file) {
    return res.status(StatusCodes.OK).json({
      status: true,
      message: 'Nothing here',
      image: userProfile.image,
    });
  }
  oldImageUrl = userProfile.image;

  userProfile.image = req.file.filename;

  await userProfile.save();

  deleteImg({ imageLocation: oldImageUrl, res });

  res.status(StatusCodes.OK).json({
    status: true,
    message: 'Image uploaded successfully',
    image: userProfile.image,
  });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError('No user found with the email address');
  }

  //Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({
    validateBeforeSave: false,
  });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/auth/resetpassword/${resetToken}`;

  const message = `Reset your password : \n\n ${resetUrl}`;
  try {
    console.log('I will continue later');
  } catch (error) {
    console.log(error, 'I will continue later');
  }
  console.log(message);
};

module.exports = {
  register,
  login,
  getUser,
  updateProfile,
  uploadProfileImage,
  forgotPassword,
};
