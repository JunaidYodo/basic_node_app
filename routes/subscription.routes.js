import express from 'express';
import { isAuth } from '../middlewares/index.js';
import { validate } from '../middlewares/index.js';
import {
	createCheckout,
	getSubscriptionDetails,
	getBillingPortal,
	getPaymentHistory,
	cancelSubscription,
	handleWebhook,
} from '../controllers/index.js';
import {
	checkoutSchema,
} from '../validations/index.js';

const router = express.Router();

/**
 * @swagger
 * /subscription/webhook:
 *   post:
 *     summary: Stripe webhook endpoint (Public)
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook signature
 */
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

/**
 * @swagger
 * /subscription/checkout:
 *   post:
 *     summary: Create Stripe checkout session
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - priceId
 *             properties:
 *               priceId:
 *                 type: string
 *                 example: price_1234567890
 *               plan:
 *                 type: string
 *                 enum: [basic, premium, enterprise]
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                     url:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
router.post('/checkout', isAuth, validate(checkoutSchema), createCheckout);

/**
 * @swagger
 * /subscription/details:
 *   get:
 *     summary: Get subscription details
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     plan:
 *                       type: string
 *                     status:
 *                       type: string
 *                     currentPeriodEnd:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/details', isAuth, getSubscriptionDetails);

/**
 * @swagger
 * /subscription/portal:
 *   post:
 *     summary: Create Stripe billing portal session
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Billing portal session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
router.post('/portal', isAuth, getBillingPortal);

/**
 * @swagger
 * /subscription/payment-history:
 *   get:
 *     summary: Get payment history
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/payment-history', isAuth, getPaymentHistory);

/**
 * @swagger
 * /subscription/cancel:
 *   post:
 *     summary: Cancel subscription
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription cancelled successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/cancel', isAuth, cancelSubscription);

export default router;
