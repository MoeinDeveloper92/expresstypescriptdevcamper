import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'colorts/lib/string';
import { mongoClient } from './config/db';
import './config/logging';
import { errorHandler } from './middleware/error';
import bootcampRoute from './routes/bootcamp';
import courseRoute from './routes/courses';
import authRoute from './routes/auth';
import { corsHandler } from './middleware/corsHandler';
import { loggingHandler } from './middleware/logger';
import { routeNotFound } from './middleware/routeNotFound';
import fileupload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import path from 'path';
//Config env, and Load env vars
dotenv.config({});
const PORT = process.env.PORT || 8000;

//ConnectDB
mongoClient.connectDB();
const app: Express = express();

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Cookie parser
app.use(cookieParser());

//Cors
app.use(corsHandler);
const runServer = () => {
  //Tiny Loggin Middleware
  if (process.env.NODE_ENV === 'development') {
    logging.info(`-----------------------------------------------------`);
    logging.info('Initializing Application');
    logging.info(`-----------------------------------------------------`);
    logging.info('');
    logging.info(`----------------------------------------------------`);
    logging.info(`Logging & Configuration`);
    logging.info(`----------------------------------------------------`);
    logging.info(`----------------------------------------------------`);
    logging.info(`Define Controller Routing`);
    logging.info(`----------------------------------------------------`);
    app.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Welcome to DevCamp Backend API!',
      });
    });
  }
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to DevCamp Backend API!',
    });
  });
  logging.info(`----------------------------------------------------`);
  logging.info(`File Uplaod Middleware`);
  app.use(fileupload());
  logging.info(`----------------------------------------------------`);

  logging.info(`----------------------------------------------------`);
  logging.info(`Start Server`);
  logging.info(`----------------------------------------------------`);

  // App Logger!
  app.use(loggingHandler);
  //Route mapping/ Mount Route
  app.use('/api/v1/bootcamps', bootcampRoute);
  app.use('/api/v1/courses', courseRoute);
  app.use('/api/v1/auth', authRoute);

  logging.info(`----------------------------------------------------`);
  logging.info(`Router Not Found!`);
  logging.info(`----------------------------------------------------`);
  app.use(routeNotFound);

  const server = app.listen(PORT as number, '0.0.0.0', async () => {
    logging.log(
      `The server is running on mode:${process.env.NODE_ENV}, PORT:${process.env.PORT}`
    );
  });

  app.use(errorHandler);

  //Hanlde unhandled rejections / Promise Rejections
  process.on('unhandledRejection', (error: Error, promise: Promise<any>) => {
    console.log(`Error: ${error.message}`.red.bold);
    //Exit with failure
    server.close(() => process.exit(1));
  });
};

runServer();
