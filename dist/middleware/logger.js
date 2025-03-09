"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingHandler = loggingHandler;
function loggingHandler(req, res, next) {
    logging.log(`Incomming  - METHOD:[${req.method}] - URL: [${req.url}] - IP:[${req.socket.remoteAddress}]`);
    //Listen for response finish to make sure the cycle is done!
    res.on('finish', () => {
        logging.log(`Outgoing - METHOD:[${req.method}] - URL: [${req.url}] - IP:[${req.socket.remoteAddress}] - STATUS:${res.statusCode}`);
    });
    next();
}
