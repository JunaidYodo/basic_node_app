import express from 'express';
import { isAuth } from '../middlewares/index.js';
import { validate } from '../middlewares/index.js';
import {
	generateContent,
	createApplication,
	submitApplication,
	getApplications,
	getApplicationById,
	updateStatus,
	deleteApplication,
	getStatistics,
	atsAutoApply,
} from '../controllers/index.js';
import {
	generateContentSchema,
	createApplicationSchema,
	applicationIdSchema,
	updateStatusSchema,
	getApplicationsSchema,
} from '../validations/index.js';

const router = express.Router();

// All routes are protected
router.use(isAuth);

/**
 * @swagger
 * /application/generate:
 *   post:
 *     summary: Generate resume and cover letter using AI
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Content generated successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/generate', validate(generateContentSchema), generateContent);

/**
 * @swagger
 * /application/create:
 *   post:
 *     summary: Create a new application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: integer
 *               resumeVersionId:
 *                 type: integer
 *               coverLetter:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/create', validate(createApplicationSchema), createApplication);

/**
 * @swagger
 * /application/{id}/submit:
 *   post:
 *     summary: Submit an application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *       404:
 *         description: Application not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/submit', validate(applicationIdSchema), submitApplication);

/**
 * @swagger
 * /application/{id}/ats-apply:
 *   post:
 *     summary: Auto-apply to job using ATS integration
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application submitted via ATS successfully
 *       400:
 *         description: ATS submission failed
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/ats-apply', validate(applicationIdSchema), atsAutoApply);

/**
 * @swagger
 * /application/list:
 *   get:
 *     summary: Get all applications for the user
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, submitted, viewed, interview, offer, rejected]
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 */
router.get('/list', validate(getApplicationsSchema), getApplications);

/**
 * @swagger
 * /application/statistics:
 *   get:
 *     summary: Get application statistics
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/statistics', getStatistics);

/**
 * @swagger
 * /application/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 *       404:
 *         description: Application not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', validate(applicationIdSchema), getApplicationById);

/**
 * @swagger
 * /application/{id}/status:
 *   put:
 *     summary: Update application status
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, submitted, viewed, interview, offer, rejected]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Application not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id/status', validate(updateStatusSchema), updateStatus);

/**
 * @swagger
 * /application/{id}:
 *   delete:
 *     summary: Delete application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       404:
 *         description: Application not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', validate(applicationIdSchema), deleteApplication);

export default router;
