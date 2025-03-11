import { Response } from 'express';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../models/User';

//get token from model , create cookie and send response
const sendTokenResponse = (
  user: HydratedDocument<IUser>,
  statusCode: number,
  res: Response
) => {
  //create token
  const token = user.getSignedJwtToken();

  const options: {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
  } = {
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    //js client side cannot have access to the cookie
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

export { sendTokenResponse };
