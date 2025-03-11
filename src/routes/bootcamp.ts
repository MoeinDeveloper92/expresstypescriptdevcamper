import express from 'express';
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} from '../controllers/bootcamps';
import courseRoute from './courses';
import { advancedResults } from '../middleware/advancedResults';
import { Bootcamp, BootcampSchema, IBootcamp } from '../models/Bootcamp';
import { Model } from 'mongoose';
import { protect, authorize } from '../middleware/guard';
const router = express.Router();
//re-route to the course router
router.use('/:bootcampId/courses', courseRoute);

//Uplaod image route
router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);
//we bind each rout to corresponding controller
router
  .route('/')
  .get(advancedResults<IBootcamp>(Bootcamp, { path: 'courses' }), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router
  .route('/:id')
  .get(getBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp);

export default router;
