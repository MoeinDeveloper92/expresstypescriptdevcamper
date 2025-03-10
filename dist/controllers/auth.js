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
exports.getMe = exports.login = exports.register = void 0;
const errorResponse_1 = require("../utils/errorResponse");
const async_1 = require("../middleware/async");
const User_1 = require("../models/User");
const generateCookieResponse_1 = require("../utils/generateCookieResponse");
//@desc     Register a user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    //create user
    const user = yield User_1.User.create({
        name,
        email,
        password,
        role,
    });
    (0, generateCookieResponse_1.sendTokenResponse)(user, 201, res);
}));
//@desc     Login a user
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //Validate email & password
    if (!email || !password) {
        next(new errorResponse_1.ErrorResponse(`Please provide an email and password`, 400));
        return;
    }
    //Check for user
    const user = yield User_1.User.findOne({ email }).select('+password');
    if (!user) {
        next(new errorResponse_1.ErrorResponse('Invalid Credentials!', 401));
        return;
    }
    //check if passwor dmatches
    const isMatch = yield user.matchPassword(password);
    if (!isMatch) {
        next(new errorResponse_1.ErrorResponse('Invalid Credentials', 401));
        return;
    }
    (0, generateCookieResponse_1.sendTokenResponse)(user, 200, res);
}));
//@desc   Get me
//@route  GET /api/v1/auth/me
//@access Protected
exports.getMe = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers['userId'];
    const user = yield User_1.User.findById(userId);
    res.status(200).json({
        succecss: true,
        data: user,
    });
}));
//# sourceMappingURL=auth.js.map