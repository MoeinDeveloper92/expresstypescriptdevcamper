import { Request, Response, NextFunction } from 'express';

//@desc     Get all the bootcamps
//@route    GET /api/v1/bootcamps
//@access   public
export const getBootcamps = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    success: true,
    message: 'Show all the bootcamps',
  });
};

//@desc     Show Single Bootcamp
//@access   GET /api/v1/bootcamps/:id
//@access   public
export const getBootcamp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    success: true,
    message: `show bootcamp ${req.params.id}`,
  });
};

//@desc     creaet A bootcamp
//@route    POST /api/v1/bootcamps
//@access   private
export const createBootcamp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(201).json({
    success: true,
    message: 'create a bootcamp',
  });
};

//@desc     Delete a bootcamp
//@route    POST /api/v1/bootcamps/:id
//@access   private
export const deleteBootcamp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    success: true,
    message: `Delete Bootcamp ${req.params.id}`,
  });
};

//@desc     Update a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   private
export const updateBootcamp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    success: true,
    message: `Update Bootcamp ${req.params.id}`,
  });
};
