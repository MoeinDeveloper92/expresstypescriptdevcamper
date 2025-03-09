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
exports.createCourse = exports.getCourse = exports.getCourses = void 0;
const Course_1 = require("../models/Course");
const async_1 = require("../middleware/async");
const errorResponse_1 = require("../utils/errorResponse");
const Bootcamp_1 = require("../models/Bootcamp");
//@desc     Get all courses
//@route    GET /api/v1/courses
//@route    GET /api/v1/bootcamps/:bootcampId/courses
//@access   public
exports.getCourses = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    if (req.params.bootcampId) {
        query = Course_1.Course.find({ bootcamp: req.params.bootcampId });
    }
    else {
        query = Course_1.Course.find().populate({
            path: 'bootcamp',
            select: 'name description -_id',
        });
    }
    const courses = yield query;
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
    });
}));
//@desc     Get single course
//@route    GET /api/v1/courses/:id
//@access   public
exports.getCourse = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield Course_1.Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description -_id',
    });
    if (!course) {
        next(new errorResponse_1.ErrorResponse(`Course with id ${req.params.id} not found!`, 404));
        return;
    }
    res.status(200).json({
        success: true,
        data: course,
    });
}));
//@desc     Add a course
//@route    POST /api/v1/bootcamp/:bootcampId/courses
//@access   private
exports.createCourse = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //check the bootcamp
    const bootcamp = yield Bootcamp_1.Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        next(new errorResponse_1.ErrorResponse(`Bootcamp with Id ${req.params.bootcampId} not found!`, 404));
        return;
    }
    const course = yield Course_1.Course.create(Object.assign(Object.assign({}, req.body), { bootcamp: req.params.bootcampId }));
    res.status(201).json({
        success: true,
        data: course,
    });
}));
