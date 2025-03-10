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

    res.status(201).json({
      success: true,
    });
  }
);
