import { Request, Response, NextFunction } from 'express';
import { Bootcamp } from '../models/Bootcamp';
import { ErrorResponse } from '../utils/errorResponse';
import { asyncHandler } from '../middleware/async';

//@desc     Get all the bootcamps
//@route    GET /api/v1/bootcamps
//@access   public
export const getBootcamps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let query;

    //Copy req.query
    const reqQuery = { ...req.query };

    //Fields to exclude that I do not want to be matched
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //Loop over removeFileds and delete them from reqQuery
    removeFields.forEach((item) => delete reqQuery[item]);

    //Create query string
    let queryStr = JSON.stringify(reqQuery);

    //Create operators ($gt, $gte...)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    //Finding Resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    //SELECT FIELDS
    if (req.query.select) {
      let selectedField = req.query.select as string;
      selectedField = selectedField.split(',').join(' ');
      query = query.select(selectedField);
    }

    //SORT FIELDS
    if (req.query.sort) {
      let sortedField = req.query.sort as string;
      sortedField = sortedField.split(',').join(' ');
      query = query.sort(sortedField);
    } else {
      query = query.sort('-createdAt');
    }

    //Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();
    query = query.skip(startIndex).limit(limit);

    //Execurting our query
    const bootcamps = await query;

    //Pagination Result
    const pagination: {
      next?: {};
      prev?: {};
    } = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      pagination,
      data: bootcamps,
    });
  }
);

//@desc     get Single Bootcamp
//@access   GET /api/v1/bootcamps/:id
//@access   public
export const getBootcamp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      next(
        new ErrorResponse(`Bootcamp with Id ${req.params.id} not found!`, 404)
      );
      return;
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  }
);

//@desc     creaet A bootcamp
//@route    POST /api/v1/bootcamps
//@access   private
export const createBootcamp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newBootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: newBootcamp,
    });
  }
);

//@desc     Delete a bootcamp
//@route    POST /api/v1/bootcamps/:id
//@access   private
export const deleteBootcamp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      next(
        new ErrorResponse(`Bootcamp with Id ${req.params.id} not found!`, 404)
      );
      return;
    }
    await Bootcamp.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: `Delete Bootcamp ${req.params.id}`,
    });
  }
);

//@desc     Update a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   private
export const updateBootcamp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      next(
        new ErrorResponse(`Bootcamp with Id ${req.params.id} not found!`, 404)
      );
      return;
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  }
);

//@desc     Get bootcamps within a raidus
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access   Public
export const getBootcampsInRadius = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from the geocoder
    const lat = 79.0123;
    const lng = -56.1412;

    //Call radius using radians
    //Divide distance by radiuus of Earth
    //Earth Raidus = 3,963 mi
    const radius = Number(distance) / 3963;
    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  }
);
