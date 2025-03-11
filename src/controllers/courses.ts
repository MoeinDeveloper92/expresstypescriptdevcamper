import { Course } from '../models/Course';
import { asyncHandler } from '../middleware/async';
import { ErrorResponse } from '../utils/errorResponse';
import { Request, Response, NextFunction } from 'express';
import { Bootcamp } from '../models/Bootcamp';
import { ObjectId } from 'mongoose';
import { User } from '../models/User';

//@desc     Get all courses
//@route    GET /api/v1/courses
//@route    GET /api/v1/bootcamps/:bootcampId/courses
//@access   public
export const getCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let query;
    if (req.params.bootcampId) {
      const courses = await Course.find({ bootcamp: req.params.bootcampId });
      res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
      return;
    } else {
      res.status(200).json(res.advancedResults);
    }
  }
);

//@desc     Get single course
//@route    GET /api/v1/courses/:id
//@access   public
export const getCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description -_id',
    });
    if (!course) {
      next(
        new ErrorResponse(`Course with id ${req.params.id} not found!`, 404)
      );
      return;
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  }
);
//@desc     Add a course
//@route    POST /api/v1/bootcamp/:bootcampId/courses
//@access   private
export const createCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //check the bootcamp
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
      next(
        new ErrorResponse(
          `Bootcamp with Id ${req.params.bootcampId} not found!`,
          404
        )
      );
      return;
    }
    const user = await User.findById(req.headers.userId);
    //Make sure the user is bootcamp owner
    if (
      bootcamp.user.toString() !== req.headers.userId &&
      user?.role !== 'admin'
    ) {
      next(
        new ErrorResponse(
          `User ${req.headers.userId} is not authorized to add a course to bootcamp ${req.params.bootcampId}`,
          401
        )
      );
    }
    const course = await Course.create({
      ...req.body,
      bootcamp: req.params.bootcampId,
      user: req.headers.userId,
    });

    res.status(200).json({
      success: true,
      data: course,
    });
  }
);

//@desc     Update Course
//@route    POST /api/v1/courses/:id
//@access   private
export const updateCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let course = await Course.findById(req.params.id);
    if (!course) {
      next(new ErrorResponse(`Course ${req.params.id} not found`, 404));
      return;
    }

    const user = await User.findById(req.headers.userId);

    //Make sure the user is the owner of the bootcamp
    if (
      course.user.toString() !== req.headers.userId &&
      user?.role === 'admin'
    ) {
      next(
        new ErrorResponse(
          `User ${user.id} is not authorized to update the course ${req.params.id}`,
          401
        )
      );

      return;
    }
    //update cpurse
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    res.status(200).json({
      success: true,
      data: course,
    });
  }
);

//@desc     Delete Course
//@route    POST /api/v1/courses/:id
//@access   private
export const deleteCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let course = await Course.findById(req.params.id);
    if (!course) {
      next(new ErrorResponse(`Course ${req.params.id} not found`, 404));
      return;
    }

    const user = await User.findById(req.headers.userId);

    //Make sure the user is the owner of the bootcamp
    if (
      course.user.toString() !== req.headers.userId &&
      user?.role === 'admin'
    ) {
      next(
        new ErrorResponse(
          `User ${user.id} is not authorized to delete the course ${req.params.id}`,
          401
        )
      );

      return;
    }

    //delete course
    await Course.findOneAndDelete({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'course deleted!',
      data: null,
    });
  }
);
