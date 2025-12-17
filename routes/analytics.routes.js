import express from 'express';
import { isAuth } from '../middlewares/index.js';
import { validate } from '../middlewares/index.js';
import {
	getDashboard,
	getDetailed,
	exportData,
} from '../controllers/index.js';
import {
	detailedAnalyticsSchema,
} from '../validations/index.js';

const router = express.Router();

// All routes are protected
router.use(isAuth);

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                     usage:
 *                       type: object
 *                     subscription:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', getDashboard);

/**
 * @swagger
 * /analytics/detailed:
 *   get:
 *     summary: Get detailed analytics for a date range
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Detailed analytics retrieved successfully
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Unauthorized
 */
router.get('/detailed', validate(detailedAnalyticsSchema), getDetailed);

/**
 * @swagger
 * /analytics/export:
 *   get:
 *     summary: Export user data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data exported successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/export', exportData);

export default router;
