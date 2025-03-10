"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsHandler = corsHandler;
function corsHandler(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type,Accept,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'PUT, POST, PATCH,DELETE,GET');
        res.status(200).json({});
        return;
    }
    next();
}
//# sourceMappingURL=corsHandler.js.map