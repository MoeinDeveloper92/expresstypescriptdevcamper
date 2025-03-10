import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/errorResponse';
import { asyncHandler } from '../middleware/async';
import { User } from '../models/User';

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

    //create token
    const token = user.getSignedJwtToken();
    res.status(201).json({
      success: true,
      token,
    });
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

    //create token
    const token = user.getSignedJwtToken();
    res.status(201).json({
      success: true,
      token,
    });
  }
);
