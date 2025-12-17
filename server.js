import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import responseTime from 'response-time';
import swaggerUi from 'swagger-ui-express';

import { PORT } from './config.js';
import {
	errorMiddleware,
	notFound,
	// rateLimiter
} from './middlewares/index.js';
import {
	AuthRoutes,
	RoleRoutes,
	UserRoutes,
	SubscriptionRoutes,
	ResumeRoutes,
	JobRoutes,
	ApplicationRoutes,
	AnalyticsRoutes,
	OnboardingRoutes,
	ProfileRoutes
} from './routes/index.js';
import runSeeders from './seeders/index.js';
import swaggerSpec from './swagger.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Note: Stripe webhook needs raw body, so this must come before express.json()
app.use(
	'/api/v1/subscription/webhook',
	express.raw({ type: 'application/json' }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(rateLimiter);
app.use(compression());
app.use(morgan('dev'));
app.use(responseTime());

app.use(cors({ origin: '*' }));

app.use('/public', express.static(path.join(path.resolve(), 'temp_uploads')));
app.use(express.static(path.join(path.resolve(), 'public')));

app.use(helmet());

// Health Check & Utility Routes (Define BEFORE API routes)
app.get('/', (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'NextHire API Server is running',
		version: '1.0.0',
		timestamp: new Date().toISOString(),
		endpoints: {
			health: '/home',
			seed: '/seed',
			api: '/api/v1'
		}
	});
});

app.get('/home', (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'NextHire API Server is running',
		version: '1.0.0',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development',
		port: PORT
	});
});

app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'Server is healthy',
		uptime: process.uptime(),
		timestamp: new Date().toISOString()
	});
});

app.get('/seed', (req, res) => {
	runSeeders();
	res.status(200).json({
		status: 'success',
		message: 'Seeders run successfully'
	});
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
	explorer: true,
	customCss: '.swagger-ui .topbar { display: none }',
	customSiteTitle: 'NextHire API Documentation',
}));

app.get('/api-docs.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

// API Routes
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/role', RoleRoutes);
app.use('/api/v1/subscription', SubscriptionRoutes);
app.use('/api/v1/onboarding', OnboardingRoutes);
app.use('/api/v1/profile', ProfileRoutes);
app.use('/api/v1/resume', ResumeRoutes);
app.use('/api/v1/job', JobRoutes);
app.use('/api/v1/application', ApplicationRoutes);
app.use('/api/v1/analytics', AnalyticsRoutes);


// Error handling
app.use(notFound);
app.use(errorMiddleware);

app.listen(PORT, () => {
	console.log(`
┌─────────────────────────────────────────┐
│  🚀 NextHire MVP Server Started!       │
├─────────────────────────────────────────┤
│  Environment: ${process.env.NODE_ENV || 'development'}
│  Port: ${PORT}
│  Health: http://localhost:${PORT}/home
│  Seed: http://localhost:${PORT}/seed
│  📖 API Docs: http://localhost:${PORT}/api-docs
├─────────────────────────────────────────┤
│  📚 Documentation:                      │
│     - README.md                         │
│     - SETUP.md                          │
│     - FEATURES.md                       │
│  🧪 Testing:                            │
│     - Postman collection available      │
│     - Swagger UI available              │
├─────────────────────────────────────────┤
│  Status: ✅ Ready for requests!         │
└─────────────────────────────────────────┘
	`);
});

export default app;

