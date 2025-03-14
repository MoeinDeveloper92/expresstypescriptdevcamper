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
exports.updatePassword = exports.updateDetails = exports.resetPassword = exports.forgotPassowrd = exports.getMe = exports.login = exports.register = void 0;
const errorResponse_1 = require("../utils/errorResponse");
const async_1 = require("../middleware/async");
const User_1 = require("../models/User");
const generateCookieResponse_1 = require("../utils/generateCookieResponse");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const crypto_1 = __importDefault(require("crypto"));
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
//@desc   Forogot password
//@route  GET /api/v1/auth/forgotpassword
//@access Public
exports.forgotPassowrd = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ email: req.body.email });
    if (!user) {
        next(new errorResponse_1.ErrorResponse(`User ${req.body.email} does not exist!`, 404));
        return;
    }
    //Get reset Token
    const resetToken = user.getResetPasswordToken();
    yield user.save({ validateBeforeSave: false });
    //create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`;
    const message = `You are getting this email because you (or someone else) has requested the reset of a password. Please make a PUT request to:\n\n ${resetUrl}`;
    try {
        yield (0, sendEmail_1.default)({
            email: user.email,
            message,
            subject: 'Password reset Token',
        });
        res.status(200).json({
            success: true,
            data: 'email sent successuflly!',
        });
    }
    catch (error) {
        //get ride of tokens in DB
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save({ validateBeforeSave: false });
        next(new errorResponse_1.ErrorResponse('Email could not be sent!', 500));
    }
}));
//@desc   reset password
//@route  PUT /api/v1/auth/resetpassword/:resettoken
//@access Protected
exports.resetPassword = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Get hashed token
    const resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');
    const user = yield User_1.User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        },
    }).select('+password');
    if (!user) {
        next(new errorResponse_1.ErrorResponse('Invalid Token!', 400));
        return;
    }
    // Set new password and clear reset fields
    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    yield user.save();
    (0, generateCookieResponse_1.sendTokenResponse)(user, 200, res);
}));
//@desc   Update user's details
//@route  PUT /api/v1/auth/updatedetails
//@access Protected
exports.updateDetails = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
    };
    const user = yield User_1.User.findByIdAndUpdate(req.headers.userId, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: user,
    });
}));
//@desc   update password
//@route  PUT /api/v1/auth/updatepassword
//@access Protected
exports.updatePassword = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findById(req.headers.userId).select('+password');
    if (!user) {
        next(new errorResponse_1.ErrorResponse('user not found', 404));
        return;
    }
    //Check curernt password
    if (!(yield (user === null || user === void 0 ? void 0 : user.matchPassword(req.body.currentPassword)))) {
        next(new errorResponse_1.ErrorResponse('Password is incorrect', 401));
        return;
    }
    user.password = req.body.newPassword;
    yield user.save();
    (0, generateCookieResponse_1.sendTokenResponse)(user, 200, res);
}));
//# sourceMappingURL=auth.js.map