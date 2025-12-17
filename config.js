import dotenv from 'dotenv';

const envFiles = {
	development: '.env.development',
	production: '.env.production',
	staging: '.env.staging',
};

dotenv.config({ path: envFiles[process.env.NODE_ENV] });

export const {
	NODE_ENV,
	// PORT,
	// ACCESS_TOKEN_SECRET,
	// ACCESS_TOKEN_EXPIRY,
	// OTP_TOKEN_SECRET,
	// OTP_TOKEN_EXPIRY,
	// RATE_LIMIT_WINDOW,
	// RATE_LIMIT_MAX,
	// CLOUDINARY_CLOUD_NAME,
	// CLOUDINARY_API_KEY,
	// CLOUDINARY_API_SECRET,
	// CLOUDINARY_FOLDER,
	// SMTP_PASS,
	// SMTP_HOST,
	// SMTP_PORT,
	// FROM_NAME,
	// FROM_EMAIL,
	// ADMIN_EMAIL,
	// SUPPORT_EMAIL,
	// LIVE_URL,
	// // Stripe
	// STRIPE_SECRET_KEY,
	// STRIPE_PUBLISHABLE_KEY,
	// STRIPE_WEBHOOK_SECRET,
	// STRIPE_FREE_PRICE_ID,
	// STRIPE_STANDARD_PRICE_ID,
	// STRIPE_PREMIUM_PRICE_ID,
	// // OpenAI
	// OPENAI_API_KEY,
	// OPENAI_MODEL,
	// // AWS S3
	// AWS_ACCESS_KEY_ID,
	// AWS_SECRET_ACCESS_KEY,
	// AWS_REGION,
	// AWS_S3_BUCKET,
	// // ATS
	// GREENHOUSE_API_KEY,
	// WORKDAY_API_KEY,
	// LEVER_API_KEY,
	// // Encryption
	// ENCRYPTION_KEY,
	// // SG_API_KEY,
	// // SG_SENDER_EMAIL,
} = process.env;
