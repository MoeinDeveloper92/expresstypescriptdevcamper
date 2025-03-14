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
exports.bootcampPhotoUpload = exports.getBootcampsInRadius = exports.updateBootcamp = exports.deleteBootcamp = exports.createBootcamp = exports.getBootcamp = exports.getBootcamps = void 0;
const Bootcamp_1 = require("../models/Bootcamp");
const errorResponse_1 = require("../utils/errorResponse");
const async_1 = require("../middleware/async");
const path_1 = __importDefault(require("path"));
const User_1 = require("../models/User");
//@desc     Get all the bootcamps
//@route    GET /api/v1/bootcamps
//@access   public
exports.getBootcamps = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(res.advancedResults);
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
    // Check for published bootcamp
    const publishedBootcamp = yield Bootcamp_1.Bootcamp.findOne({
        user: req.headers.userId,
    });
    //If the user is not an admin, they can only add one bootcamp
    const loggedInUser = yield User_1.User.findById(req.headers.userId);
    if (publishedBootcamp && (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.role) !== 'admin') {
        next(new errorResponse_1.ErrorResponse(`The user with ID ${req.headers.userId} has already published a bootcamp`, 400));
        return;
    }
    const newBootcamp = yield Bootcamp_1.Bootcamp.create(Object.assign(Object.assign({}, req.body), { user: req.headers.userId }));
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
    const user = yield User_1.User.findById(req.headers.userId);
    //Make sure user is the owner of bootcamop
    if (bootcamp.user.toString() !== req.headers.userId &&
        (user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
        next(new errorResponse_1.ErrorResponse(`User ${req.headers.userId} is not authorized to delete this bootcamp!`, 401));
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
    var _a;
    const bootcamp = yield Bootcamp_1.Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        next(new errorResponse_1.ErrorResponse(`Bootcamp with Id ${req.params.id} not found!`, 404));
        return;
    }
    const user = yield User_1.User.findById(req.headers.userId);
    //Make sure  user is bootcamp owner
    if (bootcamp.user.toString() !== ((_a = req.headers.userId) === null || _a === void 0 ? void 0 : _a.toString()) &&
        (user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
        next(new errorResponse_1.ErrorResponse(`User ${req.headers.userId} is not authorized to update this bootcamp!`, 401));
        return;
    }
    const updatedBootcamp = yield Bootcamp_1.Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: updatedBootcamp,
    });
}));
//@desc     Get bootcamps within a raidus
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access   Public
exports.getBootcampsInRadius = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { zipcode, distance } = req.params;
    // Get lat/lng from the geocoder
    const lat = 79.0123;
    const lng = -56.1412;
    //Call radius using radians
    //Divide distance by radiuus of Earth
    //Earth Raidus = 3,963 mi
    const radius = Number(distance) / 3963;
    const bootcamps = yield Bootcamp_1.Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
}));
//@desc     upload a photo for bootcamp
//@route    PUT /api/v1/bootcamps/:id/photo
//@access   private
exports.bootcampPhotoUpload = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bootcamp = yield Bootcamp_1.Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        next(new errorResponse_1.ErrorResponse(`Bootcamp with Id ${req.params.id} not found!`, 404));
        return;
    }
    const user = yield User_1.User.findById(req.headers.userId);
    //Make sure user is the bootcamop owner
    if (bootcamp.user.toString() == (user === null || user === void 0 ? void 0 : user.id.toString()) &&
        (user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
        next(new errorResponse_1.ErrorResponse(`User ${user.id} is no authorized to upload photo`, 401));
    }
    if (!req.files) {
        next(new errorResponse_1.ErrorResponse(`Please upload a file`, 400));
        return;
    }
    const file = req.files.file;
    //Make sure that the image is a photo
    if (!file.mimetype.startsWith('image')) {
        next(new errorResponse_1.ErrorResponse(`Please upload an image file`, 400));
        return;
    }
    //check the file size
    //in NGINX we should have limit for size of image
    if (file.size > Number(process.env.MAX_FILE_UPLOAD)) {
        next(new errorResponse_1.ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
        return;
    }
    //Create custom file name
    file.name = `photo-${bootcamp._id}${path_1.default.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error(err);
            next(new errorResponse_1.ErrorResponse(`Problem with file upload`, 400));
            return;
        }
        yield Bootcamp_1.Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    }));
    res.status(200).json({
        success: true,
        data: file.name,
    });
}));
//# sourceMappingURL=bootcamps.js.map