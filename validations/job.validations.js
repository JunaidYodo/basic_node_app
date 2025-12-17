import * as yup from 'yup';

/**
 * Schema for importing job from URL
 */
export const importJobSchema = yup.object({
	body: yup.object({
		url: yup.string().url('Invalid URL format').required('Job URL is required'),
	}),
});

/**
 * Schema for creating manual job
 */
export const createManualJobSchema = yup.object({
	body: yup.object({
		company: yup.string().required('Company name is required'),
		title: yup.string().required('Job title is required'),
		description: yup.string().required('Job description is required'),
		location: yup.string().nullable(),
		workMode: yup.string().oneOf(['remote', 'onsite', 'hybrid'], 'Invalid work mode').nullable(),
		salary: yup.string().nullable(),
		requirements: yup.string().nullable(),
		benefits: yup.string().nullable(),
	}),
});

/**
 * Schema for getting jobs list
 */
export const getJobsSchema = yup.object({
	query: yup.object({
		status: yup.string().oneOf(['active', 'closed', 'applied']).nullable(),
		source: yup.string().oneOf(['greenhouse', 'workday', 'lever', 'linkedin', 'indeed', 'ziprecruiter', 'manual']).nullable(),
		company: yup.string().nullable(),
		page: yup.number().positive().integer().nullable(),
		limit: yup.number().positive().integer().max(100).nullable(),
	}),
});

/**
 * Schema for job ID parameter
 */
export const jobIdSchema = yup.object({
	params: yup.object({
		id: yup.number().positive().integer().required('Job ID is required'),
	}),
});

/**
 * Schema for updating job
 */
export const updateJobSchema = yup.object({
	params: yup.object({
		id: yup.number().positive().integer().required('Job ID is required'),
	}),
	body: yup.object({
		company_name: yup.string().nullable(),
		job_title: yup.string().nullable(),
		location: yup.string().nullable(),
		work_mode: yup.string().oneOf(['remote', 'onsite', 'hybrid']).nullable(),
		salary_range: yup.string().nullable(),
		description: yup.string().nullable(),
		requirements: yup.string().nullable(),
		benefits: yup.string().nullable(),
		status: yup.string().oneOf(['active', 'closed', 'applied']).nullable(),
	}),
});

