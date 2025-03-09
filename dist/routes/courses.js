"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courses_1 = require("../controllers/courses");
//~~!!Allow url params to be merged!!~~
const router = express_1.default.Router({ mergeParams: true });
router.route('/').get(courses_1.getCourses);
exports.default = router;
