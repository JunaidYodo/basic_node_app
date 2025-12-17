import swaggerJsdoc from 'swagger-jsdoc';
import { PORT } from './config.js';
export function generateSwaggerSpec(req = null) {
	let serverUrl;
	
	if (req) {
	  // Use current request's protocol and host
	  const protocol = req.protocol || 'http';
	  const host = req.get('host') || `localhost:${process.env.PORT || 3000}`;
	  serverUrl = `${protocol}://${host}/api/v1`;
	} else {
	  // Fallback for when no request is available
	  serverUrl = `http://localhost:${process.env.PORT || 3000}/api/v1`;
	}

	
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'NextHire API Documentation',
			version: '1.0.0',
			description: 'Comprehensive API documentation for NextHire - AI-powered job application management platform',
			contact: {
				name: 'NextHire API Support',
				email: 'support@nexthire.com',
			},
			license: {
				name: 'ISC',
				url: 'https://opensource.org/licenses/ISC',
			},
		},
		servers: [
			{
				url: `http://localhost:${PORT}/api/v1`,
				description: 'Development server',
			},
			{
				url: serverUrl,
				description: 'Production server',
			}
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description: 'Enter your JWT token',
				},
			},
			schemas: {
				Error: {
					type: 'object',
					properties: {
						status: {
							type: 'string',
							example: 'error',
						},
						message: {
							type: 'string',
							example: 'An error occurred',
						},
					},
				},
				Success: {
					type: 'object',
					properties: {
						status: {
							type: 'string',
							example: 'success',
						},
						message: {
							type: 'string',
						},
						data: {
							type: 'object',
						},
					},
				},
				User: {
					type: 'object',
					properties: {
						id: { type: 'integer', example: 1 },
						username: { type: 'string', example: 'john_doe' },
						email: { type: 'string', example: 'john@example.com' },
						first_name: { type: 'string', example: 'John' },
						last_name: { type: 'string', example: 'Doe' },
						phone: { type: 'string', example: '+1234567890' },
						subscription_plan: { type: 'string', enum: ['free', 'basic', 'premium', 'enterprise'] },
						subscription_status: { type: 'string', enum: ['active', 'inactive', 'cancelled'] },
						onboarding_completed: { type: 'boolean' },
						created_at: { type: 'string', format: 'date-time' },
					},
				},
				Job: {
					type: 'object',
					properties: {
						id: { type: 'integer', example: 1 },
						user_id: { type: 'integer' },
						job_url: { type: 'string', format: 'uri' },
						company_name: { type: 'string', example: 'Tech Corp' },
						job_title: { type: 'string', example: 'Senior Software Engineer' },
						location: { type: 'string', example: 'San Francisco, CA' },
						job_type: { type: 'string', enum: ['full-time', 'part-time', 'contract', 'internship'] },
						salary_range: { type: 'string', example: '$120k - $180k' },
						description: { type: 'string' },
						source: { type: 'string', enum: ['linkedin', 'indeed', 'glassdoor', 'manual'] },
						ai_match_score: { type: 'number', example: 85.5 },
						created_at: { type: 'string', format: 'date-time' },
					},
				},
				Application: {
					type: 'object',
					properties: {
						id: { type: 'integer', example: 1 },
						user_id: { type: 'integer' },
						job_id: { type: 'integer' },
						resume_version_id: { type: 'integer' },
						cover_letter: { type: 'string' },
						status: { type: 'string', enum: ['draft', 'submitted', 'viewed', 'interview', 'offer', 'rejected'] },
						submission_method: { type: 'string', enum: ['manual', 'ats'] },
						submitted_at: { type: 'string', format: 'date-time' },
						created_at: { type: 'string', format: 'date-time' },
					},
				},
				Resume: {
					type: 'object',
					properties: {
						id: { type: 'integer', example: 1 },
						user_id: { type: 'integer' },
						name: { type: 'string', example: 'resume.pdf' },
						file_url: { type: 'string', format: 'uri' },
						parsed_data: { type: 'object' },
						version: { type: 'integer', example: 1 },
						is_master: { type: 'boolean' },
						created_at: { type: 'string', format: 'date-time' },
					},
				},
				Profile: {
					type: 'object',
					properties: {
						id: { type: 'integer' },
						user_id: { type: 'integer' },
						full_name: { type: 'string' },
						email: { type: 'string', format: 'email' },
						phone: { type: 'string' },
						location: { type: 'string' },
						professional_summary: { type: 'string' },
						skills: { type: 'array', items: { type: 'string' } },
						completeness: { type: 'number' },
					},
				},
			},
		},
		tags: [
			{ name: 'Authentication', description: 'User authentication endpoints' },
			{ name: 'Users', description: 'User management' },
			{ name: 'Profile', description: 'User profile management' },
			{ name: 'Resume', description: 'Resume upload and management' },
			{ name: 'Jobs', description: 'Job posting management' },
			{ name: 'Applications', description: 'Job application management' },
			{ name: 'Analytics', description: 'Analytics and statistics' },
			{ name: 'Subscription', description: 'Subscription and payment management' },
			{ name: 'Onboarding', description: 'User onboarding flow' },
			{ name: 'Roles', description: 'Role management' },
		],
	},
	apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

