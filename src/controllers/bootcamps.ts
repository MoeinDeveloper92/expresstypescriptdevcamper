import { Request, Response, NextFunction } from 'express';
import { Bootcamp } from '../models/Bootcamp';
import { ErrorResponse } from '../utils/errorResponse';
import { asyncHandler } from '../middleware/async';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
//@desc     Get all the bootcamps
//@route    GET /api/v1/bootcamps
//@access   public
export const getBootcamps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
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

//@desc     upload a photo for bootcamp
//@route    PUT /api/v1/bootcamps/:id/photo
//@access   private
export const bootcampPhotoUpload = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      next(
        new ErrorResponse(`Bootcamp with Id ${req.params.id} not found!`, 404)
      );
      return;
    }
    if (!req.files) {
      next(new ErrorResponse(`Please upload a file`, 400));
      return;
    }

    const file = req.files.file as UploadedFile;

    //Make sure that the image is a photo
    if (!file.mimetype.startsWith('image')) {
      next(new ErrorResponse(`Please upload an image file`, 400));
      return;
    }
    //check the file size
    //in NGINX we should have limit for size of image
    if (file.size > Number(process.env.MAX_FILE_UPLOAD)) {
      next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
      return;
    }

    //Create custom file name
    file.name = `photo-${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        next(new ErrorResponse(`Problem with file upload`, 400));
        return;
      }
      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  }
);
