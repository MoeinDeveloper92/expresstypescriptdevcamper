import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/errorResponse';
import mongoose, { CastError, MongooseError } from 'mongoose';

export const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };

  error.message = err.message;
  //Log to the Console For dev
  console.log(err);

  //Mongoose bad Object Id
  if (err instanceof mongoose.Error.CastError && err.name === 'CastError') {
    const message = `Resource with Id ${err.value} not found!`;
    error = new ErrorResponse(message, 404, {
      path: err.path,
      reason: err.reason,
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : null,
    options: process.env.NODE_ENV === 'development' ? error.options : null,
  });
};
