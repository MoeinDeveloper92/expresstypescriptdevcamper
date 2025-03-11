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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const errorResponse_1 = require("../utils/errorResponse");
const async_1 = require("../middleware/async");
const User_1 = require("../models/User");
//@desc     Get all users
//@route    GET /api/v1/auth/users
//@access   private/Admin
exports.getUsers = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(res.advancedResults);
}));
//@desc     Get single user
//@route    GET /api/v1/auth/users/:id
//@access   private/Admin
exports.getUser = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findById(req.params.id);
    if (!user) {
        next(new errorResponse_1.ErrorResponse(`User ${req.params.id} not found!`, 404));
        return;
    }
    res.status(200).json({
        success: true,
        data: user,
    });
}));
//@desc     create User
//@route    POST /api/v1/auth/users
//@access   private/Admin
exports.createUser = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.create(req.body);
    res.status(201).json({
        success: true,
        data: user,
    });
}));
//@desc     Update the user
//@route    PUT /api/v1/auth/users/:id
//@access   private/Admin
exports.updateUser = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: user,
    });
}));
//@desc     Delete User
//@route    DELETE /api/v1/auth/users/:id
//@access   private/Admin
exports.deleteUser = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: {},
    });
}));
//# sourceMappingURL=users.js.map