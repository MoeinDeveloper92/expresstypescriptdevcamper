"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
class ErrorResponse extends Error {
    constructor(message, statusCode, options) {
        super(message);
        this.statusCode = statusCode;
        this.options = options;
        this.statusCode = statusCode;
        this.options = options;
    }
}
exports.ErrorResponse = ErrorResponse;
