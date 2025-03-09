import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Bootcamp } from './models/Bootcamp';
//Load env vars
dotenv.config({});

//Connect DB
mongoose.connect(process.env.MONGODB_URI as string);

//Read JSON file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

//Import into the DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log(`Data imported....`.green.inverse);
    process.exit();
  } catch (error) {
    console.error('Something went wrong with data seeding!');
  }
};

//Delete data from DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log(`Data Deleted...`.red.inverse);
    process.exit();
  } catch (error) {
    console.error('Something went wrong with data deletion');
  }
};

if (process.argv[3] === '-i') {
  importData();
} else if (process.argv[3] === '-d') {
  deleteData();
}
