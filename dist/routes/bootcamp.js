"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bootcamps_1 = require("../controllers/bootcamps");
const courses_1 = __importDefault(require("./courses"));
const advancedResults_1 = require("../middleware/advancedResults");
const Bootcamp_1 = require("../models/Bootcamp");
const guard_1 = require("../middleware/guard");
const router = express_1.default.Router();
//re-route to the course router
router.use('/:bootcampId/courses', courses_1.default);
//Uplaod image route
router
    .route('/:id/photo')
    .put(guard_1.protect, (0, guard_1.authorize)('publisher', 'admin'), bootcamps_1.bootcampPhotoUpload);
//we bind each rout to corresponding controller
router
    .route('/')
    .get((0, advancedResults_1.advancedResults)(Bootcamp_1.Bootcamp, { path: 'courses' }), bootcamps_1.getBootcamps)
    .post(guard_1.protect, (0, guard_1.authorize)('publisher', 'admin'), bootcamps_1.createBootcamp);
router.route('/radius/:zipcode/:distance').get(bootcamps_1.getBootcampsInRadius);
router
    .route('/:id')
    .get(bootcamps_1.getBootcamp)
    .delete(guard_1.protect, (0, guard_1.authorize)('publisher', 'admin'), bootcamps_1.deleteBootcamp)
    .put(guard_1.protect, (0, guard_1.authorize)('publisher', 'admin'), bootcamps_1.updateBootcamp);
exports.default = router;
//# sourceMappingURL=bootcamp.js.map