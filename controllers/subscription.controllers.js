import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import { SubscriptionService } from '../services';
import { successResponse } from '../utils';
import { verifyWebhookSignature } from '../utils/stripe.utils.js';

/**
 * @route   POST /api/v1/subscription/checkout
 * @desc    Create checkout session for plan upgrade
 * @access  Private
 */
export const createCheckout = asyncHandler(async (req, res) => {
	// const subscriptionService = new SubscriptionService(req);
	// const data = await subscriptionService.createCheckout();

	// return successResponse(res, HttpStatus.OK, 'Checkout session created successfully', data);
	return successResponse(res, HttpStatus.OK, 'Create checkout endpoint - Coming soon', {});
});

/**
 * @route   GET /api/v1/subscription/details
 * @desc    Get user's subscription details
 * @access  Private
 */
export const getSubscriptionDetails = asyncHandler(async (req, res) => {
	// const subscriptionService = new SubscriptionService(req);
	// const data = await subscriptionService.getSubscriptionDetails();

	// return successResponse(res, HttpStatus.OK, 'Subscription details retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get subscription details endpoint - Coming soon', {});
});

/**
 * @route   POST /api/v1/subscription/portal
 * @desc    Create billing portal session
 * @access  Private
 */
export const getBillingPortal = asyncHandler(async (req, res) => {
	// const subscriptionService = new SubscriptionService(req);
	// const data = await subscriptionService.getBillingPortal();

	// return successResponse(res, HttpStatus.OK, 'Billing portal URL created successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get billing portal endpoint - Coming soon', {});
});

/**
 * @route   GET /api/v1/subscription/payment-history
 * @desc    Get user's payment history
 * @access  Private
 */
export const getPaymentHistory = asyncHandler(async (req, res) => {
	// const subscriptionService = new SubscriptionService(req);
	// const data = await subscriptionService.getPaymentHistory();

	// return successResponse(res, HttpStatus.OK, 'Payment history retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get payment history endpoint - Coming soon', {});
});

/**
 * @route   POST /api/v1/subscription/cancel
 * @desc    Cancel user's subscription
 * @access  Private
 */
export const cancelSubscription = asyncHandler(async (req, res) => {
	// const subscriptionService = new SubscriptionService(req);
	// const data = await subscriptionService.cancelSubscription();

	// return successResponse(
	// 	res,
	// 	HttpStatus.OK,
	// 	'Subscription will be canceled at the end of the billing period',
	// 	data
	// );
	return successResponse(res, HttpStatus.OK, 'Cancel subscription endpoint - Coming soon', {});
});

/**
 * @route   POST /api/v1/subscription/webhook
 * @desc    Handle Stripe webhooks
 * @access  Public (verified by Stripe signature)
 */
export const handleWebhook = asyncHandler(async (req, res) => {
	// Keep webhook working as it's needed for external integrations
	const signature = req.headers['stripe-signature'];
	const payload = req.body;

	try {
		// Verify webhook signature
		const event = verifyWebhookSignature(payload, signature);

		const subscriptionService = new SubscriptionService(req);

		// Handle different event types
		switch (event.type) {
			case 'customer.subscription.created':
				await subscriptionService.handleSubscriptionCreated(event.data.object);
				break;

			case 'customer.subscription.updated':
				await subscriptionService.handleSubscriptionUpdated(event.data.object);
				break;

			case 'customer.subscription.deleted':
				await subscriptionService.handleSubscriptionDeleted(event.data.object);
				break;

			case 'invoice.payment_succeeded':
				await subscriptionService.handlePaymentSucceeded(event.data.object);
				break;

			case 'invoice.payment_failed':
				console.log('Payment failed:', event.data.object);
				// Handle failed payment (send notification, etc.)
				break;

			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		res.json({ received: true });
	} catch (error) {
		console.error('Webhook error:', error);
		return res.status(400).json({ error: 'Webhook handler failed' });
	}
});

