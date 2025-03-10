import jwt, { JwtPayload } from 'jsonwebtoken';
import { asyncHandler } from './async';
import { ErrorResponse } from '../utils/errorResponse';
import { User } from '../models/User';
import { Request, Response, NextFunction } from 'express';

export interface UserPayload extends JwtPayload {
  _id?: string;
}

//Protect Routes

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    //  else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }

    // Make sure token exist
    if (!token) {
      next(new ErrorResponse('Not Authorized to access this route!', 401));
      return;
    }

    try {
      //Verify token
      //Extract payload from the token
      const secret: string = process.env.JWT_SECRET as string;
      const decoded: UserPayload = jwt.verify(token, secret) as JwtPayload;
      req.headers['userId'] = decoded._id;
      console.log(req.headers.userId);
      next();
    } catch (error) {
      next(new ErrorResponse('Not Authorized to access this route!', 401));
      return;
    }
  }
);
