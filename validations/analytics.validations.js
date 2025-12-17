import * as yup from 'yup';

/**
 * Schema for detailed analytics with date range
 */
export const detailedAnalyticsSchema = yup.object({
	query: yup.object({
		startDate: yup.date().required('Start date is required'),
		endDate: yup.date()
			.required('End date is required')
			.min(yup.ref('startDate'), 'End date must be after start date'),
	}),
});

