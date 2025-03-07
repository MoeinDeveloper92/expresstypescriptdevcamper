import { Request, Response, NextFunction } from 'express';
import { Bootcamp } from '../models/Bootcamp';

//@desc     Get all the bootcamps
//@route    GET /api/v1/bootcamps
//@access   public
export const getBootcamps = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      cound: bootcamps.length,
      data: bootcamps,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
    });
  }
};

//@desc     Show Single Bootcamp
//@access   GET /api/v1/bootcamps/:id
//@access   public
export const getBootcamp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      res.status(400).json({
        success: false,
        data: null,
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      data: null,
    });
  }
};

//@desc     creaet A bootcamp
//@route    POST /api/v1/bootcamps
//@access   private
export const createBootcamp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newBootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: newBootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
    });
  }
};

//@desc     Delete a bootcamp
//@route    POST /api/v1/bootcamps/:id
//@access   private
export const deleteBootcamp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      res.status(400).json({
        success: false,
        data: null,
      });
      return;
    }
    await Bootcamp.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: `Delete Bootcamp ${req.params.id}`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
    });
  }
};

//@desc     Update a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   private
export const updateBootcamp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      res.status(400).json({
        success: false,
        data: null,
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
    });
  }
};
