import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';
import { AppError } from '../errors/index.js';

const prisma = new PrismaClient();

export class OnboardingService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
		this.user = req.user;
	}

	/**
	 * Get onboarding status
	 */
	async getOnboardingStatus() {
		const userId = this.user.id;

		const user = await prisma.users.findUnique({
			where: { id: userId },
			select: {
				onboarding_completed: true,
				onboarding_step: true,
				onboarding_data: true,
				user_profiles: {
					select: {
						completeness: true,
						preferred_roles: true,
						preferred_locations: true,
						work_mode: true,
					},
				},
				resumes: {
					where: { is_active: true },
					select: {
						id: true,
						name: true,
						created_at: true,
					},
					orderBy: { created_at: 'desc' },
					take: 1,
				},
			},
		});

		if (!user) {
			throw new AppError('User not found', HttpStatus.NOT_FOUND);
		}

		return {
			completed: user.onboarding_completed,
			current_step: user.onboarding_step,
			steps: {
				step1_preferences: user.onboarding_step >= 1,
				step2_resume: user.onboarding_step >= 2,
				step3_profile: user.onboarding_step >= 3,
			},
			profile: user.user_profiles,
			resume: user.resumes[0] || null,
			data: user.onboarding_data || {},
		};
	}

	/**
	 * Step 1: Set Preferences
	 */
	async setPreferences() {
		const userId = this.user.id;
		const {
			preferred_roles,
			preferred_locations,
			work_mode,
			salary_min,
			salary_max,
			currency,
		} = this.body;

		// Create or update user profile with preferences
		const profile = await prisma.user_profiles.upsert({
			where: { user_id: userId },
			update: {
				preferred_roles,
				preferred_locations,
				work_mode,
				salary_min,
				salary_max,
				currency: currency || 'USD',
			},
			create: {
				user_id: userId,
				preferred_roles,
				preferred_locations,
				work_mode,
				salary_min,
				salary_max,
				currency: currency || 'USD',
				completeness: 20, // 20% after preferences
			},
		});

		// Update user onboarding step
		await prisma.users.update({
			where: { id: userId },
			data: {
				onboarding_step: 1,
				onboarding_data: {
					step1_completed: true,
					step1_completed_at: new Date(),
				},
			},
		});

		return {
			message: 'Preferences saved successfully',
			profile,
			next_step: 2,
			next_step_name: 'Upload Resume',
		};
	}

	/**
	 * Step 2: Upload Resume (handled by resume controller)
	 * This method just marks step 2 as complete
	 */
	async markResumeUploaded(resumeId) {
		const userId = this.user.id;

		await prisma.users.update({
			where: { id: userId },
			data: {
				onboarding_step: 2,
				onboarding_data: {
					step1_completed: true,
					step2_completed: true,
					step2_completed_at: new Date(),
					resume_id: resumeId,
				},
			},
		});

		return {
			message: 'Resume uploaded successfully',
			next_step: 3,
			next_step_name: 'Review & Confirm Profile',
		};
	}

	/**
	 * Step 3: Review and Confirm Profile
	 */
	async confirmProfile() {
		const userId = this.user.id;
		const { headline, summary, linkedin_url, github_url, portfolio_url } = this.body;

		// Update profile with additional details
		const profile = await prisma.user_profiles.update({
			where: { user_id: userId },
			data: {
				headline,
				summary,
				linkedin_url,
				github_url,
				portfolio_url,
				completeness: 100, // 100% onboarding complete
			},
		});

		// Mark onboarding as completed
		await prisma.users.update({
			where: { id: userId },
			data: {
				onboarding_completed: true,
				onboarding_step: 3,
				onboarding_data: {
					step1_completed: true,
					step2_completed: true,
					step3_completed: true,
					step3_completed_at: new Date(),
					completed_at: new Date(),
				},
			},
		});

		return {
			message: 'Onboarding completed successfully! Welcome to NextHire!',
			profile,
			onboarding_completed: true,
		};
	}

	/**
	 * Skip onboarding (user can complete later)
	 */
	async skipOnboarding() {
		const userId = this.user.id;

		await prisma.users.update({
			where: { id: userId },
			data: {
				onboarding_completed: true,
				onboarding_step: 0,
				onboarding_data: {
					skipped: true,
					skipped_at: new Date(),
				},
			},
		});

		return {
			message: 'Onboarding skipped. You can complete it later from your profile.',
			onboarding_completed: true,
			skipped: true,
		};
	}

	/**
	 * Restart onboarding
	 */
	async restartOnboarding() {
		const userId = this.user.id;

		await prisma.users.update({
			where: { id: userId },
			data: {
				onboarding_completed: false,
				onboarding_step: 0,
				onboarding_data: null,
			},
		});

		return {
			message: 'Onboarding restarted. You can begin from step 1.',
			onboarding_completed: false,
			current_step: 0,
		};
	}
}

