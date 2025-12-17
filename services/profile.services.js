import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';
import { AppError } from '../errors/index.js';
import { validateResumeCompleteness } from '../utils/parser.utils.js';

const prisma = new PrismaClient();

export class ProfileService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
		this.user = req.user;
	}

	/**
	 * Get complete profile with experiences, educations, and completeness
	 */
	async getCompleteProfile() {
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
			// Create empty profile if doesn't exist
			const newProfile = await prisma.user_profiles.create({
				data: {
					user_id: userId,
					completeness: 0,
				},
				include: {
					experiences: true,
					educations: true,
				},
			});
			return newProfile;
		}

		// Calculate completeness
		const user = await prisma.users.findUnique({
			where: { id: userId },
			select: { name: true, email: true, number: true },
		});

		const mockResumeData = {
			name: user.name,
			email: user.email,
			phone: user.number,
			summary: profile.summary,
			skills: profile.skills,
			experience: profile.experiences,
			education: profile.educations,
		};

		const validation = validateResumeCompleteness(mockResumeData);

		return {
			...profile,
			completeness_details: validation,
		};
	}

	/**
	 * Update profile basic info
	 */
	async updateProfile() {
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
		await this.recalculateCompleteness(userId);

		return profile;
	}

	/**
	 * Recalculate profile completeness
	 */
	async recalculateCompleteness(userId) {
		const user = await prisma.users.findUnique({
			where: { id: userId },
			select: { name: true, email: true, number: true },
		});

		const profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
			include: {
				experiences: true,
				educations: true,
			},
		});

		if (!profile) return 0;

		const mockResumeData = {
			name: user.name,
			email: user.email,
			phone: user.number,
			summary: profile.summary,
			skills: profile.skills,
			experience: profile.experiences,
			education: profile.educations,
		};

		const validation = validateResumeCompleteness(mockResumeData);

		await prisma.user_profiles.update({
			where: { user_id: userId },
			data: { completeness: validation.completeness },
		});

		return validation.completeness;
	}

	// ==================== EXPERIENCE CRUD ====================

	/**
	 * Create new experience
	 */
	async createExperience() {
		const userId = this.user.id;
		const experienceData = this.body;

		// Get or create profile
		let profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
		});

		if (!profile) {
			profile = await prisma.user_profiles.create({
				data: {
					user_id: userId,
					completeness: 0,
				},
			});
		}

		const experience = await prisma.experiences.create({
			data: {
				profile_id: profile.id,
				...experienceData,
			},
		});

		// Recalculate completeness
		await this.recalculateCompleteness(userId);

		return experience;
	}

	/**
	 * Get all experiences
	 */
	async getExperiences() {
		const userId = this.user.id;

		const profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
			select: { id: true },
		});

		if (!profile) {
			return [];
		}

		const experiences = await prisma.experiences.findMany({
			where: { profile_id: profile.id },
			orderBy: { start_date: 'desc' },
		});

		return experiences;
	}

	/**
	 * Get single experience
	 */
	async getExperience() {
		const { id } = this.req.params;
		const userId = this.user.id;

		const profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
			select: { id: true },
		});

		if (!profile) {
			throw new AppError('Profile not found', HttpStatus.NOT_FOUND);
		}

		const experience = await prisma.experiences.findFirst({
			where: {
				id: parseInt(id, 10),
				profile_id: profile.id,
			},
		});

		if (!experience) {
			throw new AppError('Experience not found', HttpStatus.NOT_FOUND);
		}

		return experience;
	}

	/**
	 * Update experience
	 */
	async updateExperience() {
		const { id } = this.req.params;
		const userId = this.user.id;
		const experienceData = this.body;

		const profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
			select: { id: true },
		});

		if (!profile) {
			throw new AppError('Profile not found', HttpStatus.NOT_FOUND);
		}

		const experience = await prisma.experiences.updateMany({
			where: {
				id: parseInt(id, 10),
				profile_id: profile.id,
			},
			data: experienceData,
		});

		if (experience.count === 0) {
			throw new AppError('Experience not found', HttpStatus.NOT_FOUND);
		}

		// Recalculate completeness
		await this.recalculateCompleteness(userId);

		return await this.getExperience();
	}

	/**
	 * Delete experience
	 */
	async deleteExperience() {
		const { id } = this.req.params;
		const userId = this.user.id;

		const profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
			select: { id: true },
		});

		if (!profile) {
			throw new AppError('Profile not found', HttpStatus.NOT_FOUND);
		}

		const result = await prisma.experiences.deleteMany({
			where: {
				id: parseInt(id, 10),
				profile_id: profile.id,
			},
		});

		if (result.count === 0) {
			throw new AppError('Experience not found', HttpStatus.NOT_FOUND);
		}

		// Recalculate completeness
		await this.recalculateCompleteness(userId);

		return true;
	}

	// ==================== EDUCATION CRUD ====================

	/**
	 * Create new education
	 */
	async createEducation() {
		const userId = this.user.id;
		const educationData = this.body;

		// Get or create profile
		let profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
		});

		if (!profile) {
			profile = await prisma.user_profiles.create({
				data: {
					user_id: userId,
					completeness: 0,
				},
			});
		}

		const education = await prisma.educations.create({
			data: {
				profile_id: profile.id,
				...educationData,
			},
		});

		// Recalculate completeness
		await this.recalculateCompleteness(userId);

		return education;
	}

	/**
	 * Get all educations
	 */
	async getEducations() {
		const userId = this.user.id;

		const profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
			select: { id: true },
		});

		if (!profile) {
			return [];
		}

		const educations = await prisma.educations.findMany({
			where: { profile_id: profile.id },
			orderBy: { start_date: 'desc' },
		});

		return educations;
	}

	/**
	 * Get single education
	 */
	async getEducation() {
		const { id } = this.req.params;
		const userId = this.user.id;

		const profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
			select: { id: true },
		});

		if (!profile) {
			throw new AppError('Profile not found', HttpStatus.NOT_FOUND);
		}

		const education = await prisma.educations.findFirst({
			where: {
				id: parseInt(id, 10),
				profile_id: profile.id,
			},
		});

		if (!education) {
			throw new AppError('Education not found', HttpStatus.NOT_FOUND);
		}

		return education;
	}

	/**
	 * Update education
	 */
	async updateEducation() {
		const { id } = this.req.params;
		const userId = this.user.id;
		const educationData = this.body;

		const profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
			select: { id: true },
		});

		if (!profile) {
			throw new AppError('Profile not found', HttpStatus.NOT_FOUND);
		}

		const education = await prisma.educations.updateMany({
			where: {
				id: parseInt(id, 10),
				profile_id: profile.id,
			},
			data: educationData,
		});

		if (education.count === 0) {
			throw new AppError('Education not found', HttpStatus.NOT_FOUND);
		}

		// Recalculate completeness
		await this.recalculateCompleteness(userId);

		return await this.getEducation();
	}

	/**
	 * Delete education
	 */
	async deleteEducation() {
		const { id } = this.req.params;
		const userId = this.user.id;

		const profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
			select: { id: true },
		});

		if (!profile) {
			throw new AppError('Profile not found', HttpStatus.NOT_FOUND);
		}

		const result = await prisma.educations.deleteMany({
			where: {
				id: parseInt(id, 10),
				profile_id: profile.id,
			},
		});

		if (result.count === 0) {
			throw new AppError('Education not found', HttpStatus.NOT_FOUND);
		}

		// Recalculate completeness
		await this.recalculateCompleteness(userId);

		return true;
	}
}

