"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorResponse_1 = require("../utils/errorResponse");
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    //Log to the Console For dev
    console.log(err);
    //Mongoose bad Object Id
    if (err instanceof mongoose_1.default.Error.CastError && err.name === 'CastError') {
        const message = `Resource with Id ${err.value} not found!`;
        error = new errorResponse_1.ErrorResponse(message, 404, {
            path: err.path,
            reason: err.reason,
        });
    }
    //Mongoose Duplicate Key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate value entered for ${field}: "${err.keyValue[field]}"`;
        error = new errorResponse_1.ErrorResponse(message, 400);
    }
    //Mongoose validation Error
    if (err instanceof mongoose_1.default.Error.ValidationError &&
        err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new errorResponse_1.ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : null,
        options: process.env.NODE_ENV === 'development' ? error.options : null,
    });
};
exports.errorHandler = errorHandler;
