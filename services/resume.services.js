import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { uploadToS3, getS3SignedUrl, deleteFromS3 } from '../utils/aws.utils.js';
import { parseResumeFile, validateResumeCompleteness } from '../utils/parser.utils.js';
import { AppError } from '../errors/index.js';

const prisma = new PrismaClient();

export class ResumeService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
		this.user = req.user;
	}

	/**
	 * Upload and parse resume
	 */
	async uploadResume() {
		const userId = this.user.id;

		if (!this.req.file) {
			throw new AppError('Please upload a resume file', HttpStatus.BAD_REQUEST);
		}

		const fileBuffer = this.req.file.buffer;
		const fileName = this.req.file.originalname;
		const mimeType = this.req.file.mimetype;

		// Validate file type
		if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(mimeType)) {
			throw new AppError('Only PDF and DOCX files are supported', HttpStatus.BAD_REQUEST);
		}

		// Parse resume file
		const parseResult = await parseResumeFile(fileBuffer, mimeType);

		// Upload to S3
		const s3Result = await uploadToS3(fileBuffer, fileName, mimeType, 'resumes');

		// Validate completeness
		const validation = validateResumeCompleteness(parseResult.parsedData);

		// Create resume record
		const resume = await prisma.resumes.create({
			data: {
				user_id: userId,
				name: fileName,
				file_path: s3Result.key,
				file_url: s3Result.location,
				parsed_data: parseResult.parsedData,
				version: 1,
				is_master: true,
				is_active: true,
			},
		});

		// Create or update user profile
		await this.createOrUpdateProfile(
			userId,
			parseResult.parsedData,
			validation.completeness,
		);

		// Track AI usage in analytics
		await prisma.analytics.create({
			data: {
				user_id: userId,
				metric_type: 'ai_generation',
				metric_value: parseResult.tokensUsed || 0,
				metadata: {
					type: 'resume_parsing',
					model: parseResult.model,
					status: 'success',
				},
			},
		});

		// Update onboarding step if user is in onboarding process
		const user = await prisma.users.findUnique({
			where: { id: userId },
			select: { onboarding_completed: true, onboarding_step: true },
		});

		if (!user.onboarding_completed && user.onboarding_step === 1) {
			await prisma.users.update({
				where: { id: userId },
				data: {
					onboarding_step: 2,
					onboarding_data: {
						step1_completed: true,
						step2_completed: true,
						step2_completed_at: new Date(),
						resume_id: resume.id,
					},
				},
			});
		}

		return {
			resume,
			validation,
			parsedData: parseResult.parsedData,
		};
	}

	/**
	 * Create or update user profile from parsed resume
	 */
	async createOrUpdateProfile(userId, parsedData, completeness) {
		const profileData = {
			summary: parsedData.summary || null,
			skills: parsedData.skills || [],
			completeness,
		};

		// Upsert user profile
		const profile = await prisma.user_profiles.upsert({
			where: { user_id: userId },
			update: profileData,
			create: {
				user_id: userId,
				...profileData,
			},
		});

		// Create experiences
		if (parsedData.experience && Array.isArray(parsedData.experience)) {
			await prisma.experiences.deleteMany({
				where: { profile_id: profile.id },
			});

			for (const exp of parsedData.experience) {
				await prisma.experiences.create({
					data: {
						profile_id: profile.id,
						company: exp.company || 'Unknown',
						title: exp.title || 'Position',
						location: exp.location || null,
						start_date: exp.startDate ? new Date(exp.startDate) : new Date(),
						end_date: exp.endDate && exp.endDate !== 'Present' ? new Date(exp.endDate) : null,
						is_current: exp.endDate === 'Present',
						description: exp.description || '',
					},
				});
			}
		}

		// Create education
		if (parsedData.education && Array.isArray(parsedData.education)) {
			await prisma.educations.deleteMany({
				where: { profile_id: profile.id },
			});

			for (const edu of parsedData.education) {
				await prisma.educations.create({
					data: {
						profile_id: profile.id,
						institution: edu.institution || 'Unknown',
						degree: edu.degree || 'Degree',
						field: edu.field || null,
						start_date: edu.startDate ? new Date(edu.startDate) : new Date(),
						end_date: edu.endDate && edu.endDate !== 'Present' ? new Date(edu.endDate) : null,
						is_current: edu.endDate === 'Present',
						description: edu.description || null,
					},
				});
			}
		}

		return profile;
	}

	/**
	 * Get user's resumes
	 */
	async getUserResumes() {
		const userId = this.user.id;

		const resumes = await prisma.resumes.findMany({
			where: {
				user_id: userId,
				is_active: true,
			},
			orderBy: {
				created_at: 'desc',
			},
		});

		return resumes;
	}

	/**
	 * Get resume by ID with signed URL
	 */
	async getResumeById() {
		const { id } = this.req.params;
		const userId = this.user.id;

		const resume = await prisma.resumes.findFirst({
			where: {
				id: parseInt(id, 10),
				user_id: userId,
			},
		});

		if (!resume) {
			throw new AppError('Resume not found', HttpStatus.NOT_FOUND);
		}

		// Generate signed URL if file is in S3
		if (resume.file_path) {
			const signedUrl = await getS3SignedUrl(resume.file_path);
			resume.signed_url = signedUrl;
		}

		return resume;
	}

	/**
	 * Get user profile with experiences and education
	 */
	async getUserProfile() {
		const userId = this.user.id;

		const profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
			include: {
				experiences: {
					orderBy: { start_date: 'desc' },
				},
				educations: {
					orderBy: { start_date: 'desc' },
				},
			},
		});

		if (!profile) {
			// Create empty profile
			return await prisma.user_profiles.create({
				data: {
					user_id: userId,
					completeness: 0,
				},
				include: {
					experiences: true,
					educations: true,
				},
			});
		}

		return profile;
	}

	/**
	 * Update user profile
	 */
	async updateUserProfile() {
		const userId = this.user.id;
		const profileData = this.body;

		const profile = await prisma.user_profiles.upsert({
			where: { user_id: userId },
			update: profileData,
			create: {
				user_id: userId,
				...profileData,
			},
		});

		// Recalculate completeness
		const user = await prisma.users.findUnique({
			where: { id: userId },
		});

		const mockResumeData = {
			name: user.name,
			email: user.email,
			phone: user.number,
			summary: profile.summary,
			skills: profile.skills,
			experience: [],
			education: [],
		};

		const validation = validateResumeCompleteness(mockResumeData);

		await prisma.user_profiles.update({
			where: { user_id: userId },
			data: { completeness: validation.completeness },
		});

		return profile;
	}

	/**
	 * Delete resume
	 */
	async deleteResume() {
		const { id } = this.req.params;
		const userId = this.user.id;

		const resume = await prisma.resumes.findFirst({
			where: {
				id: parseInt(id, 10),
				user_id: userId,
			},
		});

		if (!resume) {
			throw new AppError('Resume not found', HttpStatus.NOT_FOUND);
		}

		// Delete from S3
		if (resume.file_path) {
			await deleteFromS3(resume.file_path);
		}

		// Soft delete resume
		await prisma.resumes.update({
			where: { id: parseInt(id, 10) },
			data: { is_active: false },
		});

		return true;
	}

	/**
	 * Set master resume
	 */
	async setMasterResume() {
		const { id } = this.req.params;
		const userId = this.user.id;

		// Unset all master resumes
		await prisma.resumes.updateMany({
			where: { user_id: userId },
			data: { is_master: false },
		});

		// Set new master
		const resume = await prisma.resumes.update({
			where: {
				id: parseInt(id, 10),
			},
			data: { is_master: true },
		});

		return resume;
	}
}

