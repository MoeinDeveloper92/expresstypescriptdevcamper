"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const guard_1 = require("../middleware/guard");
const users_1 = require("../controllers/users");
const User_1 = require("../models/User");
const advancedResults_1 = require("../middleware/advancedResults");
const router = express_1.default.Router();
router.use(guard_1.protect);
router.use((0, guard_1.authorize)('admin'));
router.route('/').get((0, advancedResults_1.advancedResults)(User_1.User), users_1.getUsers).post(users_1.createUser);
router.route('/:id').get(users_1.getUser).put(users_1.updateUser).delete(users_1.deleteUser);
exports.default = router;
//# sourceMappingURL=users.js.map