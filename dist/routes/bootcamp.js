"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bootcamps_1 = require("../controllers/bootcamps");
const courses_1 = __importDefault(require("./courses"));
const router = express_1.default.Router();
//re-route to the course router
router.use('/:bootcampId/courses', courses_1.default);
//Uplaod image route
router.route("/:id/photo").put(bootcamps_1.bootcampPhotoUpload);
//we bind each rout to corresponding controller
router.route('/').get(bootcamps_1.getBootcamps).post(bootcamps_1.createBootcamp);
router.route('/radius/:zipcode/:distance').get(bootcamps_1.getBootcampsInRadius);
router
    .route('/:id')
    .get(bootcamps_1.getBootcamp)
    .delete(bootcamps_1.deleteBootcamp)
    .put(bootcamps_1.updateBootcamp);
exports.default = router;
