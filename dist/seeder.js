"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Bootcamp_1 = require("./models/Bootcamp");
const Course_1 = require("./models/Course");
const path = require("path");
const User_1 = require("./models/User");
//Load env vars
dotenv_1.default.config({});
//Connect DB
mongoose_1.default.connect(process.env.MONGODB_URI);
//Read JSON file
const bootcamps = JSON.parse(fs_1.default.readFileSync(path.join(process.cwd(), '_data', 'bootcamps.json'), 'utf-8'));
const courses = JSON.parse(fs_1.default.readFileSync(path.join(process.cwd(), '_data', 'courses.json'), 'utf-8'));
const users = JSON.parse(fs_1.default.readFileSync(path.join(process.cwd(), '_data', 'users.json'), 'utf-8'));
//Import into the DB
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Bootcamp_1.Bootcamp.create(bootcamps);
        yield Course_1.Course.create(courses);
        yield User_1.User.create(users);
        console.log('Data Imported....');
        process.exit();
    }
    catch (error) {
        console.error('Something went wrong with data seeding!');
    }
});
//Delete data from DB
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Bootcamp_1.Bootcamp.deleteMany();
        yield Course_1.Course.deleteMany();
        yield User_1.User.deleteMany();
        console.log(`Data Deleted...`);
        process.exit();
    }
    catch (error) {
        console.error('Something went wrong with data deletion');
    }
});
if (process.argv[2] === '-i') {
    importData();
}
else if (process.argv[2] === '-d') {
    deleteData();
}
//# sourceMappingURL=seeder.js.map