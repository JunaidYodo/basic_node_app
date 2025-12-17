import * as yup from 'yup';

/**
 * Schema for resume ID parameter
 */
export const resumeIdSchema = yup.object({
	params: yup.object({
		id: yup.number().positive().integer().required('Resume ID is required'),
	}),
});


