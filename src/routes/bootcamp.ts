import express from 'express';
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} from '../controllers/bootcamps';
import courseRoute from './courses';
const router = express.Router();

//re-route to the course router
router.use('/:bootcampId/courses', courseRoute);

//Uplaod image route
router.route("/:id/photo").put(bootcampPhotoUpload)
//we bind each rout to corresponding controller
router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router
  .route('/:id')
  .get(getBootcamp)
  .delete(deleteBootcamp)
  .put(updateBootcamp);

export default router;
