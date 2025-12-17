import axios from 'axios';
import {
	GREENHOUSE_API_KEY,
	WORKDAY_API_KEY,
	LEVER_API_KEY,
} from '../config.js';

/**
 * Greenhouse ATS Integration
 */
export class GreenhouseATS {
	constructor(apiKey = GREENHOUSE_API_KEY) {
		this.apiKey = apiKey;
		this.baseURL = 'https://harvest.greenhouse.io/v1';
	}

	/**
	 * Get job details from Greenhouse
	 */
	async getJob(jobId) {
		try {
			const response = await axios.get(`${this.baseURL}/jobs/${jobId}`, {
				auth: {
					username: this.apiKey,
					password: '',
				},
			});
			return response.data;
		} catch (error) {
			console.error('Greenhouse API Error:', error.response?.data || error.message);
			throw new Error(`Failed to fetch job from Greenhouse: ${error.message}`);
		}
	}

	/**
	 * Submit application to Greenhouse
	 */
	async submitApplication(jobId, applicationData) {
		try {
			const payload = {
				first_name: applicationData.firstName,
				last_name: applicationData.lastName,
				email: applicationData.email,
				phone: applicationData.phone || null,
				resume_content: applicationData.resumeText || null,
				resume_content_filename: applicationData.resumeFilename || 'resume.pdf',
				cover_letter_content: applicationData.coverLetter || null,
				answers: applicationData.customFields || [],
			};

			const response = await axios.post(
				`${this.baseURL}/jobs/${jobId}/candidates`,
				payload,
				{
					auth: {
						username: this.apiKey,
						password: '',
					},
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			return {
				success: true,
				candidateId: response.data.id,
				data: response.data,
			};
		} catch (error) {
			console.error('Greenhouse Application Error:', error.response?.data || error.message);
			return {
				success: false,
				error: error.response?.data?.errors || error.message,
			};
		}
	}

	/**
	 * Get application status
	 */
	async getApplicationStatus(candidateId) {
		try {
			const response = await axios.get(`${this.baseURL}/candidates/${candidateId}`, {
				auth: {
					username: this.apiKey,
					password: '',
				},
			});
			return response.data;
		} catch (error) {
			console.error('Greenhouse Status Error:', error.response?.data || error.message);
			throw new Error(`Failed to get application status: ${error.message}`);
		}
	}
}

/**
 * Lever ATS Integration
 */
export class LeverATS {
	constructor(apiKey = LEVER_API_KEY) {
		this.apiKey = apiKey;
		this.baseURL = 'https://api.lever.co/v1';
	}

	/**
	 * Submit application to Lever
	 */
	async submitApplication(postingId, applicationData) {
		try {
			const formData = new FormData();
			formData.append('name', `${applicationData.firstName} ${applicationData.lastName}`);
			formData.append('email', applicationData.email);
			if (applicationData.phone) formData.append('phone', applicationData.phone);
			if (applicationData.resumeText) formData.append('resume', applicationData.resumeText);
			if (applicationData.coverLetter) formData.append('comments', applicationData.coverLetter);

			const response = await axios.post(
				`${this.baseURL}/postings/${postingId}/apply?key=${this.apiKey}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			return {
				success: true,
				data: response.data,
			};
		} catch (error) {
			console.error('Lever Application Error:', error.response?.data || error.message);
			return {
				success: false,
				error: error.response?.data || error.message,
			};
		}
	}
}

/**
 * Workday ATS Integration (simplified - Workday is complex)
 */
export class WorkdayATS {
	constructor(apiKey = WORKDAY_API_KEY) {
		this.apiKey = apiKey;
		// Workday URLs vary by company, this is a placeholder
		this.baseURL = 'https://wd5.myworkday.com/wday/cxs';
	}

	/**
	 * Workday requires company-specific implementation
	 * This is a placeholder for future implementation
	 */
	async submitApplication(jobRequisitionId, applicationData) {
		// Workday requires complex OAuth and company-specific endpoints
		// For MVP, we'll return a manual application flag
		return {
			success: false,
			error: 'Workday integration requires manual application. Opening job page...',
			requiresManual: true,
		};
	}
}

/**
 * Generic ATS adapter - routes to appropriate ATS
 */
export class ATSAdapter {
	constructor() {
		this.greenhouseATS = new GreenhouseATS();
		this.leverATS = new LeverATS();
		this.workdayATS = new WorkdayATS();
	}

	/**
	 * Submit application to appropriate ATS
	 */
	async submitApplication(atsType, jobIdentifier, applicationData) {
		switch (atsType.toLowerCase()) {
			case 'greenhouse':
				return await this.greenhouseATS.submitApplication(jobIdentifier, applicationData);
			case 'lever':
				return await this.leverATS.submitApplication(jobIdentifier, applicationData);
			case 'workday':
				return await this.workdayATS.submitApplication(jobIdentifier, applicationData);
			default:
				return {
					success: false,
					error: `ATS type ${atsType} not supported`,
					requiresManual: true,
				};
		}
	}

	/**
	 * Get job details from appropriate ATS
	 */
	async getJob(atsType, jobIdentifier) {
		switch (atsType.toLowerCase()) {
			case 'greenhouse':
				return await this.greenhouseATS.getJob(jobIdentifier);
			default:
				throw new Error(`Get job not implemented for ${atsType}`);
		}
	}
}

/**
 * Parse job ID from URL
 */
export const parseJobIdFromUrl = (url, source) => {
	try {
		if (source === 'greenhouse') {
			// https://boards.greenhouse.io/company/jobs/1234567
			const match = url.match(/jobs\/(\d+)/);
			return match ? match[1] : null;
		} else if (source === 'lever') {
			// https://jobs.lever.co/company/posting-id
			const parts = url.split('/');
			return parts[parts.length - 1];
		} else if (source === 'workday') {
			// https://company.wd5.myworkdayjobs.com/External/job/Location/Job-Title/JR123456
			const match = url.match(/JR\d+/);
			return match ? match[0] : null;
		}
		return null;
	} catch (error) {
		console.error('Error parsing job ID:', error);
		return null;
	}
};

