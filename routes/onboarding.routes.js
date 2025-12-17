import express from 'express';
import { isAuth } from '../middlewares/index.js';
import { validate } from '../middlewares/index.js';
import {
	getStatus,
	step1SetPreferences,
	step2MarkResumeUploaded,
	step3ConfirmProfile,
	skipOnboarding,
	restartOnboarding,
} from '../controllers/index.js';
import {
	setPreferencesSchema,
	confirmProfileSchema,
	skipOnboardingSchema,
} from '../validations/index.js';

const router = express.Router();

// All routes are protected
router.use(isAuth);

/**
 * @swagger
 * /onboarding/status:
 *   get:
 *     summary: Get onboarding status
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Onboarding status retrieved successfully
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
 *                     completed:
 *                       type: boolean
 *                     currentStep:
 *                       type: integer
 *                     steps:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/status', getStatus);

/**
 * @swagger
 * /onboarding/step1:
 *   post:
 *     summary: Set user preferences (Step 1)
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobPreferences:
 *                 type: object
 *                 properties:
 *                   jobTypes:
 *                     type: array
 *                     items:
 *                       type: string
 *                   locations:
 *                     type: array
 *                     items:
 *                       type: string
 *                   remotePreference:
 *                     type: string
 *                     enum: [remote, hybrid, onsite, any]
 *     responses:
 *       200:
 *         description: Preferences set successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/step1', validate(setPreferencesSchema), step1SetPreferences);

/**
 * @swagger
 * /onboarding/step2:
 *   post:
 *     summary: Mark resume uploaded (Step 2)
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Step 2 marked as complete
 *       401:
 *         description: Unauthorized
 */
router.post('/step2', step2MarkResumeUploaded);

/**
 * @swagger
 * /onboarding/step3:
 *   post:
 *     summary: Confirm profile and complete onboarding (Step 3)
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirmed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Onboarding completed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/step3', validate(confirmProfileSchema), step3ConfirmProfile);

/**
 * @swagger
 * /onboarding/skip:
 *   post:
 *     summary: Skip onboarding process
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Onboarding skipped successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/skip', validate(skipOnboardingSchema), skipOnboarding);

/**
 * @swagger
 * /onboarding/restart:
 *   post:
 *     summary: Restart onboarding process
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Onboarding restarted successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/restart', restartOnboarding);

export default router;
