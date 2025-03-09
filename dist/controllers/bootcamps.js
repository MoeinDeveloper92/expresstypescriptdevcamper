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
exports.updateBootcamp = exports.deleteBootcamp = exports.createBootcamp = exports.getBootcamp = exports.getBootcamps = void 0;
const Bootcamp_1 = require("../models/Bootcamp");
const errorResponse_1 = require("../utils/errorResponse");
const async_1 = require("../middleware/async");
//@desc     Get all the bootcamps
//@route    GET /api/v1/bootcamps
//@access   public
exports.getBootcamps = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bootcamps = yield Bootcamp_1.Bootcamp.find();
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
}));
//@desc     get Single Bootcamp
//@access   GET /api/v1/bootcamps/:id
//@access   public
exports.getBootcamp = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bootcamp = yield Bootcamp_1.Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        next(new errorResponse_1.ErrorResponse(`Bootcamp with Id ${req.params.id} not found!`, 404));
        return;
    }
    res.status(200).json({
        success: true,
        data: bootcamp,
    });
}));
//@desc     creaet A bootcamp
//@route    POST /api/v1/bootcamps
//@access   private
exports.createBootcamp = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newBootcamp = yield Bootcamp_1.Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: newBootcamp,
    });
}));
//@desc     Delete a bootcamp
//@route    POST /api/v1/bootcamps/:id
//@access   private
exports.deleteBootcamp = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bootcamp = yield Bootcamp_1.Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        next(new errorResponse_1.ErrorResponse(`Bootcamp with Id ${req.params.id} not found!`, 404));
        return;
    }
    yield Bootcamp_1.Bootcamp.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: `Delete Bootcamp ${req.params.id}`,
    });
}));
//@desc     Update a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   private
exports.updateBootcamp = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bootcamp = yield Bootcamp_1.Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bootcamp) {
        next(new errorResponse_1.ErrorResponse(`Bootcamp with Id ${req.params.id} not found!`, 404));
        return;
    }
    res.status(200).json({
        success: true,
        data: bootcamp,
    });
}));
