import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { AppError } from '../errors/index.js';
import {
	generateResume,
	generateCoverLetter,
	calculateMatchScore,
} from '../utils/openai.utils.js';

const prisma = new PrismaClient();

export class ApplicationService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
		this.user = req.user;
	}

	/**
	 * Generate AI resume and cover letter for job
	 */
	async generateApplicationContent() {
		const { jobId } = this.body;
		const userId = this.user.id;

		if (!jobId) {
			throw new AppError('Job ID is required', HttpStatus.BAD_REQUEST);
		}

		// Check AI generation limit
		const user = await prisma.users.findUnique({
			where: { id: userId },
		});

		const limitCheck = checkUsageLimit(user, 'ai_generation');
		if (!limitCheck.canPerform) {
			throw new AppError(limitCheck.reason, HttpStatus.FORBIDDEN);
		}

		// Get user profile
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
			throw new AppError(
				'Please complete your profile first',
				HttpStatus.BAD_REQUEST,
			);
		}

		// Get job details
		const job = await prisma.jobs.findFirst({
			where: {
				id: parseInt(jobId, 10),
				user_id: userId,
			},
		});

		if (!job) {
			throw new AppError('Job not found', HttpStatus.NOT_FOUND);
		}

		// Prepare user profile data
		const userProfile = {
			name: user.name,
			email: user.email,
			headline: profile.headline,
			summary: profile.summary,
			skills: profile.skills,
			experiences: profile.experiences.map(exp => ({
				company: exp.company,
				title: exp.title,
				location: exp.location,
				startDate: exp.start_date,
				endDate: exp.end_date,
				isCurrent: exp.is_current,
				description: exp.description,
			})),
			educations: profile.educations.map(edu => ({
				institution: edu.institution,
				degree: edu.degree,
				field: edu.field,
				startDate: edu.start_date,
				endDate: edu.end_date,
			})),
		};

		// Prepare job description
		const jobDescription = {
			company: job.company_name,
			title: job.job_title,
			description: job.description,
			requirements: job.requirements,
		};

		// Generate resume
		const resumeResult = await generateResume(userProfile, jobDescription);

		// Generate cover letter
		const coverLetterResult = await generateCoverLetter(
			userProfile,
			jobDescription,
		);

		// Calculate match score
		const matchScore = await calculateMatchScore(
			resumeResult.resumeData,
			jobDescription,
		);

		// Track AI usage in analytics for resume generation
		await prisma.analytics.create({
			data: {
				user_id: userId,
				metric_type: 'ai_generation',
				metric_value: resumeResult.tokensUsed || 0,
				metadata: {
					type: 'resume_generation',
					model: resumeResult.model,
					jobId: parseInt(jobId, 10),
					matchScore: matchScore.score,
					status: 'success',
				},
			},
		});

		// Track AI usage in analytics for cover letter generation
		await prisma.analytics.create({
			data: {
				user_id: userId,
				metric_type: 'ai_generation',
				metric_value: coverLetterResult.tokensUsed || 0,
				metadata: {
					type: 'cover_letter_generation',
					model: coverLetterResult.model,
					jobId: parseInt(jobId, 10),
					status: 'success',
				},
			},
		});

		// Update AI generation usage
		await prisma.users.update({
			where: { id: userId },
			data: {
				ai_generations_used: {
					increment: 1,
				},
			},
		});

		// Update job match score
		await prisma.jobs.update({
			where: { id: parseInt(jobId, 10) },
			data: {
				ai_match_score: matchScore.score,
			},
		});

		return {
			resume: resumeResult.resumeData,
			coverLetter: coverLetterResult.coverLetter,
			matchScore,
			tokensUsed: resumeResult.tokensUsed + coverLetterResult.tokensUsed,
		};
	}

	/**
	 * Create application with generated content
	 */
	async createApplication() {
		const { jobId, coverLetter, resumeVersionId, submissionMethod, notes } =
			this.body;
		const userId = this.user.id;

		if (!jobId) {
			throw new AppError('Job ID is required', HttpStatus.BAD_REQUEST);
		}

		// Check application limit
		const user = await prisma.users.findUnique({
			where: { id: userId },
		});

		const limitCheck = checkUsageLimit(user, 'application');
		if (!limitCheck.canPerform) {
			throw new AppError(limitCheck.reason, HttpStatus.FORBIDDEN);
		}

		// Create application
		const application = await prisma.applications.create({
			data: {
				user_id: userId,
				job_id: parseInt(jobId, 10),
				resume_version_id: resumeVersionId || null,
				cover_letter: coverLetter,
				status: 'draft',
				submission_method: submissionMethod || 'manual',
				notes: notes || null,
			},
			include: {
				job: true,
			},
		});

		// Create initial event
		await prisma.application_events.create({
			data: {
				application_id: application.id,
				event_type: 'created',
				event_data: {
					status: application.status,
				},
			},
		});

		return application;
	}

	/**
	 * Submit application
	 */
	async submitApplication() {
		const { id } = this.req.params;
		const userId = this.user.id;

		const application = await prisma.applications.findFirst({
			where: {
				id: parseInt(id, 10),
				user_id: userId,
			},
		});

		if (!application) {
			throw new AppError('Application not found', HttpStatus.NOT_FOUND);
		}

		if (application.status !== 'draft') {
			throw new AppError(
				'Application has already been submitted',
				HttpStatus.BAD_REQUEST,
			);
		}

		// Update application
		const updatedApplication = await prisma.applications.update({
			where: { id: parseInt(id, 10) },
			data: {
				status: 'submitted',
				applied_at: new Date(),
			},
			include: {
				job: true,
			},
		});

		// Create event
		await prisma.application_events.create({
			data: {
				application_id: parseInt(id, 10),
				event_type: 'submitted',
				event_data: {
					submittedAt: new Date(),
				},
			},
		});

		// Update application usage
		await prisma.users.update({
			where: { id: userId },
			data: {
				applications_used: {
					increment: 1,
				},
			},
		});

		// Create analytics record
		await prisma.analytics.create({
			data: {
				user_id: userId,
				metric_type: 'application_submitted',
				metric_value: 1,
				metadata: {
					applicationId: parseInt(id, 10),
					jobId: application.job_id,
				},
			},
		});

		return updatedApplication;
	}

	/**
	 * Get user's applications
	 */
	async getUserApplications() {
		const userId = this.user.id;
		const { status, jobId } = this.req.query;

		const where = {
			user_id: userId,
		};

		if (status) where.status = status;
		if (jobId) where.job_id = parseInt(jobId, 10);

		const applications = await prisma.applications.findMany({
			where,
			orderBy: {
				created_at: 'desc',
			},
			include: {
				job: {
					select: {
						id: true,
						company_name: true,
						job_title: true,
						location: true,
						source: true,
					},
				},
				application_events: {
					orderBy: {
						created_at: 'desc',
					},
					take: 5,
				},
			},
		});

		return applications;
	}

	/**
	 * Get application by ID
	 */
	async getApplicationById() {
		const { id } = this.req.params;
		const userId = this.user.id;

		const application = await prisma.applications.findFirst({
			where: {
				id: parseInt(id, 10),
				user_id: userId,
			},
			include: {
				job: true,
				application_events: {
					orderBy: {
						created_at: 'asc',
					},
				},
			},
		});

		if (!application) {
			throw new AppError('Application not found', HttpStatus.NOT_FOUND);
		}

		return application;
	}

	/**
	 * Update application status
	 */
	async updateApplicationStatus() {
		const { id } = this.req.params;
		const { status, eventData } = this.body;
		const userId = this.user.id;

		if (!status) {
			throw new AppError('Status is required', HttpStatus.BAD_REQUEST);
		}

		const validStatuses = [
			'draft',
			'submitted',
			'viewed',
			'interview',
			'offer',
			'rejected',
		];
		if (!validStatuses.includes(status)) {
			throw new AppError('Invalid status', HttpStatus.BAD_REQUEST);
		}

		const application = await prisma.applications.findFirst({
			where: {
				id: parseInt(id, 10),
				user_id: userId,
			},
		});

		if (!application) {
			throw new AppError('Application not found', HttpStatus.NOT_FOUND);
		}

		const updateData = { status };

		if (status === 'interview') {
			updateData.interview_date = eventData?.interviewDate
				? new Date(eventData.interviewDate)
				: new Date();
		} else if (status === 'offer') {
			updateData.offer_date = new Date();
		} else if (status === 'rejected') {
			updateData.rejection_date = new Date();
		}

		const updatedApplication = await prisma.applications.update({
			where: { id: parseInt(id, 10) },
			data: updateData,
			include: {
				job: true,
			},
		});

		// Create event
		await prisma.application_events.create({
			data: {
				application_id: parseInt(id, 10),
				event_type: status,
				event_data: eventData || {},
			},
		});

		// Create analytics record
		let metricType = 'application_status_changed';
		if (status === 'interview') {
			metricType = 'interview_scheduled';
		} else if (status === 'offer') {
			metricType = 'offer_received';
		}

		await prisma.analytics.create({
			data: {
				user_id: userId,
				metric_type: metricType,
				metric_value: 1,
				metadata: {
					applicationId: parseInt(id, 10),
					jobId: application.job_id,
					previousStatus: application.status,
					newStatus: status,
				},
			},
		});

		return updatedApplication;
	}

	/**
	 * Delete application
	 */
	async deleteApplication() {
		const { id } = this.req.params;
		const userId = this.user.id;

		const result = await prisma.applications.deleteMany({
			where: {
				id: parseInt(id, 10),
				user_id: userId,
			},
		});

		if (result.count === 0) {
			throw new AppError('Application not found', HttpStatus.NOT_FOUND);
		}

		return true;
	}

	/**
	 * Get application statistics
	 */
	async getApplicationStatistics() {
		const userId = this.user.id;

		const total = await prisma.applications.count({
			where: { user_id: userId },
		});

		const submitted = await prisma.applications.count({
			where: { user_id: userId, status: 'submitted' },
		});

		const interviews = await prisma.applications.count({
			where: { user_id: userId, status: 'interview' },
		});

		const offers = await prisma.applications.count({
			where: { user_id: userId, status: 'offer' },
		});

		const rejected = await prisma.applications.count({
			where: { user_id: userId, status: 'rejected' },
		});

		const conversionRate =
			submitted > 0 ? ((interviews / submitted) * 100).toFixed(2) : 0;
		const offerRate =
			submitted > 0 ? ((offers / submitted) * 100).toFixed(2) : 0;

		return {
			total,
			submitted,
			interviews,
			offers,
			rejected,
			conversionRate: parseFloat(conversionRate),
			offerRate: parseFloat(offerRate),
		};
	}

	/**
	 * 1-Click ATS Auto-Apply
	 * Submit application directly via ATS API
	 */
	async atsAutoApply() {
		const { id } = this.req.params;
		const userId = this.user.id;

		// Get application with job details
		const application = await prisma.applications.findFirst({
			where: {
				id: parseInt(id, 10),
				user_id: userId,
			},
			include: {
				job: true,
				user: {
					select: {
						name: true,
						email: true,
						number: true,
					},
				},
			},
		});

		if (!application) {
			throw new AppError('Application not found', HttpStatus.NOT_FOUND);
		}

		if (application.status !== 'draft') {
			throw new AppError(
				'Application has already been submitted',
				HttpStatus.BAD_REQUEST,
			);
		}

		const { job } = application;

		// Check if job has external source (ATS)
		if (!job.source || job.source === 'manual') {
			throw new AppError(
				'This job does not support ATS auto-apply. Please apply manually.',
				HttpStatus.BAD_REQUEST,
			);
		}

		// Check if user has enough applications left
		const user = await prisma.users.findUnique({
			where: { id: userId },
			select: {
				applications_used: true,
				applications_limit: true,
			},
		});

		if (
			user.applications_limit !== -1 &&
			user.applications_used >= user.applications_limit
		) {
			throw new AppError(
				'Application limit reached. Please upgrade your plan.',
				HttpStatus.FORBIDDEN,
			);
		}

		// Import ATS adapter
		const { ATSAdapter, parseJobIdFromUrl } = await import(
			'../utils/ats.utils.js'
		);
		const atsAdapter = new ATSAdapter();

		// Parse job ID from URL
		const jobId = parseJobIdFromUrl(job.source_url, job.source);
		if (!jobId) {
			throw new AppError(
				'Could not parse job ID from URL',
				HttpStatus.BAD_REQUEST,
			);
		}

		// Prepare application data
		const [firstName, ...lastNameParts] = application.user.name.split(' ');
		const lastName = lastNameParts.join(' ') || firstName;

		// Get user's resume
		const resume = await prisma.resumes.findFirst({
			where: {
				user_id: userId,
				is_master: true,
				is_active: true,
			},
			orderBy: { created_at: 'desc' },
		});

		const applicationData = {
			firstName,
			lastName,
			email: application.user.email,
			phone: application.user.number,
			resumeText: resume?.parsed_data
				? JSON.stringify(resume.parsed_data)
				: null,
			resumeFilename: resume?.name || 'resume.pdf',
			coverLetter: application.cover_letter,
			customFields: [],
		};

		// Create event for submission attempt
		await prisma.application_events.create({
			data: {
				application_id: parseInt(id, 10),
				event_type: 'ats_submit_attempt',
				event_data: {
					ats: job.source,
					jobId,
					timestamp: new Date(),
				},
			},
		});

		// Submit via ATS
		const result = await atsAdapter.submitApplication(
			job.source,
			jobId,
			applicationData,
		);

		if (result.success) {
			// Update application status
			const updatedApplication = await prisma.applications.update({
				where: { id: parseInt(id, 10) },
				data: {
					status: 'submitted',
					applied_at: new Date(),
					submission_method: 'api',
					external_application_id: result.candidateId || null,
				},
				include: {
					job: true,
				},
			});

			// Create success event
			await prisma.application_events.create({
				data: {
					application_id: parseInt(id, 10),
					event_type: 'submitted',
					event_data: {
						method: 'ats_auto_apply',
						ats: job.source,
						candidateId: result.candidateId,
						timestamp: new Date(),
					},
				},
			});

			// Update usage
			await prisma.users.update({
				where: { id: userId },
				data: {
					applications_used: {
						increment: 1,
					},
				},
			});

			// Create analytics
			await prisma.analytics.create({
				data: {
					user_id: userId,
					metric_type: 'ats_application_success',
					metric_value: 1,
					metadata: {
						applicationId: parseInt(id, 10),
						jobId: job.id,
						ats: job.source,
					},
				},
			});

			return {
				success: true,
				application: updatedApplication,
				message: `Application successfully submitted via ${job.source}!`,
				candidateId: result.candidateId,
			};
		}
		// Create failure event
		await prisma.application_events.create({
			data: {
				application_id: parseInt(id, 10),
				event_type: 'ats_submit_failed',
				event_data: {
					ats: job.source,
					error: result.error,
					requiresManual: result.requiresManual,
					timestamp: new Date(),
				},
			},
		});

		// If requires manual application, return special response
		if (result.requiresManual) {
			return {
				success: false,
				requiresManual: true,
				message: result.error || 'This job requires manual application',
				jobUrl: job.source_url,
			};
		}

		throw new AppError(
			`ATS submission failed: ${result.error}`,
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}
}
