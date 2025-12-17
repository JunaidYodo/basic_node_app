import * as yup from 'yup';

/**
 * Schema for generating AI content
 */
export const generateContentSchema = yup.object({
	body: yup.object({
		jobId: yup.number().positive().integer().required('Job ID is required'),
	}),
});

/**
 * Schema for creating application
 */
export const createApplicationSchema = yup.object({
	body: yup.object({
		jobId: yup.number().positive().integer().required('Job ID is required'),
		coverLetter: yup.string().max(10000, 'Cover letter must be less than 10000 characters').nullable(),
		resumeVersionId: yup.number().positive().integer().nullable(),
		submissionMethod: yup.string().oneOf(['manual', 'api', 'automated'], 'Invalid submission method').nullable(),
		notes: yup.string().max(1000, 'Notes must be less than 1000 characters').nullable(),
	}),
});

/**
 * Schema for application ID parameter
 */
export const applicationIdSchema = yup.object({
	params: yup.object({
		id: yup.number().positive().integer().required('Application ID is required'),
	}),
});

/**
 * Schema for updating application status
 */
export const updateStatusSchema = yup.object({
	params: yup.object({
		id: yup.number().positive().integer().required('Application ID is required'),
	}),
	body: yup.object({
		status: yup.string()
			.oneOf(['draft', 'submitted', 'viewed', 'interview', 'offer', 'rejected'], 'Invalid status')
			.required('Status is required'),
		eventData: yup.object().nullable(),
	}),
});

/**
 * Schema for getting applications list
 */
export const getApplicationsSchema = yup.object({
	query: yup.object({
		status: yup.string().oneOf(['draft', 'submitted', 'viewed', 'interview', 'offer', 'rejected']).nullable(),
		jobId: yup.number().positive().integer().nullable(),
		page: yup.number().positive().integer().nullable(),
		limit: yup.number().positive().integer().max(100).nullable(),
	}),
});

