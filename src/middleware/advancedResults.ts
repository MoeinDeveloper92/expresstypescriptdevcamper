import { Request, Response, NextFunction } from 'express';
import { Model, Document, PopulateOption, PopulateOptions } from 'mongoose';

interface AdvancedResponse<T> extends Response {
  advancedResults?: {
    success: boolean;
    count: number;
    pagination: {
      next?: { page: number; limit: number };
      prev?: { page: number; limit: number };
    };
    data: T[];
  };
}

// Pagination Middleware
const advancedResults =
  <T extends Document>(model: Model<T>, populate?: PopulateOptions) =>
  async (req: Request, res: AdvancedResponse<T>, next: NextFunction) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude that should not be used in filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Remove unwanted fields from the query
    removeFields.forEach((param) => delete reqQuery[param]);

    // Convert query object to string and add MongoDB operators
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Build the query
    query = model.find(JSON.parse(queryStr));

    // Select specific fields if requested
    if (req.query.select) {
      const selectedFields = (req.query.select as string).split(',').join(' ');
      query = query.select(selectedFields);
    }

    // Sorting
    if (req.query.sort) {
      const sortedFields = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortedFields);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Populate related data if specified
    if (populate) {
      query = query.populate(populate);
    }

    // Execute query
    const results = await query;

    // Pagination logic
    const pagination: {
      next?: { page: number; limit: number };
      prev?: { page: number; limit: number };
    } = {};

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
  };

export { advancedResults };
