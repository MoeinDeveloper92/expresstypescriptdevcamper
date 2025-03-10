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
  .post(createCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

export default router;
