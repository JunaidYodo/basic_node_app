import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { AppError } from '../errors/index.js';

const prisma = new PrismaClient();

export class AnalyticsService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
		this.user = req.user;
	}

	/**
	 * Get dashboard analytics for user
	 */
	async getDashboardAnalytics() {
		const userId = this.user.id;

		// Get total counts
		const totalApplications = await prisma.applications.count({
			where: { user_id: userId },
		});

		const submittedApplications = await prisma.applications.count({
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

		// Calculate conversion rates
		const interviewRate =
			submittedApplications > 0
				? ((interviews / submittedApplications) * 100).toFixed(2)
				: 0;
		const offerRate =
			submittedApplications > 0
				? ((offers / submittedApplications) * 100).toFixed(2)
				: 0;

		// Get recent applications
		const recentApplications = await prisma.applications.findMany({
			where: { user_id: userId },
			orderBy: { created_at: 'desc' },
			take: 5,
			include: {
				job: {
					select: {
						company_name: true,
						job_title: true,
					},
				},
			},
		});

		// Get AI generation stats from analytics
		const aiGenerations = await prisma.analytics.count({
			where: {
				user_id: userId,
				metric_type: 'ai_generation',
			},
		});

		const totalTokensUsed = await prisma.analytics.aggregate({
			where: {
				user_id: userId,
				metric_type: 'ai_generation',
			},
			_sum: {
				metric_value: true,
			},
		});

		// Get subscription info
		const user = await prisma.users.findUnique({
			where: { id: userId },
			select: {
				subscription_plan: true,
				subscription_status: true,
				applications_used: true,
				applications_limit: true,
				ai_generations_used: true,
				ai_generations_limit: true,
			},
		});

		// Get application status breakdown
		const statusBreakdown = await prisma.applications.groupBy({
			by: ['status'],
			where: { user_id: userId },
			_count: {
				id: true,
			},
		});

		// Get applications by source
		const applicationsBySource = await prisma.applications.findMany({
			where: { user_id: userId },
			include: {
				job: {
					select: {
						source: true,
					},
				},
			},
		});

		const sourceBreakdown = applicationsBySource.reduce((acc, app) => {
			const source = app.job.source;
			acc[source] = (acc[source] || 0) + 1;
			return acc;
		}, {});

		// Get weekly trend (last 4 weeks)
		const fourWeeksAgo = new Date();
		fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

		const weeklyApplications = await prisma.applications.findMany({
			where: {
				user_id: userId,
				created_at: {
					gte: fourWeeksAgo,
				},
			},
			select: {
				created_at: true,
				status: true,
			},
		});

		// Group by week
		const weeklyTrend = weeklyApplications.reduce((acc, app) => {
			const week = Math.floor((new Date() - new Date(app.created_at)) / (7 * 24 * 60 * 60 * 1000));
			const weekLabel = `Week ${4 - week}`;
			if (!acc[weekLabel]) {
				acc[weekLabel] = { total: 0, submitted: 0, interviews: 0, offers: 0 };
			}
			acc[weekLabel].total += 1;
			if (app.status === 'submitted') acc[weekLabel].submitted += 1;
			if (app.status === 'interview') acc[weekLabel].interviews += 1;
			if (app.status === 'offer') acc[weekLabel].offers += 1;
			return acc;
		}, {});

		return {
			overview: {
				totalApplications,
				submittedApplications,
				interviews,
				offers,
				rejected,
				interviewRate: parseFloat(interviewRate),
				offerRate: parseFloat(offerRate),
			},
			usage: {
				applications: {
					used: user.applications_used,
					limit: user.applications_limit,
					percentage: user.applications_limit === -1 ? 0 : Math.round((user.applications_used / user.applications_limit) * 100),
				},
				aiGenerations: {
					used: user.ai_generations_used,
					limit: user.ai_generations_limit,
					percentage: user.ai_generations_limit === -1 ? 0 : Math.round((user.ai_generations_used / user.ai_generations_limit) * 100),
					totalTokens: totalTokensUsed._sum.metric_value || 0,
				},
			},
			subscription: {
				plan: user.subscription_plan,
				status: user.subscription_status,
			},
			recentApplications: recentApplications.map(app => ({
				id: app.id,
				company: app.job.company_name,
				title: app.job.job_title,
				status: app.status,
				appliedAt: app.applied_at,
				createdAt: app.created_at,
			})),
			statusBreakdown: statusBreakdown.map(item => ({
				status: item.status,
				count: item._count.id,
			})),
			sourceBreakdown,
			weeklyTrend,
			aiStats: {
				totalGenerations: aiGenerations,
				tokensUsed: totalTokensUsed._sum.metric_value || 0,
			},
		};
	}

	/**
	 * Get detailed analytics for a date range
	 */
	async getDetailedAnalytics() {
		const userId = this.user.id;
		const { startDate, endDate } = this.req.query;

		if (!startDate || !endDate) {
			throw new AppError('Start date and end date are required', HttpStatus.BAD_REQUEST);
		}

		const start = new Date(startDate);
		const end = new Date(endDate);

		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			throw new AppError('Invalid date format', HttpStatus.BAD_REQUEST);
		}

		const applications = await prisma.applications.findMany({
			where: {
				user_id: userId,
				created_at: {
					gte: start,
					lte: end,
				},
			},
			include: {
				job: {
					select: {
						company_name: true,
						job_title: true,
						source: true,
						ai_match_score: true,
					},
				},
				application_events: true,
			},
		});

		// Calculate average response time
		const responseTimes = applications
			.filter(app => app.response_received_at)
			.map(app => {
				const applied = new Date(app.applied_at);
				const response = new Date(app.response_received_at);
				return (response - applied) / (1000 * 60 * 60 * 24); // Days
			});

		const avgResponseTime = responseTimes.length > 0
			? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
			: 0;

		// Calculate time to interview
		const interviewTimes = applications
			.filter(app => app.interview_date && app.applied_at)
			.map(app => {
				const applied = new Date(app.applied_at);
				const interview = new Date(app.interview_date);
				return (interview - applied) / (1000 * 60 * 60 * 24); // Days
			});

		const avgTimeToInterview = interviewTimes.length > 0
			? (interviewTimes.reduce((a, b) => a + b, 0) / interviewTimes.length).toFixed(1)
			: 0;

		// Get AI performance
		const aiLogs = await prisma.analytics.findMany({
			where: {
				user_id: userId,
				metric_type: 'ai_generation',
				created_at: {
					gte: start,
					lte: end,
				},
			},
		});

		const totalCost = aiLogs.reduce((sum, log) => {
			const cost = log.metadata?.cost || 0;
			return sum + cost;
		}, 0);

		return {
			period: {
				start,
				end,
			},
			applications: {
				total: applications.length,
				byStatus: applications.reduce((acc, app) => {
					acc[app.status] = (acc[app.status] || 0) + 1;
					return acc;
				}, {}),
				bySource: applications.reduce((acc, app) => {
					acc[app.job.source] = (acc[app.job.source] || 0) + 1;
					return acc;
				}, {}),
			},
			timing: {
				avgResponseTime: parseFloat(avgResponseTime),
				avgTimeToInterview: parseFloat(avgTimeToInterview),
			},
			ai: {
				totalGenerations: aiLogs.length,
				totalTokens: aiLogs.reduce((sum, log) => sum + (log.metric_value || 0), 0),
				totalCost: totalCost.toFixed(2),
				byType: aiLogs.reduce((acc, log) => {
					const type = log.metadata?.type || 'unknown';
					acc[type] = (acc[type] || 0) + 1;
					return acc;
				}, {}),
			},
			topPerformingJobs: applications
				.filter(app => app.job.ai_match_score)
				.sort((a, b) => b.job.ai_match_score - a.job.ai_match_score)
				.slice(0, 10)
				.map(app => ({
					company: app.job.company_name,
					title: app.job.job_title,
					matchScore: app.job.ai_match_score,
					status: app.status,
				})),
		};
	}

	/**
	 * Export user data (GDPR compliance)
	 */
	async exportUserData() {
		const userId = this.user.id;

		const user = await prisma.users.findUnique({
			where: { id: userId },
			include: {
				user_profiles: {
					include: {
						experiences: true,
						educations: true,
					},
				},
				resumes: true,
				jobs: true,
				applications: {
					include: {
						job: true,
						application_events: true,
					},
				},
				subscriptions: true,
				payment_history: true,
				analytics: true,
				notifications: true,
			},
		});

		// Remove sensitive fields
		delete user.password;
		delete user.remember_token;

		return user;
	}
}

