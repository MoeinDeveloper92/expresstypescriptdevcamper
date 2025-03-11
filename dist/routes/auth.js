"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const guard_1 = require("../middleware/guard");
const router = express_1.default.Router();
router.route('/register').post(auth_1.register);
router.route('/login').post(auth_1.login);
router.route('/me').get(guard_1.protect, auth_1.getMe);
router.route('/forgotpassword').post(auth_1.forgotPassowrd);
exports.default = router;
//# sourceMappingURL=auth.js.map