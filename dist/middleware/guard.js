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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const async_1 = require("./async");
const errorResponse_1 = require("../utils/errorResponse");
//Protect Routes
exports.protect = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    //  else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }
    // Make sure token exist
    if (!token) {
        next(new errorResponse_1.ErrorResponse('Not Authorized to access this route!', 401));
        return;
    }
    try {
        //Verify token
        //Extract payload from the token
        const secret = process.env.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.headers['userId'] = decoded._id;
        console.log(req.headers.userId);
        next();
    }
    catch (error) {
        next(new errorResponse_1.ErrorResponse('Not Authorized to access this route!', 401));
        return;
    }
}));
//# sourceMappingURL=guard.js.map