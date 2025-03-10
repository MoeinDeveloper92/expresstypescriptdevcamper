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
exports.login = exports.register = void 0;
const errorResponse_1 = require("../utils/errorResponse");
const async_1 = require("../middleware/async");
const User_1 = require("../models/User");
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
    //create token
    const token = user.getSignedJwtToken();
    res.status(201).json({
        success: true,
        token,
    });
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
    console.log(user);
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
    //create token
    const token = user.getSignedJwtToken();
    res.status(201).json({
        success: true,
        token,
    });
}));
//# sourceMappingURL=auth.js.map