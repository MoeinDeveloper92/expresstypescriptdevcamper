import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courses';
import { Course, ICourse } from '../models/Course';
import { advancedResults } from '../middleware/advancedResults';
import { protect, authorize } from '../middleware/guard';

//~~!!Allow url params to be merged!!~~
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults<ICourse>(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), createCourse);
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

export default router;
