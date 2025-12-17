import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { AppError } from '../errors/index.js';

const prisma = new PrismaClient();

export class JobService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
		this.user = req.user;
	}

	/**
	 * Import job from URL
	 */
	async importJobFromUrl() {
		const { url } = this.body;
		const userId = this.user.id;

		if (!url) {
			throw new AppError('Job URL is required', HttpStatus.BAD_REQUEST);
		}

		// Detect source from URL
		const source = this.detectJobSource(url);

		let jobData;
		if (source === 'greenhouse') {
			jobData = await this.scrapeGreenhouseJob(url);
		} else if (source === 'workday') {
			jobData = await this.scrapeWorkdayJob(url);
		} else if (source === 'lever') {
			jobData = await this.scrapeLeverJob(url);
		} else if (source === 'linkedin') {
			jobData = await this.scrapeLinkedInJob(url);
		} else if (source === 'indeed') {
			jobData = await this.scrapeIndeedJob(url);
		} else {
			jobData = await this.scrapeGenericJob(url);
		}

		// Create job record
		const job = await prisma.jobs.create({
			data: {
				user_id: userId,
				external_id: jobData.externalId || null,
				source,
				source_url: url,
				company_name: jobData.company,
				job_title: jobData.title,
				location: jobData.location || null,
				work_mode: jobData.workMode || null,
				salary_range: jobData.salary || null,
				description: jobData.description,
				requirements: jobData.requirements || null,
				benefits: jobData.benefits || null,
				posted_date: jobData.postedDate ? new Date(jobData.postedDate) : null,
				status: 'active',
			},
		});

		return job;
	}

	/**
	 * Detect job source from URL
	 */
	detectJobSource(url) {
		if (url.includes('greenhouse.io')) return 'greenhouse';
		if (url.includes('myworkdayjobs.com')) return 'workday';
		if (url.includes('lever.co')) return 'lever';
		if (url.includes('linkedin.com')) return 'linkedin';
		if (url.includes('indeed.com')) return 'indeed';
		if (url.includes('ziprecruiter.com')) return 'ziprecruiter';
		return 'manual';
	}

	/**
	 * Scrape Greenhouse job
	 */
	async scrapeGreenhouseJob(url) {
		const response = await axios.get(url);
		const $ = cheerio.load(response.data);

		const company = $('.company-name').text().trim() || $('h1').first().text().trim();
		const title = $('.app-title').text().trim() || $('h2').first().text().trim();
		const location = $('.location').text().trim();
		const description = $('#content').html() || $('.content').html() || '';

		return {
			company,
			title,
			location,
			description,
			workMode: location?.toLowerCase().includes('remote') ? 'remote' : null,
		};
	}

	/**
	 * Scrape Workday job
	 */
	async scrapeWorkdayJob(url) {
		const response = await axios.get(url);
		const $ = cheerio.load(response.data);

		const title = $('h2[data-automation-id="jobPostingHeader"]').text().trim();
		const company = $('span[data-automation-id="jobPostingCompany"]').text().trim();
		const location = $('span[data-automation-id="jobPostingLocation"]').text().trim();
		const description = $('div[data-automation-id="jobPostingDescription"]').html() || '';

		return {
			company: company || 'Company',
			title: title || 'Job Title',
			location,
			description,
			workMode: location?.toLowerCase().includes('remote') ? 'remote' : null,
		};
	}

	/**
	 * Scrape Lever job
	 */
	async scrapeLeverJob(url) {
		const response = await axios.get(url);
		const $ = cheerio.load(response.data);

		const company = $('.main-header-text h4').text().trim();
		const title = $('.posting-headline h2').text().trim();
		const location = $('.posting-categories .location').text().trim();
		const description = $('.content .section-wrapper').html() || '';

		return {
			company: company || 'Company',
			title: title || 'Job Title',
			location,
			description,
			workMode: location?.toLowerCase().includes('remote') ? 'remote' : null,
		};
	}

	/**
	 * Scrape LinkedIn job
	 */
	async scrapeLinkedInJob(url) {
		const response = await axios.get(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			},
		});
		const $ = cheerio.load(response.data);

		const title = $('h1.topcard__title').text().trim();
		const company = $('a.topcard__org-name-link').text().trim();
		const location = $('.topcard__flavor--bullet').eq(1).text().trim();
		const description = $('.description__text').html() || '';

		return {
			company: company || 'Company',
			title: title || 'Job Title',
			location,
			description,
			workMode: location?.toLowerCase().includes('remote') ? 'remote' : null,
		};
	}

	/**
	 * Scrape Indeed job
	 */
	async scrapeIndeedJob(url) {
		const response = await axios.get(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			},
		});
		const $ = cheerio.load(response.data);

		const title = $('h1.jobsearch-JobInfoHeader-title').text().trim();
		const company = $('div[data-company-name="true"]').text().trim();
		const location = $('div[data-testid="job-location"]').text().trim();
		const description = $('#jobDescriptionText').html() || '';

		return {
			company: company || 'Company',
			title: title || 'Job Title',
			location,
			description,
			workMode: location?.toLowerCase().includes('remote') ? 'remote' : null,
		};
	}

	/**
	 * Scrape generic job page
	 */
	async scrapeGenericJob(url) {
		const response = await axios.get(url);
		const $ = cheerio.load(response.data);

		const title = $('h1').first().text().trim() || $('title').text().trim();
		const company = $('.company').text().trim() || $('meta[property="og:site_name"]').attr('content') || 'Company';
		const description = $('main').html() || $('article').html() || $('body').html() || '';

		return {
			company,
			title: title || 'Job Title',
			location: null,
			description,
		};
	}

	/**
	 * Create manual job entry
	 */
	async createManualJob() {
		const jobData = this.body;
		const userId = this.user.id;

		if (!jobData.company || !jobData.title || !jobData.description) {
			throw new AppError('Company, title, and description are required', HttpStatus.BAD_REQUEST);
		}

		const job = await prisma.jobs.create({
			data: {
				user_id: userId,
				source: 'manual',
				company_name: jobData.company,
				job_title: jobData.title,
				location: jobData.location || null,
				work_mode: jobData.workMode || null,
				salary_range: jobData.salary || null,
				description: jobData.description,
				requirements: jobData.requirements || null,
				benefits: jobData.benefits || null,
				status: 'active',
			},
		});

		return job;
	}

	/**
	 * Get user's jobs
	 */
	async getUserJobs() {
		const userId = this.user.id;
		const { status, source, company } = this.req.query;

		const where = {
			user_id: userId,
		};

		if (status) where.status = status;
		if (source) where.source = source;
		if (company) {
			where.company_name = {
				contains: company,
			};
		}

		const jobs = await prisma.jobs.findMany({
			where,
			orderBy: {
				created_at: 'desc',
			},
			include: {
				applications: {
					select: {
						id: true,
						status: true,
						applied_at: true,
					},
				},
			},
		});

		return jobs;
	}

	/**
	 * Get job by ID
	 */
	async getJobById() {
		const { id } = this.req.params;
		const userId = this.user.id;

		const job = await prisma.jobs.findFirst({
			where: {
				id: parseInt(id, 10),
				user_id: userId,
			},
			include: {
				applications: {
					orderBy: {
						created_at: 'desc',
					},
				},
			},
		});

		if (!job) {
			throw new AppError('Job not found', HttpStatus.NOT_FOUND);
		}

		return job;
	}

	/**
	 * Update job
	 */
	async updateJob() {
		const { id } = this.req.params;
		const userId = this.user.id;
		const updateData = this.body;

		const job = await prisma.jobs.updateMany({
			where: {
				id: parseInt(id, 10),
				user_id: userId,
			},
			data: updateData,
		});

		if (job.count === 0) {
			throw new AppError('Job not found', HttpStatus.NOT_FOUND);
		}

		return await this.getJobById();
	}

	/**
	 * Delete job
	 */
	async deleteJob() {
		const { id } = this.req.params;
		const userId = this.user.id;

		const result = await prisma.jobs.deleteMany({
			where: {
				id: parseInt(id, 10),
				user_id: userId,
			},
		});

		if (result.count === 0) {
			throw new AppError('Job not found', HttpStatus.NOT_FOUND);
		}

		return true;
	}
}

