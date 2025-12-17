import express from 'express';
import { isAuth } from '../middlewares/index.js';
import { validate } from '../middlewares/index.js';
import {
	importJob,
	createManualJob,
	getJobs,
	getJobById,
	updateJob,
	deleteJob,
} from '../controllers/index.js';
import {
	importJobSchema,
	createManualJobSchema,
	getJobsSchema,
	jobIdSchema,
	updateJobSchema,
} from '../validations/index.js';

const router = express.Router();

// All routes are protected
router.use(isAuth);

/**
 * @swagger
 * /job/import:
 *   post:
 *     summary: Import job from URL (LinkedIn, Indeed, Glassdoor)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobUrl
 *             properties:
 *               jobUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://www.linkedin.com/jobs/view/123456789
 *     responses:
 *       201:
 *         description: Job imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid URL or unsupported platform
 *       401:
 *         description: Unauthorized
 */
router.post('/import', validate(importJobSchema), importJob);

/**
 * @swagger
 * /job/manual:
 *   post:
 *     summary: Create a job manually
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_name
 *               - job_title
 *             properties:
 *               company_name:
 *                 type: string
 *                 example: Tech Corp
 *               job_title:
 *                 type: string
 *                 example: Senior Software Engineer
 *               job_url:
 *                 type: string
 *                 format: uri
 *               location:
 *                 type: string
 *                 example: San Francisco, CA
 *               job_type:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship]
 *               experience_level:
 *                 type: string
 *               salary_range:
 *                 type: string
 *                 example: $120k - $180k
 *               description:
 *                 type: string
 *               requirements:
 *                 type: object
 *               posted_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/manual', validate(createManualJobSchema), createManualJob);

/**
 * @swagger
 * /job/list:
 *   get:
 *     summary: Get all jobs for the authenticated user
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by company name or job title
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [linkedin, indeed, glassdoor, manual]
 *         description: Filter by job source
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
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
 *                     jobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Job'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/list', validate(getJobsSchema), getJobs);

/**
 * @swagger
 * /job/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_name:
 *                 type: string
 *               job_title:
 *                 type: string
 *               location:
 *                 type: string
 *               job_type:
 *                 type: string
 *               salary_range:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', validate(jobIdSchema), getJobById);
router.put('/:id', validate(updateJobSchema), updateJob);
router.delete('/:id', validate(jobIdSchema), deleteJob);

export default router;

