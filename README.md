# NextHire MVP - Backend API

NextHire is an AI-powered SaaS web application that helps job seekers land jobs faster by automating and personalizing the entire job application process.

## 🚀 Features

### Authentication & User Management
- ✅ Secure JWT-based authentication
- ✅ Role-based access control
- ✅ Email verification with OTP
- ✅ Password reset functionality
- ✅ Session management

### Subscription & Billing (Stripe Integration)
- ✅ Three-tier pricing: Free, Standard ($29/mo), Premium ($79/mo)
- ✅ Stripe Checkout for seamless payments
- ✅ Real-time webhook handling for subscription events
- ✅ Billing portal for subscription management
- ✅ Payment history tracking
- ✅ Usage limits per plan (applications and AI generations)
- ✅ 7-day free trial for paid plans

### Resume & Profile Management
- ✅ Resume upload (PDF/DOCX) with AI parsing
- ✅ Automatic profile extraction from resumes
- ✅ S3 storage for resume files
- ✅ Multiple resume versions
- ✅ Profile completeness tracking
- ✅ Experience and education management

### Job Import & Management
- ✅ Multi-platform job scraping (Greenhouse, Workday, Lever, LinkedIn, Indeed)
- ✅ Manual job entry
- ✅ Job filtering and search
- ✅ Job status tracking
- ✅ AI match scoring

### AI Personalization Engine
- ✅ OpenAI GPT-4 integration
- ✅ AI-powered resume generation tailored to each job
- ✅ Custom cover letter generation
- ✅ Resume parsing and structuring
- ✅ AI usage tracking and token counting
- ✅ Variant versioning for A/B testing

### Application Tracking & Analytics
- ✅ Complete application lifecycle tracking (Draft → Submitted → Interview → Offer)
- ✅ Application status updates with event logging
- ✅ Funnel analytics (conversion rates)
- ✅ Real-time statistics dashboard
- ✅ Performance metrics tracking

## 📋 Prerequisites

- Node.js >= 18.0.0
- MySQL database
- AWS S3 account
- Stripe account
- OpenAI API key

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd next-hire
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**

Create `.env.development` file:
```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=mysql://username:password@localhost:3306/next_hire_local

# JWT Secrets
ACCESS_TOKEN_SECRET=your-access-token-secret
ACCESS_TOKEN_EXPIRY=7d
OTP_TOKEN_SECRET=your-otp-token-secret
OTP_TOKEN_EXPIRY=10m

# Email (SMTP)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_PASS=your-smtp-password
FROM_EMAIL=noreply@nexthire.com
FROM_NAME=NextHire
ADMIN_EMAIL=admin@nexthire.com
SUPPORT_EMAIL=support@nexthire.com

# Frontend URL
LIVE_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_FREE_PRICE_ID=price_free
STRIPE_STANDARD_PRICE_ID=price_standard_monthly
STRIPE_PREMIUM_PRICE_ID=price_premium_monthly

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4-turbo-preview

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=nexthire-resumes

# ATS Integration (Optional)
GREENHOUSE_API_KEY=your_greenhouse_api_key
WORKDAY_API_KEY=your_workday_api_key
LEVER_API_KEY=your_lever_api_key

# Encryption (Generate a random 32-character key)
ENCRYPTION_KEY=your-32-character-encryption-key

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

4. **Run database migrations:**
```bash
npm run migrate:dev
```

5. **Seed the database:**
```bash
npm run dev
# Then visit: http://localhost:3000/seed
```

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role_id": 1
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Subscription Endpoints

#### Create Checkout Session
```http
POST /subscription/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "planName": "standard"
}
```

#### Get Subscription Details
```http
GET /subscription/details
Authorization: Bearer <token>
```

#### Get Billing Portal
```http
POST /subscription/portal
Authorization: Bearer <token>
```

#### Get Payment History
```http
GET /subscription/payment-history
Authorization: Bearer <token>
```

#### Cancel Subscription
```http
POST /subscription/cancel
Authorization: Bearer <token>
```

### Resume Endpoints

#### Upload Resume
```http
POST /resume/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

resume: <file>
```

#### Get All Resumes
```http
GET /resume/list
Authorization: Bearer <token>
```

#### Get Resume by ID
```http
GET /resume/:id
Authorization: Bearer <token>
```

#### Delete Resume
```http
DELETE /resume/:id
Authorization: Bearer <token>
```

#### Set Master Resume
```http
PUT /resume/:id/set-master
Authorization: Bearer <token>
```

#### Get Profile
```http
GET /resume/profile/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /resume/profile/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "headline": "Senior Software Engineer",
  "summary": "Experienced developer...",
  "skills": ["JavaScript", "React", "Node.js"],
  "linkedin_url": "https://linkedin.com/in/johndoe"
}
```

### Job Endpoints

#### Import Job from URL
```http
POST /job/import
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://boards.greenhouse.io/company/jobs/123456"
}
```

#### Create Manual Job
```http
POST /job/manual
Authorization: Bearer <token>
Content-Type: application/json

{
  "company": "Google",
  "title": "Software Engineer",
  "description": "Job description...",
  "location": "Mountain View, CA",
  "workMode": "hybrid",
  "salary": "$150k - $200k"
}
```

#### Get All Jobs
```http
GET /job/list?status=active&source=greenhouse
Authorization: Bearer <token>
```

#### Get Job by ID
```http
GET /job/:id
Authorization: Bearer <token>
```

#### Update Job
```http
PUT /job/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "closed"
}
```

#### Delete Job
```http
DELETE /job/:id
Authorization: Bearer <token>
```

### Application Endpoints

#### Generate AI Content
```http
POST /application/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": 1
}
```

#### Create Application
```http
POST /application/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": 1,
  "coverLetter": "Generated cover letter...",
  "submissionMethod": "api"
}
```

#### Submit Application
```http
POST /application/:id/submit
Authorization: Bearer <token>
```

#### Get All Applications
```http
GET /application/list?status=submitted
Authorization: Bearer <token>
```

#### Get Application Statistics
```http
GET /application/statistics
Authorization: Bearer <token>
```

#### Update Application Status
```http
PUT /application/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "interview",
  "eventData": {
    "interviewDate": "2025-11-15T10:00:00Z",
    "interviewType": "phone screen"
  }
}
```

## 🔒 Stripe Webhook Setup

1. **Install Stripe CLI:**
```bash
stripe login
```

2. **Forward webhooks to local:**
```bash
stripe listen --forward-to localhost:3000/api/v1/subscription/webhook
```

3. **Get webhook secret:**
Copy the webhook secret from the Stripe CLI output and add it to `.env.development`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. **Test webhook:**
```bash
stripe trigger payment_intent.succeeded
```

## 📊 Database Schema

The application uses MySQL with Prisma ORM. Key tables:

- **users** - User accounts with subscription info
- **subscriptions** - Subscription history
- **payment_history** - Payment records
- **user_profiles** - User profile data
- **experiences** - Work experience
- **educations** - Education history
- **resumes** - Resume files and parsed data
- **jobs** - Imported jobs
- **applications** - Job applications
- **application_events** - Application status timeline
- **ai_logs** - AI generation logs
- **ai_variants** - AI-generated content versions
- **analytics** - User metrics and analytics

## 🔐 Security Features

- AES-256 encryption for sensitive data
- JWT-based authentication
- Rate limiting
- CORS protection
- Helmet.js security headers
- Input validation with Yup
- SQL injection prevention with Prisma
- XSS protection

## 📈 Plan Limits

### Free Plan
- 5 job applications/month
- 10 AI generations/month
- Basic features

### Standard Plan - $29/month
- 50 job applications/month
- 100 AI generations/month
- AI cover letters
- ATS integration (Greenhouse)
- Application analytics

### Premium Plan - $79/month
- Unlimited applications
- Unlimited AI generations
- All ATS integrations
- Advanced analytics
- Priority support

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run prettier
```

## 📝 License

Proprietary - All rights reserved

## 👥 Team

- Backend Lead: [Your Name]
- AI Integration: [Team Member]
- DevOps: [Team Member]

## 🆘 Support

For support, email support@nexthire.com or create an issue in the repository.

## 🗺️ Roadmap

- [ ] Additional ATS integrations (Taleo, SmartRecruiters)
- [ ] Interview preparation module
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Chrome extension for one-click apply
- [ ] Team collaboration features
- [ ] White-label solutions

---

Built with ❤️ by the NextHire Team

