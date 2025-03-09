import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/errorResponse';

export function routeNotFound(req: Request, res: Response, next: NextFunction) {
  const error = new ErrorResponse('Route Not Found', 404);
  logging.error(error);
  next(error);
  return;
}
