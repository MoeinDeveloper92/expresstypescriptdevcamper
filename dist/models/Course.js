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
exports.Course = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Bootcamp_1 = require("./Bootcamp");
// Define the Schema
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
// Implement the Static Method
CourseSchema.statics.getAverageCost = function (bootcampId) {
    return __awaiter(this, void 0, void 0, function* () {
        const obj = yield this.aggregate([
            {
                $match: { bootcamp: bootcampId },
            },
            {
                $group: {
                    _id: '$bootcamp',
                    averageCost: { $avg: '$tuition' },
                },
            },
        ]);
        try {
            yield Bootcamp_1.Bootcamp.findByIdAndUpdate(bootcampId, {
                averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
            });
        }
        catch (error) {
            console.error(error);
        }
    });
};
CourseSchema.post('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const course = this;
        if (course.bootcamp) {
            try {
                yield Course.getAverageCost(course.bootcamp);
            }
            catch (err) {
                console.error('Error calculating average cost:', err);
            }
        }
    });
});
CourseSchema.post('findOneAndDelete', function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            yield doc.model('Courses').getAverageCost(doc.bootcamp);
        }
    });
});
// Create Model with the Interface
const Course = mongoose_1.default.model('Courses', CourseSchema);
exports.Course = Course;
//# sourceMappingURL=Course.js.map