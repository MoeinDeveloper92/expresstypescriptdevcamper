"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
//This logger is responisble to log the req information
//@desc     Logs request to console
const logger = (req, res, next) => {
    console.log(`${req.method}  ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
};
exports.logger = logger;
