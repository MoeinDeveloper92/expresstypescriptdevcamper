import express from 'express';
import { getCourses } from '../controllers/courses';

//~~!!Allow url params to be merged!!~~
const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses);

export default router;
