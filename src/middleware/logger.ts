import { Request, Response, NextFunction } from 'express';

export function loggingHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  setImmediate(() => {
    logging.log(
      `Incomming  - METHOD:[${req.method}] - URL: [${req.url}] - IP:[${req.socket.remoteAddress}]`
    );
  });

  //Extracting response's body
  let body = {};
  const chunks: Buffer[] = [];

  const oldEnd = res.end;

  res.end = (
    chunk?: any,
    encodingOrCb?: BufferEncoding | (() => void),
    cb?: () => void
  ) => {
    if (typeof encodingOrCb === 'function') {
      cb = encodingOrCb;
      encodingOrCb = undefined;
    }

    if (chunk) {
      chunks.push(Buffer.from(chunk));
    }
    body = Buffer.concat(chunks).toString('utf-8');

    return oldEnd.call(res, body, encodingOrCb as BufferEncoding, cb);
  };

  //Listen for response finish to make sure the cycle is done!
  res.on('finish', async () => {
    return setTimeout(() => {
      const responseLogInfo = {
        method: req.method,
        path: req.baseUrl,
        statusCode: res.statusCode,
        body,
      };

      logging.log(`Response ${JSON.stringify(responseLogInfo)}`);
    }, 0);
  });

  next();
}
