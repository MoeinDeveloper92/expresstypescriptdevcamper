import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'colorts/lib/string';
import { mongoClient } from './config/db';

import { errorHandler } from './middleware/error';
import bootcampRoute from './routes/bootcamp';

//Config env, and Load env vars
dotenv.config({});
const PORT = process.env.PORT || 8000;

//ConnectDB
mongoClient.connectDB();
const app: Express = express();

//Body Parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const runServer = () => {
  //Tiny Loggin Middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
  }
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to DevCamp Backend API!',
    });
  });

  //Route mapping/ Mount Route
  app.use('/api/v1/bootcamps', bootcampRoute);

  const server = app.listen(PORT as number, '0.0.0.0', async () => {
    console.log(
      `The server is running on mode:${process.env.NODE_ENV}, PORT:${process.env.PORT}`
        .bgCyan.underline.bold
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
