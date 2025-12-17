import * as yup from 'yup';

/**
 * Schema for creating checkout session
 */
export const checkoutSchema = yup.object({
	body: yup.object({
		planName: yup.string().oneOf(['standard', 'premium'], 'Invalid plan selected. Choose "standard" or "premium"').required('Plan name is required'),
	}),
});

