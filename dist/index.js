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
const courses_1 = __importDefault(require("./routes/courses"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const corsHandler_1 = require("./middleware/corsHandler");
const logger_1 = require("./middleware/logger");
const routeNotFound_1 = require("./middleware/routeNotFound");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
//Config env, and Load env vars
dotenv_1.default.config({});
const PORT = process.env.PORT || 8000;
//ConnectDB
db_1.mongoClient.connectDB();
const app = (0, express_1.default)();
//Set static folder
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
//Body Parse
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//Cookie parser
app.use((0, cookie_parser_1.default)());
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
    logging.info(`File Uplaod Middleware`);
    app.use((0, express_fileupload_1.default)());
    logging.info(`----------------------------------------------------`);
    logging.info(`----------------------------------------------------`);
    logging.info(`Start Server`);
    logging.info(`----------------------------------------------------`);
    // App Logger!
    app.use(logger_1.loggingHandler);
    //Route mapping/ Mount Route
    app.use('/api/v1/bootcamps', bootcamp_1.default);
    app.use('/api/v1/courses', courses_1.default);
    app.use('/api/v1/auth', auth_1.default);
    app.use('/api/v1/users', users_1.default);
    logging.info(`----------------------------------------------------`);
    logging.info(`Router Not Found!`);
    logging.info(`----------------------------------------------------`);
    app.use(routeNotFound_1.routeNotFound);
    const server = app.listen(PORT, '0.0.0.0', () => __awaiter(void 0, void 0, void 0, function* () {
        logging.log(`The server is running on mode:${process.env.NODE_ENV}, PORT:${process.env.PORT}`);
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
//# sourceMappingURL=index.js.map