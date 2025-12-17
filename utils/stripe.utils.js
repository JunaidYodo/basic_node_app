import Stripe from 'stripe';
import {
	STRIPE_SECRET_KEY,
	STRIPE_FREE_PRICE_ID,
	STRIPE_STANDARD_PRICE_ID,
	STRIPE_PREMIUM_PRICE_ID,
	LIVE_URL,
} from '../config.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);

// Plan configuration
export const PLANS = {
	free: {
		name: 'Free',
		price: 0,
		priceId: STRIPE_FREE_PRICE_ID,
		applications_limit: 5,
		ai_generations_limit: 10,
		features: [
			'5 job applications per month',
			'10 AI resume generations',
			'Basic job tracking',
			'Email support',
		],
	},
	standard: {
		name: 'Standard',
		price: 29,
		priceId: STRIPE_STANDARD_PRICE_ID,
		applications_limit: 50,
		ai_generations_limit: 100,
		features: [
			'50 job applications per month',
			'100 AI resume generations',
			'Advanced job tracking',
			'ATS integration',
			'Priority support',
		],
	},
	premium: {
		name: 'Premium',
		price: 79,
		priceId: STRIPE_PREMIUM_PRICE_ID,
		applications_limit: -1, // unlimited
		ai_generations_limit: -1, // unlimited
		features: [
			'Unlimited job applications',
			'Unlimited AI generations',
			'Advanced analytics',
			'ATS auto-apply',
			'Interview preparation',
			'Dedicated support',
		],
	},
};

/**
 * Get plan details by name
 */
export const getPlanDetails = (planName) => {
	return PLANS[planName] || PLANS.free;
};

/**
 * Create Stripe customer
 */
export const createCustomer = async (userData) => {
	const customer = await stripe.customers.create({
		email: userData.email,
		name: userData.name,
		metadata: {
			userId: userData.id.toString(),
		},
	});

	return customer;
};

/**
 * Create checkout session
 */
export const createCheckoutSession = async (customerId, priceId, userId) => {
	const session = await stripe.checkout.sessions.create({
		customer: customerId,
		mode: 'subscription',
		payment_method_types: ['card'],
		line_items: [
			{
				price: priceId,
				quantity: 1,
			},
		],
		success_url: `${LIVE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
		cancel_url: `${LIVE_URL}/pricing?canceled=true`,
		metadata: {
			userId: userId.toString(),
		},
		subscription_data: {
			metadata: {
				userId: userId.toString(),
			},
		},
	});

	return session;
};

/**
 * Create billing portal session
 */
export const createPortalSession = async (customerId) => {
	const session = await stripe.billingPortal.sessions.create({
		customer: customerId,
		return_url: `${LIVE_URL}/dashboard/billing`,
	});

	return session;
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (subscriptionId) => {
	const subscription = await stripe.subscriptions.update(subscriptionId, {
		cancel_at_period_end: true,
	});

	return subscription;
};

/**
 * Retrieve subscription
 */
export const retrieveSubscription = async (subscriptionId) => {
	const subscription = await stripe.subscriptions.retrieve(subscriptionId);
	return subscription;
};

/**
 * Update subscription
 */
export const updateSubscription = async (subscriptionId, priceId) => {
	const subscription = await stripe.subscriptions.retrieve(subscriptionId);

	const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
		items: [
			{
				id: subscription.items.data[0].id,
				price: priceId,
			},
		],
		proration_behavior: 'create_prorations',
	});

	return updatedSubscription;
};

/**
 * Verify webhook signature
 */
export const verifyWebhookSignature = (payload, signature, secret) => {
	try {
		const event = stripe.webhooks.constructEvent(payload, signature, secret);
		return event;
	} catch (err) {
		throw new Error(`Webhook signature verification failed: ${err.message}`);
	}
};

