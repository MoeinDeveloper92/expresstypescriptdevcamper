"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorResponse_1 = require("./errorResponse");
class BadRequestError extends errorResponse_1.CustomError {
    constructor(params) {
        const { code, message, logging } = params || {};
        super(message || 'Bad request');
        this._code = code || BadRequestError._statusCode;
        this._logging = logging || false;
        this._context = (params === null || params === void 0 ? void 0 : params.context) || {};
        // Only because we are extending a built in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    get errors() {
        return [{ message: this.message, context: this._context }];
    }
    get statusCode() {
        return this._code;
    }
    get logging() {
        return this._logging;
    }
}
BadRequestError._statusCode = 400;
exports.default = BadRequestError;
