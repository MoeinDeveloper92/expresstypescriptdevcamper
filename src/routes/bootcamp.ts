import express from 'express';
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
} from '../controllers/bootcamps';
const router = express.Router();

//we bind each rout to corresponding controller
router.route('/').get(getBootcamps).post(createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .delete(deleteBootcamp)
  .put(updateBootcamp);

export default router;
