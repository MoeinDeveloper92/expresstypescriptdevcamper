import { Course } from '../models/Course';
import { asyncHandler } from '../middleware/async';
import { ErrorResponse } from '../utils/errorResponse';
import { Request, Response, NextFunction } from 'express';
import { Bootcamp } from '../models/Bootcamp';
//@desc     Get all courses
//@route    GET /api/v1/courses
//@route    GET /api/v1/bootcamps/:bootcampId/courses
//@access   public
export const getCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let query;
    if (req.params.bootcampId) {
      query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
      query = Course.find().populate({
        path: 'bootcamp',
        select: 'name description -_id',
      });
    }

    const courses = await query;

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
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
    const course = await Course.create({
      ...req.body,
      bootcamp: req.params.bootcampId,
    });

    res.status(201).json({
      success: true,
      data: course,
    });
  }
);
