import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';
import {
	createCustomer,
	createCheckoutSession,
	createPortalSession,
	cancelSubscription as stripeCancel,
	getPlanDetails,
	PLANS,
} from '../utils/stripe.utils.js';
import { AppError } from '../errors/index.js';

const prisma = new PrismaClient();

export class SubscriptionService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
		this.user = req.user;
	}

	/**
	 * Create checkout session for plan upgrade
	 */
	async createCheckout() {
		const { planName } = this.body;
		const userId = this.user.id;

		if (!planName || !['standard', 'premium'].includes(planName)) {
			throw new AppError('Invalid plan selected', HttpStatus.BAD_REQUEST);
		}

		const user = await prisma.users.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				name: true,
				stripe_customer_id: true,
			},
		});

		if (!user) {
			throw new AppError('User not found', HttpStatus.NOT_FOUND);
		}

		// Create customer if doesn't exist
		let customerId = user.stripe_customer_id;
		if (!customerId) {
			const customer = await createCustomer(user);
			customerId = customer.id;
			await prisma.users.update({
				where: { id: userId },
				data: { stripe_customer_id: customerId },
			});
		}

		const plan = getPlanDetails(planName);
		if (!plan.priceId || plan.price === 0) {
			throw new AppError('Invalid plan selected', HttpStatus.BAD_REQUEST);
		}

		const session = await createCheckoutSession(customerId, plan.priceId, userId);

		return {
			sessionId: session.id,
			url: session.url,
		};
	}

	/**
	 * Get user's subscription details
	 */
	async getSubscriptionDetails() {
		const userId = this.user.id;

		const user = await prisma.users.findUnique({
			where: { id: userId },
			select: {
				subscription_status: true,
				subscription_plan: true,
				subscription_start: true,
				subscription_end: true,
				trial_ends_at: true,
				applications_used: true,
				applications_limit: true,
				ai_generations_used: true,
				ai_generations_limit: true,
				stripe_subscription_id: true,
			},
		});

		if (!user) {
			throw new AppError('User not found', HttpStatus.NOT_FOUND);
		}

		const planDetails = getPlanDetails(user.subscription_plan);

		return {
			...user,
			plan_details: planDetails,
			usage: {
				applications: {
					used: user.applications_used,
					limit: user.applications_limit,
					percentage:
						user.applications_limit === -1
							? 0
							: Math.round((user.applications_used / user.applications_limit) * 100),
				},
				ai_generations: {
					used: user.ai_generations_used,
					limit: user.ai_generations_limit,
					percentage:
						user.ai_generations_limit === -1
							? 0
							: Math.round((user.ai_generations_used / user.ai_generations_limit) * 100),
				},
			},
		};
	}

	/**
	 * Create billing portal session
	 */
	async getBillingPortal() {
		const userId = this.user.id;

		const user = await prisma.users.findUnique({
			where: { id: userId },
			select: { stripe_customer_id: true },
		});

		if (!user || !user.stripe_customer_id) {
			throw new AppError('No Stripe customer found', HttpStatus.NOT_FOUND);
		}

		const session = await createPortalSession(user.stripe_customer_id);

		return { url: session.url };
	}

	/**
	 * Get user's payment history
	 */
	async getPaymentHistory() {
		const userId = this.user.id;

		const payments = await prisma.payment_history.findMany({
			where: { user_id: userId },
			orderBy: { created_at: 'desc' },
			take: 20,
		});

		return payments;
	}

	/**
	 * Cancel user's subscription
	 */
	async cancelSubscription() {
		const userId = this.user.id;

		const user = await prisma.users.findUnique({
			where: { id: userId },
			select: { stripe_subscription_id: true },
		});

		if (!user || !user.stripe_subscription_id) {
			throw new AppError('No active subscription found', HttpStatus.NOT_FOUND);
		}

		const subscription = await stripeCancel(user.stripe_subscription_id);

		await prisma.subscriptions.updateMany({
			where: { stripe_subscription_id: subscription.id },
			data: {
				cancel_at_period_end: true,
			},
		});

		return subscription;
	}

	/**
	 * Handle subscription created from webhook
	 */
	async handleSubscriptionCreated(subscription) {
		const userId = parseInt(subscription.metadata.userId);
		const priceId = subscription.items.data[0].price.id;

		// Determine plan name from price ID
		let planName = 'free';
		if (priceId === PLANS.standard.priceId) planName = 'standard';
		if (priceId === PLANS.premium.priceId) planName = 'premium';

		const plan = getPlanDetails(planName);

		// Update user subscription
		const updatedUser = await prisma.users.update({
			where: { id: userId },
			data: {
				stripe_subscription_id: subscription.id,
				subscription_status: subscription.status,
				subscription_plan: planName,
				subscription_start: new Date(subscription.current_period_start * 1000),
				subscription_end: new Date(subscription.current_period_end * 1000),
				trial_ends_at: subscription.trial_end
					? new Date(subscription.trial_end * 1000)
					: null,
				applications_limit: plan.applications_limit,
				ai_generations_limit: plan.ai_generations_limit,
				applications_used: 0,
				ai_generations_used: 0,
			},
		});

		// Create subscription record
		await prisma.subscriptions.create({
			data: {
				user_id: userId,
				stripe_subscription_id: subscription.id,
				stripe_customer_id: subscription.customer,
				stripe_price_id: priceId,
				status: subscription.status,
				plan_name: planName,
				current_period_start: new Date(subscription.current_period_start * 1000),
				current_period_end: new Date(subscription.current_period_end * 1000),
				trial_start: subscription.trial_start
					? new Date(subscription.trial_start * 1000)
					: null,
				trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
			},
		});

		return updatedUser;
	}

	/**
	 * Handle subscription updated from webhook
	 */
	async handleSubscriptionUpdated(subscription) {
		const userId = parseInt(subscription.metadata.userId);
		const priceId = subscription.items.data[0].price.id;

		// Determine plan name from price ID
		let planName = 'free';
		if (priceId === PLANS.standard.priceId) planName = 'standard';
		if (priceId === PLANS.premium.priceId) planName = 'premium';

		const plan = getPlanDetails(planName);

		// Update user
		const updatedUser = await prisma.users.update({
			where: { id: userId },
			data: {
				subscription_status: subscription.status,
				subscription_plan: planName,
				subscription_end: new Date(subscription.current_period_end * 1000),
				applications_limit: plan.applications_limit,
				ai_generations_limit: plan.ai_generations_limit,
			},
		});

		// Update subscription record
		await prisma.subscriptions.updateMany({
			where: { stripe_subscription_id: subscription.id },
			data: {
				status: subscription.status,
				plan_name: planName,
				stripe_price_id: priceId,
				current_period_end: new Date(subscription.current_period_end * 1000),
				cancel_at_period_end: subscription.cancel_at_period_end,
				canceled_at: subscription.canceled_at
					? new Date(subscription.canceled_at * 1000)
					: null,
			},
		});

		return updatedUser;
	}

	/**
	 * Handle subscription deleted from webhook
	 */
	async handleSubscriptionDeleted(subscription) {
		const userId = parseInt(subscription.metadata.userId);

		// Downgrade to free plan
		const updatedUser = await prisma.users.update({
			where: { id: userId },
			data: {
				subscription_status: 'canceled',
				subscription_plan: 'free',
				stripe_subscription_id: null,
				applications_limit: PLANS.free.applications_limit,
				ai_generations_limit: PLANS.free.ai_generations_limit,
			},
		});

		// Update subscription record
		await prisma.subscriptions.updateMany({
			where: { stripe_subscription_id: subscription.id },
			data: {
				status: 'canceled',
				canceled_at: new Date(),
			},
		});

		return updatedUser;
	}

	/**
	 * Handle successful payment from webhook
	 */
	async handlePaymentSucceeded(invoice) {
		const customer = await prisma.users.findUnique({
			where: { stripe_customer_id: invoice.customer },
			select: { id: true },
		});

		if (!customer) {
			throw new AppError('Customer not found', HttpStatus.NOT_FOUND);
		}

		// Create payment history record
		const payment = await prisma.payment_history.create({
			data: {
				user_id: customer.id,
				stripe_payment_id: invoice.payment_intent,
				stripe_invoice_id: invoice.id,
				amount: invoice.amount_paid / 100,
				currency: invoice.currency.toUpperCase(),
				status: 'succeeded',
				payment_method: invoice.payment_settings?.payment_method_types?.[0] || 'card',
				description: invoice.description || 'Subscription payment',
				receipt_url: invoice.hosted_invoice_url,
			},
		});

		return payment;
	}
}

