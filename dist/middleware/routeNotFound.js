"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = routeNotFound;
const errorResponse_1 = require("../utils/errorResponse");
function routeNotFound(req, res, next) {
    const error = new errorResponse_1.ErrorResponse('Route Not Found', 404);
    logging.error(error);
    next(error);
    return;
}
