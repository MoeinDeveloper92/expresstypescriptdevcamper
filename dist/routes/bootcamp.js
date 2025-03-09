"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bootcamps_1 = require("../controllers/bootcamps");
const router = express_1.default.Router();
//we bind each rout to corresponding controller
router.route('/').get(bootcamps_1.getBootcamps).post(bootcamps_1.createBootcamp);
router
    .route('/:id')
    .get(bootcamps_1.getBootcamp)
    .delete(bootcamps_1.deleteBootcamp)
    .put(bootcamps_1.updateBootcamp);
exports.default = router;
