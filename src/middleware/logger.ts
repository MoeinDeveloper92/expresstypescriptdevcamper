import { NextFunction, Request, Response } from 'express';
//This logger is responisble to log the req information
//@desc     Logs request to console
export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `${req.method}  ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );

  next();
};
