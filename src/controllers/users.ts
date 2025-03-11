import { ErrorResponse } from '../utils/errorResponse';
import { asyncHandler } from '../middleware/async';
import { User } from '../models/User';
import { Response, Request, NextFunction } from 'express';
//@desc     Get all users
//@route    GET /api/v1/auth/users
//@access   private/Admin

export const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
  }
);

//@desc     Get single user
//@route    GET /api/v1/auth/users/:id
//@access   private/Admin

export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      next(new ErrorResponse(`User ${req.params.id} not found!`, 404));
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

//@desc     create User
//@route    POST /api/v1/auth/users
//@access   private/Admin

export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  }
);

//@desc     Update the user
//@route    PUT /api/v1/auth/users/:id
//@access   private/Admin

export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

//@desc     Delete User
//@route    DELETE /api/v1/auth/users/:id
//@access   private/Admin

export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);
