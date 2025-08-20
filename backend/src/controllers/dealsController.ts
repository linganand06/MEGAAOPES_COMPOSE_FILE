import { Request, Response } from 'express';
import { pool } from '../config/db';
import { Deal } from '../models/deals';

// export const getDeals = async (req: Request, res: Response) => {
//     try {
//         const {
//             search,
//             stage,
//             minValue,
//             maxValue,
//             dateCreatedFrom,
//             dateCreatedTo,
//             closeDateFrom,
//             closeDateTo,
//             page = '1',
//             limit = '10'
//         } = req.query;

     
//         let sql = 'SELECT * FROM deals WHERE 1=1';
//         const params: any[] = [];
//         if (search && typeof search === 'string') {
//             sql += ' AND (name LIKE ? OR contact_name LIKE ? OR company LIKE ?)';
//             const wildcardSearch = `%${search}%`;
//             params.push(wildcardSearch, wildcardSearch, wildcardSearch);
//         }

//         // Filter by stage
//         if (stage && typeof stage === 'string') {
//             sql += ' AND stage = ?';
//             params.push(stage);
//         }

//         // Filter by value range
//         if (minValue && !isNaN(Number(minValue))) {
//             sql += ' AND value >= ?';
//             params.push(Number(minValue));
//         }
//         if (maxValue && !isNaN(Number(maxValue))) {
//             sql += ' AND value <= ?';
//             params.push(Number(maxValue));
//         }

//         // Filter by created_at date range
//         if (dateCreatedFrom && typeof dateCreatedFrom === 'string') {
//             sql += ' AND created_at >= ?';
//             params.push(dateCreatedFrom);
//         }
//         if (dateCreatedTo && typeof dateCreatedTo === 'string') {
//             sql += ' AND created_at <= ?';
//             params.push(dateCreatedTo);
//         }

//         // Filter by close_date range
//         if (closeDateFrom && typeof closeDateFrom === 'string') {
//             sql += ' AND close_date >= ?';
//             params.push(closeDateFrom);
//         }
//         if (closeDateTo && typeof closeDateTo === 'string') {
//             sql += ' AND close_date <= ?';
//             params.push(closeDateTo);
//         }

//         // Pagination
//         const pageNum = parseInt(page as string, 10) || 1;
//         const pageSize = parseInt(limit as string, 10) || 10;
//         const offset = (pageNum - 1) * pageSize;

//         sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
//         params.push(pageSize, offset);

//         // Execute query
//         const [rows] = await pool.query(sql, params);

//         const deals = rows as Deal[];

//         res.json({
//             page: pageNum,
//             limit: pageSize,
//             data: deals,
//         });
//     } catch (error) {
//         console.error('Error fetching deals:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
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
