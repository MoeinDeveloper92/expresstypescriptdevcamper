import dotenv from 'dotenv';
dotenv.config({});

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'TEST';
export const SERVER_HOSTNAME = process.env.SERVER_HOST || 'localhost';
export const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 12345;
export const SERVER = {
  SERVER_HOSTNAME,
  SERVER_PORT,
};
