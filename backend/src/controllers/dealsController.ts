import { Request, Response } from 'express';
import { pool } from '../config/db';
import { Deal } from '../models/deals';

export const getDeals = async (req: Request, res: Response) => {
    try {
        const {
            page = '1',
            limit = '10'
        } = req.query;

        // Pagination
        const pageNum = parseInt(page as string, 10) || 1;
        const pageSize = parseInt(limit as string, 10) || 10;
        const offset = (pageNum - 1) * pageSize;

        // Fixed query with hardcoded sorting
        const sql = 'SELECT * FROM deals ORDER BY created_at ASC LIMIT ? OFFSET ?';
        const params = [pageSize, offset];

        // Execute query
        const [rows] = await pool.query(sql, params);
        const deals = rows as Deal[];

        res.json({
            page: pageNum,
            limit: pageSize,
            data: deals,
        });
    } catch (error) {
        console.error('Error fetching deals:', error);
        res.status(500).json({
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
};
