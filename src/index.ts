import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bootcampRoute from './routes/bootcamp';
//Config env, and Load env vars
dotenv.config({});
const PORT = process.env.PORT || 8000;

const app: Express = express();

const runServer = () => {
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to DevCamp Backend API!',
    });
  });

  //Route mapping
  app.use('/api/v1/bootcamps', bootcampRoute);

  app.listen(PORT as number, '0.0.0.0', () => {
    console.log(
      `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
};

runServer();
