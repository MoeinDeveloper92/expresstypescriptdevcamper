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
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourse = exports.getCourses = void 0;
const Course_1 = require("../models/Course");
const async_1 = require("../middleware/async");
const errorResponse_1 = require("../utils/errorResponse");
const Bootcamp_1 = require("../models/Bootcamp");
const User_1 = require("../models/User");
//@desc     Get all courses
//@route    GET /api/v1/courses
//@route    GET /api/v1/bootcamps/:bootcampId/courses
//@access   public
exports.getCourses = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    if (req.params.bootcampId) {
        const courses = yield Course_1.Course.find({ bootcamp: req.params.bootcampId });
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
        return;
    }
    else {
        res.status(200).json(res.advancedResults);
    }
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
    const user = yield User_1.User.findById(req.headers.userId);
    //Make sure the user is bootcamp owner
    if (bootcamp.user.toString() !== req.headers.userId &&
        (user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
        next(new errorResponse_1.ErrorResponse(`User ${req.headers.userId} is not authorized to add a course to bootcamp ${req.params.bootcampId}`, 401));
    }
    const course = yield Course_1.Course.create(Object.assign(Object.assign({}, req.body), { bootcamp: req.params.bootcampId, user: req.headers.userId }));
    res.status(200).json({
        success: true,
        data: course,
    });
}));
//@desc     Update Course
//@route    POST /api/v1/courses/:id
//@access   private
exports.updateCourse = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let course = yield Course_1.Course.findById(req.params.id);
    if (!course) {
        next(new errorResponse_1.ErrorResponse(`Course ${req.params.id} not found`, 404));
        return;
    }
    const user = yield User_1.User.findById(req.headers.userId);
    //Make sure the user is the owner of the bootcamp
    if (course.user.toString() !== req.headers.userId &&
        (user === null || user === void 0 ? void 0 : user.role) === 'admin') {
        next(new errorResponse_1.ErrorResponse(`User ${user.id} is not authorized to update the course ${req.params.id}`, 401));
        return;
    }
    //update cpurse
    course = yield Course_1.Course.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true,
    });
    res.status(200).json({
        success: true,
        data: course,
    });
}));
//@desc     Delete Course
//@route    POST /api/v1/courses/:id
//@access   private
exports.deleteCourse = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let course = yield Course_1.Course.findById(req.params.id);
    if (!course) {
        next(new errorResponse_1.ErrorResponse(`Course ${req.params.id} not found`, 404));
        return;
    }
    const user = yield User_1.User.findById(req.headers.userId);
    //Make sure the user is the owner of the bootcamp
    if (course.user.toString() !== req.headers.userId &&
        (user === null || user === void 0 ? void 0 : user.role) === 'admin') {
        next(new errorResponse_1.ErrorResponse(`User ${user.id} is not authorized to delete the course ${req.params.id}`, 401));
        return;
    }
    //delete course
    yield Course_1.Course.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({
        success: true,
        message: 'course deleted!',
        data: null,
    });
}));
//# sourceMappingURL=courses.js.map