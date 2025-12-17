import * as yup from 'yup';


/**
 * Schema for updating user profile
 */
export const updateProfileSchema = yup.object({
	body: yup.object({
		headline: yup.string().max(200, 'Headline must be less than 200 characters').nullable(),
		summary: yup.string().max(5000, 'Summary must be less than 5000 characters').nullable(),
		skills: yup.array().of(yup.string()).nullable(),
		linkedin_url: yup.string().url('Invalid LinkedIn URL').nullable(),
		github_url: yup.string().url('Invalid GitHub URL').nullable(),
		portfolio_url: yup.string().url('Invalid portfolio URL').nullable(),
		phone: yup.string().nullable(),
		location: yup.string().nullable(),
	}),
});

/**
 * Schema for creating/updating experience
 */
export const experienceSchema = yup.object({
	body: yup.object({
		company: yup.string().required('Company is required'),
		title: yup.string().required('Job title is required'),
		location: yup.string().nullable(),
		start_date: yup.date().required('Start date is required'),
		end_date: yup.date().nullable(),
		is_current: yup.boolean().default(false),
		description: yup.string().required('Description is required'),
	}),
});

/**
 * Schema for experience ID parameter
 */
export const experienceIdSchema = yup.object({
	params: yup.object({
		id: yup.number().positive().integer().required('Experience ID is required'),
	}),
});

/**
 * Schema for creating/updating education
 */
export const educationSchema = yup.object({
	body: yup.object({
		institution: yup.string().required('Institution is required'),
		degree: yup.string().required('Degree is required'),
		field: yup.string().nullable(),
		start_date: yup.date().required('Start date is required'),
		end_date: yup.date().nullable(),
		is_current: yup.boolean().default(false),
		description: yup.string().nullable(),
	}),
});

/**
 * Schema for education ID parameter
 */
export const educationIdSchema = yup.object({
	params: yup.object({
		id: yup.number().positive().integer().required('Education ID is required'),
	}),
});

