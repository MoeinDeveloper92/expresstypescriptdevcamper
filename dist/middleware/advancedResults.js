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
Object.defineProperty(exports, "__esModule", { value: true });
exports.advancedResults = void 0;
// Pagination Middleware
const advancedResults = (model, populate) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    // Copy req.query
    const reqQuery = Object.assign({}, req.query);
    // Fields to exclude that should not be used in filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    // Remove unwanted fields from the query
    removeFields.forEach((param) => delete reqQuery[param]);
    // Convert query object to string and add MongoDB operators
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    // Build the query
    query = model.find(JSON.parse(queryStr));
    // Select specific fields if requested
    if (req.query.select) {
        const selectedFields = req.query.select.split(',').join(' ');
        query = query.select(selectedFields);
    }
    // Sorting
    if (req.query.sort) {
        const sortedFields = req.query.sort.split(',').join(' ');
        query = query.sort(sortedFields);
    }
    else {
        query = query.sort('-createdAt');
    }
    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = yield model.countDocuments();
    query = query.skip(startIndex).limit(limit);
    // Populate related data if specified
    if (populate) {
        query = query.populate(populate);
    }
    // Execute query
    const results = yield query;
    // Pagination logic
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }
    // Attach results to response
    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results,
    };
    next();
});
exports.advancedResults = advancedResults;
//# sourceMappingURL=advancedResults.js.map