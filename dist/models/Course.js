"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CourseSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title!'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Please add course description'],
    },
    weeks: {
        type: String,
        required: [true, 'Please add course duration'],
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost'],
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'Bootcamps',
    },
});
const Course = mongoose_1.default.model('Courses', CourseSchema);
exports.Course = Course;
