import { Request, Response, NextFunction } from 'express';

export function loggingHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logging.log(
    `Incomming  - METHOD:[${req.method}] - URL: [${req.url}] - IP:[${req.socket.remoteAddress}]`
  );

  //Listen for response finish to make sure the cycle is done!
  res.on('finish', () => {
    logging.log(
      `Outgoing - METHOD:[${req.method}] - URL: [${req.url}] - IP:[${req.socket.remoteAddress}] - STATUS:${res.statusCode}`
    );
  });

  next();
}
