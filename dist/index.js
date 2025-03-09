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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
require("colorts/lib/string");
const db_1 = require("./config/db");
require("./config/logging");
const error_1 = require("./middleware/error");
const bootcamp_1 = __importDefault(require("./routes/bootcamp"));
const corsHandler_1 = require("./middleware/corsHandler");
//Config env, and Load env vars
dotenv_1.default.config({});
const PORT = process.env.PORT || 8000;
//ConnectDB
db_1.mongoClient.connectDB();
const app = (0, express_1.default)();
//Body Parse
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//Cors
app.use(corsHandler_1.corsHandler);
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
    logging.info(`Start Server`);
    logging.info(`----------------------------------------------------`);
    //Route mapping/ Mount Route
    app.use('/api/v1/bootcamps', bootcamp_1.default);
    const server = app.listen(PORT, '0.0.0.0', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`The server is running on mode:${process.env.NODE_ENV}, PORT:${process.env.PORT}`
            .bgCyan.underline.bold);
    }));
    app.use(error_1.errorHandler);
    //Hanlde unhandled rejections / Promise Rejections
    process.on('unhandledRejection', (error, promise) => {
        console.log(`Error: ${error.message}`.red.bold);
        //Exit with failure
        server.close(() => process.exit(1));
    });
};
runServer();
