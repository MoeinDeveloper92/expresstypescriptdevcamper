import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/errorResponse';
import { asyncHandler } from '../middleware/async';
import { IUser, User } from '../models/User';
import { sendTokenResponse } from '../utils/generateCookieResponse';
import sendEmail from '../utils/sendEmail';
import crypto from 'crypto';
import { Document, Model } from 'mongoose';

//@desc     Register a user
//@route    POST /api/v1/auth/register
//@access   Public
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    //create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    sendTokenResponse(user, 201, res);
  }
);

//@desc     Login a user
//@route    POST /api/v1/auth/login
//@access   Public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //Validate email & password
    if (!email || !password) {
      next(new ErrorResponse(`Please provide an email and password`, 400));
      return;
    }
    //Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new ErrorResponse('Invalid Credentials!', 401));
      return;
    }
    //check if passwor dmatches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      next(new ErrorResponse('Invalid Credentials', 401));
      return;
    }

    sendTokenResponse(user, 200, res);
  }
);

//@desc   Get me
//@route  GET /api/v1/auth/me
//@access Protected
export const getMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['userId'];
    const user = await User.findById(userId);

    res.status(200).json({
      succecss: true,
      data: user,
    });
  }
);

//@desc   Forogot password
//@route  GET /api/v1/auth/forgotpassword
//@access Public
export const forgotPassowrd = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      next(new ErrorResponse(`User ${req.body.email} does not exist!`, 404));
      return;
    }

    //Get reset Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    //create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/resetpassword/${resetToken}`;

    const message = `You are getting this email because you (or someone else) has requested the reset of a password. Please make a PUT request to:\n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        message,
        subject: 'Password reset Token',
      });

      res.status(200).json({
        success: true,
        data: 'email sent successuflly!',
      });
    } catch (error) {
      //get ride of tokens in DB
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      next(new ErrorResponse('Email could not be sent!', 500));
    }
  }
);

//@desc   reset password
//@route  PUT /api/v1/auth/resetpassword/:resettoken
//@access Protected
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    }).select('+password');

    if (!user) {
      next(new ErrorResponse('Invalid Token!', 400));
      return;
    }

    // Set new password and clear reset fields
    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
  }
);

//@desc   Update user's details
//@route  PUT /api/v1/auth/updatedetails
//@access Protected
export const updateDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const fieldsToUpdate = {
      name: req.body.name as string,
      email: req.body.email as string,
    };
    const user = await User.findByIdAndUpdate(
      req.headers.userId,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

//@desc   update password
//@route  PUT /api/v1/auth/updatepassword
//@access Protected
export const updatePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.headers.userId).select('+password');

    if (!user) {
      next(new ErrorResponse('user not found', 404));
      return;
    }
    //Check curernt password
    if (!(await user?.matchPassword(req.body.currentPassword))) {
      next(new ErrorResponse('Password is incorrect', 401));
      return;
    }
    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  }
);
