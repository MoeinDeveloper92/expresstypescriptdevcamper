import express from 'express';
import { protect, authorize } from '../middleware/guard';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users';
import { User } from '../models/User';
import { advancedResults } from '../middleware/advancedResults';
const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export default router;
