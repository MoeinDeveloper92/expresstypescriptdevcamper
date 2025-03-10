import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Bootcamp } from './models/Bootcamp';
import { Course } from './models/Course';
import path = require('path');
//Load env vars
dotenv.config({});

//Connect DB
mongoose.connect(process.env.MONGODB_URI as string);

//Read JSON file
const bootcamps = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), '_data', 'bootcamps.json'), 'utf-8')
);
const courses = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), '_data', 'courses.json'), 'utf-8')
);
//Import into the DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    // await Course.create(courses);
    console.log('Data Imported....');
    process.exit();
  } catch (error) {
    console.error('Something went wrong with data seeding!');
  }
};

//Delete data from DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log(`Data Deleted...`);
    process.exit();
  } catch (error) {
    console.error('Something went wrong with data deletion');
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
