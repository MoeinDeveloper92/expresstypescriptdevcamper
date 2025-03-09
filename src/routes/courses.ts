import express from 'express';
import { getCourses, getCourse, createCourse } from '../controllers/courses';

//~~!!Allow url params to be merged!!~~
const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(createCourse);
router.route('/:id').get(getCourse);

export default router;
