import * as yup from 'yup';

/**
 * Schema for Step 1: Set Preferences
 */
export const setPreferencesSchema = yup.object({
	body: yup.object({
		preferred_roles: yup.array().of(yup.string()).min(1, 'At least one preferred role is required').required('Preferred roles are required'),
		preferred_locations: yup.array().of(yup.string()).min(1, 'At least one preferred location is required').required('Preferred locations are required'),
		work_mode: yup.string().oneOf(['remote', 'hybrid', 'onsite'], 'Invalid work mode').required('Work mode is required'),
		salary_min: yup.number().positive('Minimum salary must be positive').nullable(),
		salary_max: yup.number().positive('Maximum salary must be positive').nullable(),
		currency: yup.string().default('USD').nullable(),
	}),
});

/**
 * Schema for Step 3: Confirm Profile
 */
export const confirmProfileSchema = yup.object({
	body: yup.object({
		headline: yup.string().max(200).nullable(),
		summary: yup.string().max(5000).nullable(),
		linkedin_url: yup.string().url('Invalid LinkedIn URL').nullable(),
		github_url: yup.string().url('Invalid GitHub URL').nullable(),
		portfolio_url: yup.string().url('Invalid Portfolio URL').nullable(),
	}),
});

/**
 * Schema for skipping onboarding
 */
export const skipOnboardingSchema = yup.object({
	body: yup.object({
		skip: yup.boolean().required(),
	}),
});

