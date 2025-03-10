import express from 'express';
import { getMe, login, register } from '../controllers/auth';
import { protect } from '../middleware/guard';
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);

export default router;
