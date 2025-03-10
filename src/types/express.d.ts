// src/types/express.d.ts
import { Response } from 'express';

declare global {
  namespace Express {
    interface Response {
      advancedResults?: {
        success: boolean;
        count: number;
        pagination: {
          next?: { page: number; limit: number };
          prev?: { page: number; limit: number };
        };
        data: any[];
      };
    }
  }
}
