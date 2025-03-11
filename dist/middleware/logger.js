"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingHandler = loggingHandler;
function loggingHandler(req, res, next) {
    setImmediate(() => {
        logging.log(`Incomming  - METHOD:[${req.method}] - URL: [${req.url}] - IP:[${req.socket.remoteAddress}]`);
    });
    //Extracting response's body
    let body = {};
    const chunks = [];
    const oldEnd = res.end;
    res.end = (chunk, encodingOrCb, cb) => {
        if (typeof encodingOrCb === 'function') {
            cb = encodingOrCb;
            encodingOrCb = undefined;
        }
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }
        body = Buffer.concat(chunks).toString('utf-8');
        return oldEnd.call(res, body, encodingOrCb, cb);
    };
    //Listen for response finish to make sure the cycle is done!
    res.on('finish', () => __awaiter(this, void 0, void 0, function* () {
        return setTimeout(() => {
            const responseLogInfo = {
                method: req.method,
                path: req.baseUrl,
                statusCode: res.statusCode,
                body,
            };
            logging.log(`Response ${JSON.stringify(responseLogInfo)}`);
        }, 0);
    }));
    next();
}
//# sourceMappingURL=logger.js.map