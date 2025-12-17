import express from 'express';
import { isAuth } from '../middlewares/index.js';
import { validate } from '../middlewares/index.js';
import {
	getCompleteProfile,
	updateProfile,
	createExperience,
	getExperiences,
	getExperience,
	updateExperience,
	deleteExperience,
	createEducation,
	getEducations,
	getEducation,
	updateEducation,
	deleteEducation,
} from '../controllers/index.js';
import {
	updateProfileSchema,
	experienceSchema,
	experienceIdSchema,
	educationSchema,
	educationIdSchema,
} from '../validations/index.js';

const router = express.Router();

// All routes are protected
router.use(isAuth);

/**
 * @swagger
 * /profile/complete:
 *   get:
 *     summary: Get complete user profile with experiences and education
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complete profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 */
router.get('/complete', getCompleteProfile);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               professional_summary:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               linkedin_url:
 *                 type: string
 *               github_url:
 *                 type: string
 *               portfolio_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/', validate(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /profile/experience:
 *   post:
 *     summary: Add work experience
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company
 *               - job_title
 *               - start_date
 *             properties:
 *               company:
 *                 type: string
 *               job_title:
 *                 type: string
 *               location:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               is_current:
 *                 type: boolean
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Experience added successfully
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all work experiences
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Experiences retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/experience', validate(experienceSchema), createExperience);
router.get('/experience', getExperiences);

/**
 * @swagger
 * /profile/experience/{id}:
 *   get:
 *     summary: Get experience by ID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Experience retrieved successfully
 *       404:
 *         description: Experience not found
 *   put:
 *     summary: Update experience
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               job_title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Experience updated successfully
 *       404:
 *         description: Experience not found
 *   delete:
 *     summary: Delete experience
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Experience deleted successfully
 *       404:
 *         description: Experience not found
 */
router.get('/experience/:id', validate(experienceIdSchema), getExperience);
router.put('/experience/:id', validate(experienceSchema), validate(experienceIdSchema), updateExperience);
router.delete('/experience/:id', validate(experienceIdSchema), deleteExperience);

/**
 * @swagger
 * /profile/education:
 *   post:
 *     summary: Add education
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - institution
 *               - degree
 *               - field_of_study
 *             properties:
 *               institution:
 *                 type: string
 *               degree:
 *                 type: string
 *               field_of_study:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               grade:
 *                 type: string
 *     responses:
 *       201:
 *         description: Education added successfully
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all education records
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Education records retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/education', validate(educationSchema), createEducation);
router.get('/education', getEducations);

/**
 * @swagger
 * /profile/education/{id}:
 *   get:
 *     summary: Get education by ID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Education retrieved successfully
 *       404:
 *         description: Education not found
 *   put:
 *     summary: Update education
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               institution:
 *                 type: string
 *               degree:
 *                 type: string
 *               field_of_study:
 *                 type: string
 *     responses:
 *       200:
 *         description: Education updated successfully
 *       404:
 *         description: Education not found
 *   delete:
 *     summary: Delete education
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Education deleted successfully
 *       404:
 *         description: Education not found
 */
router.get('/education/:id', validate(educationIdSchema), getEducation);
router.put('/education/:id', validate(educationSchema), validate(educationIdSchema), updateEducation);
router.delete('/education/:id', validate(educationIdSchema), deleteEducation);

export default router;
