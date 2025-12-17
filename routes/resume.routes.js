import express from 'express';
import multer from 'multer';
import { isAuth } from '../middlewares/index.js';
import { validate } from '../middlewares/index.js';
import {
	uploadResume,
	getResumes,
	getResumeById,
	deleteResume,
	setMasterResume,
	getResumeProfile,
	updateResumeProfile,
} from '../controllers/index.js';
import {
	resumeIdSchema,
	updateProfileSchema,
} from '../validations/index.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB max file size
	},
	fileFilter: (req, file, cb) => {
		const allowedMimes = [
			'application/pdf',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/msword',
		];
		if (allowedMimes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
		}
	},
});

// All routes are protected
router.use(isAuth);

/**
 * @swagger
 * /resume/upload:
 *   post:
 *     summary: Upload and parse resume
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume file (PDF or DOCX, max 5MB)
 *     responses:
 *       201:
 *         description: Resume uploaded and parsed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Resume'
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Unauthorized
 */
router.post('/upload', upload.single('resume'), uploadResume);

/**
 * @swagger
 * /resume/list:
 *   get:
 *     summary: Get all resumes for the user
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumes retrieved successfully
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
 *                     $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Unauthorized
 */
router.get('/list', getResumes);

/**
 * @swagger
 * /resume/{id}:
 *   get:
 *     summary: Get resume by ID
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Resume retrieved successfully
 *       404:
 *         description: Resume not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete resume
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Resume deleted successfully
 *       404:
 *         description: Resume not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', validate(resumeIdSchema), getResumeById);
router.delete('/:id', validate(resumeIdSchema), deleteResume);

/**
 * @swagger
 * /resume/{id}/set-master:
 *   put:
 *     summary: Set resume as master/default
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Master resume set successfully
 *       404:
 *         description: Resume not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id/set-master', validate(resumeIdSchema), setMasterResume);

/**
 * @swagger
 * /resume/profile/me:
 *   get:
 *     summary: Get resume profile
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update resume profile
 *     tags: [Resume]
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
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile/me', getResumeProfile);
router.put('/profile/me', validate(updateProfileSchema), updateResumeProfile);

export default router;
