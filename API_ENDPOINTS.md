# 🚀 NextHire MVP - API Endpoints Reference
## 📍 Base Information
**Base URL:** `http://localhost:3001` (Development)  
**API Base:** `http://localhost:3001/api/v1`  
**Version:** 1.0.0  
**Last Updated:** November 7, 2025
---
## 🏥 Health Check & Utility Routes
### 1. Root Endpoint
```
GET /
```
**Purpose:** Check if API server is running  
**Auth:** None  
**Response:**
```json
{
  "status": "success",
  "message": "NextHire API Server is running",
  "version": "1.0.0",
  "timestamp": "2025-11-07T10:00:00.000Z",
  "endpoints": {
    "health": "/home",
    "seed": "/seed",
    "api": "/api/v1"
  }
}
```
### 2. Home / Health Check
```
GET /home
```
**Purpose:** Get server status with environment details  
**Auth:** None  
**Response:**
```json
{
  "status": "success",
  "message": "NextHire API Server is running",
  "version": "1.0.0",
  "timestamp": "2025-11-07T10:00:00.000Z",
  "environment": "development",
  "port": 3001
}
```
### 3. Health Status
```
GET /health
```
**Purpose:** Detailed health with uptime  
**Auth:** None  
**Response:**
```json
{
  "status": "success",
  "message": "Server is healthy",
  "uptime": 3600.5,
  "timestamp": "2025-11-07T10:00:00.000Z"
}
```
### 4. Seed Database
```
GET /seed
```
**Purpose:** Seed database with default data (Dev only)  
**Auth:** None (⚠️ Should be protected in production)  
**Response:**
```json
{
  "status": "success",
  "message": "Seeders run successfully"
}
```
---
## 🔐 Authentication (6 endpoints)
### 1. Register
```
POST /api/v1/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role_id": 2
}
```
### 2. Verify Email
```
POST /api/v1/auth/verify/:userId
```
**Body:**
```json
{
  "otp": "123456"
}
```
### 3. Login
```
POST /api/v1/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
### 4. Get Current User
```
GET /api/v1/auth/me
```
**Auth:** Bearer Token Required
### 5. Forgot Password
```
POST /api/v1/auth/forgot
```
**Body:**
```json
{
  "email": "john@example.com"
}
```
### 6. Reset Password
```
POST /api/v1/auth/reset/:resetId
```
**Body:**
```json
{
  "password": "NewSecurePass123!"
}
```
---
## 💳 Subscription & Billing (6 endpoints)
### 1. Create Checkout Session
```
POST /api/v1/subscription/checkout
```
**Auth:** Required  
**Body:**
```json
{
  "planName": "standard"
}
```
### 2. Get Subscription Details
```
GET /api/v1/subscription/details
```
**Auth:** Required
### 3. Create Billing Portal Session
```
POST /api/v1/subscription/portal
```
**Auth:** Required
### 4. Get Payment History
```
GET /api/v1/subscription/payment-history
```
**Auth:** Required
### 5. Cancel Subscription
```
POST /api/v1/subscription/cancel
```
**Auth:** Required
### 6. Stripe Webhook
```
POST /api/v1/subscription/webhook
```
**Auth:** Stripe Signature Verification
---
## 🎓 Onboarding Wizard (6 endpoints)
### 1. Get Onboarding Status
```
GET /api/v1/onboarding/status
```
**Auth:** Required
### 2. Step 1: Set Preferences
```
POST /api/v1/onboarding/step1
```
**Auth:** Required  
**Body:**
```json
{
  "preferred_roles": ["Software Engineer", "Backend Developer"],
  "preferred_locations": ["Remote", "New York"],
  "work_mode": "remote",
  "salary_min": 80000,
  "salary_max": 150000,
  "currency": "USD"
}
```
### 3. Step 2: Mark Resume Uploaded
```
POST /api/v1/onboarding/step2
```
**Auth:** Required  
**Body:**
```json
{
  "resumeId": 1
}
```
### 4. Step 3: Confirm Profile
```
POST /api/v1/onboarding/step3
```
**Auth:** Required  
**Body:**
```json
{
  "headline": "Senior Software Engineer",
  "summary": "Experienced developer...",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "github_url": "https://github.com/johndoe",
  "portfolio_url": "https://johndoe.com"
}
```
### 5. Skip Onboarding
```
POST /api/v1/onboarding/skip
```
**Auth:** Required  
**Body:**
```json
{
  "skip": true
}
```
### 6. Restart Onboarding
```
POST /api/v1/onboarding/restart
```
**Auth:** Required
---
## 👤 Profile Management (13 endpoints)
### Profile Routes
1. **Get Complete Profile**
   ```
   GET /api/v1/profile/complete
   ```
   **Auth:** Required
2. **Update Profile**
   ```
   PUT /api/v1/profile
   ```
   **Auth:** Required
### Experience Routes (5 endpoints)
3. **Create Experience**
   ```
   POST /api/v1/profile/experience
   ```
4. **Get All Experiences**
   ```
   GET /api/v1/profile/experience
   ```
5. **Get Single Experience**
   ```
   GET /api/v1/profile/experience/:id
   ```
6. **Update Experience**
   ```
   PUT /api/v1/profile/experience/:id
   ```
7. **Delete Experience**
   ```
   DELETE /api/v1/profile/experience/:id
   ```
### Education Routes (5 endpoints)
8. **Create Education**
   ```
   POST /api/v1/profile/education
   ```
9. **Get All Education**
   ```
   GET /api/v1/profile/education
   ```
10. **Get Single Education**
    ```
    GET /api/v1/profile/education/:id
    ```
11. **Update Education**
    ```
    PUT /api/v1/profile/education/:id
    ```
12. **Delete Education**
    ```
    DELETE /api/v1/profile/education/:id
    ```
---
## 📄 Resume Management (7 endpoints)
### 1. Upload Resume
```
POST /api/v1/resume/upload
```
**Auth:** Required  
**Content-Type:** multipart/form-data  
**Body:** File upload (PDF/DOCX, max 5MB)
### 2. Get All Resumes
```
GET /api/v1/resume/list
```
**Auth:** Required
### 3. Get Resume Details
```
GET /api/v1/resume/:id
```
**Auth:** Required
### 4. Delete Resume
```
DELETE /api/v1/resume/:id
```
**Auth:** Required
### 5. Set Master Resume
```
PUT /api/v1/resume/:id/set-master
```
**Auth:** Required
### 6. Get Profile (Legacy)
```
GET /api/v1/resume/profile/me
```
**Auth:** Required  
**Note:** Use `/api/v1/profile/complete` instead
### 7. Update Profile (Legacy)
```
PUT /api/v1/resume/profile/me
```
**Auth:** Required  
**Note:** Use `/api/v1/profile` instead
---
## 💼 Job Import & Management (6 endpoints)
### 1. Import Job from URL
```
POST /api/v1/job/import
```
**Auth:** Required  
**Body:**
```json
{
  "url": "https://boards.greenhouse.io/company/jobs/1234567"
}
```
**Supported:** Greenhouse, LinkedIn, Indeed, Workday, Lever, ZipRecruiter
### 2. Create Manual Job
```
POST /api/v1/job/manual
```
**Auth:** Required  
**Body:**
```json
{
  "company": "Google",
  "title": "Software Engineer",
  "description": "Job description...",
  "location": "Mountain View, CA",
  "workMode": "hybrid",
  "salary": "$120k - $180k"
}
```
### 3. Get All Jobs
```
GET /api/v1/job/list
```
**Auth:** Required  
**Query Params:** `status`, `source`, `company`, `page`, `limit`
### 4. Get Job Details
```
GET /api/v1/job/:id
```
**Auth:** Required
### 5. Update Job
```
PUT /api/v1/job/:id
```
**Auth:** Required
### 6. Delete Job
```
DELETE /api/v1/job/:id
```
**Auth:** Required
---
## 🤖 AI-Powered Applications (9 endpoints)
### 1. Generate AI Content
```
POST /api/v1/application/generate
```
**Auth:** Required  
**Body:**
```json
{
  "jobId": 1
}
```
**Returns:** AI-generated resume + cover letter + match score
### 2. Create Application
```
POST /api/v1/application/create
```
**Auth:** Required  
**Body:**
```json
{
  "jobId": 1,
  "coverLetter": "Dear Hiring Manager...",
  "resumeVersionId": 1,
  "submissionMethod": "manual"
}
```
### 3. Submit Application (Manual)
```
POST /api/v1/application/:id/submit
```
**Auth:** Required
### 4. 1-Click ATS Auto-Apply 🆕
```
POST /api/v1/application/:id/ats-apply
```
**Auth:** Required  
**Purpose:** Automatically submit application via ATS API (Greenhouse/Lever)
### 5. Get All Applications
```
GET /api/v1/application/list
```
**Auth:** Required  
**Query Params:** `status`, `jobId`, `page`, `limit`
### 6. Get Application Statistics
```
GET /api/v1/application/statistics
```
**Auth:** Required
### 7. Get Application Details
```
GET /api/v1/application/:id
```
**Auth:** Required
### 8. Update Application Status
```
PUT /api/v1/application/:id/status
```
**Auth:** Required  
**Body:**
```json
{
  "status": "interview",
  "eventData": {
    "interviewDate": "2025-11-15T14:00:00.000Z",
    "interviewType": "technical"
  }
}
```
### 9. Delete Application
```
DELETE /api/v1/application/:id
```
**Auth:** Required
---
## 📊 Analytics & Tracking (3 endpoints)
### 1. Get Dashboard Analytics
```
GET /api/v1/analytics/dashboard
```
**Auth:** Required
### 2. Get Detailed Analytics
```
GET /api/v1/analytics/detailed
```
**Auth:** Required  
**Query Params:** `startDate`, `endDate`
### 3. Export User Data (GDPR)
```
GET /api/v1/analytics/export
```
**Auth:** Required
---
## 📈 Complete Endpoint Summary
| Category | Endpoints | Auth Required |
|----------|-----------|---------------|
| Health Check | 4 | ❌ No |
| Authentication | 6 | Partial |
| Subscription | 6 | ✅ Yes (except webhook) |
| Onboarding | 6 | ✅ Yes |
| Profile | 13 | ✅ Yes |
| Resume | 7 | ✅ Yes |
| Jobs | 6 | ✅ Yes |
| Applications | 9 | ✅ Yes |
| Analytics | 3 | ✅ Yes |
| **TOTAL** | **60+** | - |
---
## 🔑 Subscription Plans
| Plan | Price | Applications | AI Generations |
|------|-------|--------------|----------------|
| Free | $0/mo | 5/month | 10/month |
| Standard | $29/mo | 50/month | 100/month |
| Premium | $79/mo | Unlimited | Unlimited |
---
## 🚨 Important Notes
1. **Health Routes** (`/`, `/home`, `/health`) - No authentication required
2. **Seed Route** (`/seed`) - Should be disabled in production
3. **Webhook Route** - Uses Stripe signature verification
4. **All API routes** - Prefix with `/api/v1`
5. **Auth Token** - Include in header: `Authorization: Bearer <token>`
---
**For detailed request/response examples, see:**
- PROJECT_FLOW.md - Complete workflow diagrams
- README.md - Project overview
- SETUP.md - Environment setup
**Version:** 1.0.0  
**Last Updated:** November 7, 2025
