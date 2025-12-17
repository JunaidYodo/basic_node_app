# 🔄 NextHire MVP - Complete Project Flow

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [User Journey Flow](#user-journey-flow)
3. [Authentication Flow](#authentication-flow)
4. [Subscription Flow](#subscription-flow)
5. [Onboarding Flow](#onboarding-flow)
6. [Job Application Flow](#job-application-flow)
7. [ATS Auto-Apply Flow](#ats-auto-apply-flow)
8. [AI Generation Flow](#ai-generation-flow)
9. [Analytics Flow](#analytics-flow)
10. [Database Schema](#database-schema)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │Dashboard │  │AI Studio │  │  Jobs    │  │ Profile  │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │              │              │             │
└───────┼─────────────┼──────────────┼──────────────┼─────────────┘
        │             │              │              │
        └─────────────┴──────────────┴──────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API LAYER (Express.js)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Authentication │ Validation │ Rate Limiting │ CORS      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Routes  │→ │Controllers│→ │ Services │→ │  Utils   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
        │             │              │              │
        └─────────────┴──────────────┴──────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ OpenAI   │  │  Stripe  │  │  AWS S3  │  │   ATS    │      │
│  │  GPT-4   │  │ Payments │  │  Files   │  │Greenhouse│      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DATABASE (MySQL + Prisma)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Users   │  │  Jobs    │  │   Apps   │  │Analytics │      │
│  │ Profiles │  │ Resumes  │  │  Events  │  │ AI Logs  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Complete User Journey Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION & SETUP                    │
└─────────────────────────────────────────────────────────────────┘

Step 1: Registration
   │
   ├─→ POST /api/v1/auth/register
   │   Body: { name, email, password }
   │   Response: { user, "OTP sent to email" }
   │
   ▼
Step 2: Email Verification
   │
   ├─→ POST /api/v1/auth/verify/:userId
   │   Body: { otp: "123456" }
   │   Response: { token, user }
   │
   ▼
Step 3: Login
   │
   ├─→ POST /api/v1/auth/login
   │   Body: { email, password }
   │   Response: { token, user }
   │
   ▼
Step 4: Choose Subscription
   │
   ├─→ POST /api/v1/subscription/checkout
   │   Body: { planName: "standard" }
   │   Response: { sessionId, url }
   │   Action: Redirect to Stripe Checkout
   │
   ▼
Step 5: Stripe Payment
   │
   ├─→ [User completes payment on Stripe]
   │   Stripe redirects back with session_id
   │
   ▼
Step 6: Webhook Updates Subscription
   │
   ├─→ POST /api/v1/subscription/webhook (automatic)
   │   Event: customer.subscription.created
   │   Action: Database updated with plan details
   │
   ▼
Step 7: Onboarding Wizard Begins
   │
   └─→ Continue to Onboarding Flow...

┌─────────────────────────────────────────────────────────────────┐
│                      ONBOARDING WIZARD                          │
└─────────────────────────────────────────────────────────────────┘

Step 1: Check Onboarding Status
   │
   ├─→ GET /api/v1/onboarding/status
   │   Response: { completed: false, current_step: 0 }
   │
   ▼
Step 2: Set Preferences (Step 1)
   │
   ├─→ POST /api/v1/onboarding/step1
   │   Body: {
   │     preferred_roles: ["Software Engineer"],
   │     preferred_locations: ["Remote", "New York"],
   │     work_mode: "remote",
   │     salary_min: 80000,
   │     salary_max: 150000
   │   }
   │   Response: { next_step: 2, next_step_name: "Upload Resume" }
   │
   ▼
Step 3: Upload Resume (Step 2)
   │
   ├─→ POST /api/v1/resume/upload
   │   Body: FormData { resume: [File] }
   │   Process:
   │   1. File uploaded to AWS S3
   │   2. OpenAI parses resume
   │   3. Profile created with parsed data
   │   4. Experiences added
   │   5. Education added
   │   6. Onboarding step 2 marked complete (automatic)
   │   Response: {
   │     resume: { id, name, file_url },
   │     parsedData: { name, email, skills, experience, education },
   │     validation: { completeness: 85, missingFields: [...] }
   │   }
   │
   ▼
Step 4: Review Profile (Step 3)
   │
   ├─→ GET /api/v1/profile/complete
   │   Response: { profile, experiences, educations, completeness: 85 }
   │
   ├─→ PUT /api/v1/profile (optional - edit profile)
   │   Body: { headline, summary, linkedin_url, github_url }
   │
   ├─→ PUT /api/v1/profile/experience/:id (optional - edit experience)
   │   Body: { company, title, description }
   │
   ▼
Step 5: Confirm Profile
   │
   ├─→ POST /api/v1/onboarding/step3
   │   Body: { headline, summary, linkedin_url }
   │   Response: { 
   │     message: "Onboarding completed!",
   │     onboarding_completed: true
   │   }
   │
   ▼
Onboarding Complete → Redirect to Dashboard

┌─────────────────────────────────────────────────────────────────┐
│                    JOB APPLICATION WORKFLOW                     │
└─────────────────────────────────────────────────────────────────┘

Step 1: Import Job
   │
   ├─→ POST /api/v1/job/import
   │   Body: { url: "https://boards.greenhouse.io/company/jobs/123" }
   │   Process:
   │   1. Detect source (Greenhouse/LinkedIn/Indeed/etc)
   │   2. Scrape job details
   │   3. Parse job ID
   │   4. Store in database
   │   Response: {
   │     id: 1,
   │     source: "greenhouse",
   │     company_name: "Google",
   │     job_title: "Senior Software Engineer",
   │     description: "...",
   │     status: "active"
   │   }
   │
   ▼
Step 2: View Job Details
   │
   ├─→ GET /api/v1/job/:id
   │   Response: { job details, existing applications }
   │
   ▼
Step 3: Generate AI Content
   │
   ├─→ POST /api/v1/application/generate
   │   Body: { jobId: 1 }
   │   Process:
   │   1. Check AI generation limits
   │   2. Fetch user profile
   │   3. Fetch job description
   │   4. Call OpenAI API
   │   5. Generate tailored resume
   │   6. Generate cover letter
   │   7. Calculate match score
   │   8. Log AI usage (tokens, cost)
   │   9. Increment ai_generations_used
   │   Response: {
   │     resume: { summary, experience, skills },
   │     coverLetter: "Dear Hiring Manager...",
   │     matchScore: { score: 87, strengths: [...], gaps: [...] },
   │     tokensUsed: 2500,
   │     estimatedCost: 0.05
   │   }
   │
   ▼
Step 4: Review & Edit AI Content
   │
   ├─→ [User reviews AI-generated content on frontend]
   │   [User can edit resume and cover letter]
   │   [User approves final version]
   │
   ▼
Step 5: Create Application
   │
   ├─→ POST /api/v1/application/create
   │   Body: {
   │     jobId: 1,
   │     coverLetter: "Edited cover letter...",
   │     resumeVersionId: 1,
   │     submissionMethod: "api",
   │     notes: "Generated with AI"
   │   }
   │   Response: {
   │     id: 1,
   │     status: "draft",
   │     job: { company_name, job_title }
   │   }
   │
   ▼
Step 6: Choose Submission Method
   │
   ├─→ Option A: 1-Click ATS Auto-Apply
   │   │
   │   ├─→ POST /api/v1/application/:id/ats-apply
   │   │   Process:
   │   │   1. Check application limits
   │   │   2. Detect ATS from job source
   │   │   3. Parse job ID from URL
   │   │   4. Prepare application data
   │   │   5. Call ATS API (Greenhouse/Lever)
   │   │   6. Submit application
   │   │   7. Store candidate ID
   │   │   8. Update status to "submitted"
   │   │   9. Create event log
   │   │   10. Increment applications_used
   │   │   Response: {
   │   │     success: true,
   │   │     message: "Application submitted via greenhouse!",
   │   │     candidateId: "12345678"
   │   │   }
   │   │
   │   └─→ If ATS not supported:
   │       Response: {
   │         success: false,
   │         requiresManual: true,
   │         jobUrl: "https://..."
   │       }
   │
   └─→ Option B: Manual Submission
       │
       ├─→ [User applies manually on company website]
       │
       └─→ POST /api/v1/application/:id/submit
           Process:
           1. Check application limits
           2. Update status to "submitted"
           3. Set applied_at timestamp
           4. Create event log
           5. Increment applications_used
           6. Create analytics record
           Response: {
             status: "submitted",
             applied_at: "2025-11-06T10:05:00.000Z"
           }

┌─────────────────────────────────────────────────────────────────┐
│                  APPLICATION TRACKING                           │
└─────────────────────────────────────────────────────────────────┘

Step 1: View All Applications
   │
   ├─→ GET /api/v1/application/list?status=submitted
   │   Response: [
   │     {
   │       id: 1,
   │       status: "submitted",
   │       job: { company_name: "Google", job_title: "..." },
   │       applied_at: "2025-11-01T10:00:00.000Z",
   │       application_events: [...]
   │     }
   │   ]
   │
   ▼
Step 2: Get Interview Invitation
   │
   ├─→ [User receives interview invitation via email]
   │
   ├─→ PUT /api/v1/application/:id/status
   │   Body: {
   │     status: "interview",
   │     eventData: {
   │       interviewDate: "2025-11-15T14:00:00.000Z",
   │       interviewType: "technical",
   │       interviewer: "Jane Smith"
   │     }
   │   }
   │   Process:
   │   1. Update application status
   │   2. Store interview details
   │   3. Create event log
   │   4. Update analytics
   │   Response: { status: "interview", interview_date: "..." }
   │
   ▼
Step 3: Track Progress
   │
   ├─→ GET /api/v1/application/:id
   │   Response: {
   │     status: "interview",
   │     application_events: [
   │       { event_type: "created", created_at: "..." },
   │       { event_type: "submitted", created_at: "..." },
   │       { event_type: "interview", created_at: "..." }
   │     ]
   │   }
   │
   ▼
Step 4: Get Offer
   │
   ├─→ PUT /api/v1/application/:id/status
   │   Body: {
   │     status: "offer",
   │     eventData: {
   │       salary: 150000,
   │       benefits: "...",
   │       startDate: "2025-12-01"
   │     }
   │   }
   │   Process:
   │   1. Update to "offer" status
   │   2. Store offer details
   │   3. Create event log
   │   4. Update analytics (offer rate)
   │   Response: { status: "offer", offer_details: {...} }
   │
   ▼
Application Lifecycle Complete

┌─────────────────────────────────────────────────────────────────┐
│                     ANALYTICS & INSIGHTS                        │
└─────────────────────────────────────────────────────────────────┘

Step 1: View Dashboard
   │
   ├─→ GET /api/v1/analytics/dashboard
   │   Response: {
   │     overview: {
   │       totalApplications: 25,
   │       submittedApplications: 20,
   │       interviews: 5,
   │       offers: 2,
   │       interviewRate: 25.0,
   │       offerRate: 10.0
   │     },
   │     usage: {
   │       applications: { used: 20, limit: 50 },
   │       aiGenerations: { used: 35, limit: 100 }
   │     },
   │     recentApplications: [...],
   │     statusBreakdown: [...],
   │     sourceBreakdown: {...},
   │     weeklyTrend: [...]
   │   }
   │
   ▼
Step 2: Detailed Analytics
   │
   ├─→ GET /api/v1/analytics/detailed?startDate=2025-10-01&endDate=2025-11-06
   │   Response: {
   │     applications: { total, byStatus, bySource },
   │     timing: {
   │       avgResponseTime: 3.5 days,
   │       avgTimeToInterview: 7.2 days,
   │       avgTimeToOffer: 21.5 days
   │     },
   │     ai: {
   │       totalGenerations: 35,
   │       totalTokens: 87500,
   │       totalCost: 1.75
   │     }
   │   }
   │
   ▼
Step 3: Application Statistics
   │
   └─→ GET /api/v1/application/statistics
       Response: {
         total: 25,
         submitted: 20,
         interviews: 5,
         offers: 2,
         rejected: 8,
         conversionRate: 25.0,
         offerRate: 10.0
       }

┌─────────────────────────────────────────────────────────────────┐
│                   SUBSCRIPTION MANAGEMENT                       │
└─────────────────────────────────────────────────────────────────┘

View Current Subscription
   │
   ├─→ GET /api/v1/subscription/details
   │   Response: { plan, status, usage, limits }
   │
   ▼
Upgrade Plan
   │
   ├─→ POST /api/v1/subscription/checkout
   │   Body: { planName: "premium" }
   │   Response: { url: "https://checkout.stripe.com/..." }
   │
   ├─→ [User completes payment]
   │
   ├─→ POST /api/v1/subscription/webhook (automatic)
   │   Event: customer.subscription.updated
   │   Process: Update plan and limits in database
   │
   ▼
Manage Billing
   │
   ├─→ POST /api/v1/subscription/portal
   │   Response: { url: "https://billing.stripe.com/..." }
   │   [User redirected to Stripe billing portal]
   │   [Can update payment method, view invoices, cancel]
   │
   ▼
View Payment History
   │
   └─→ GET /api/v1/subscription/payment-history
       Response: [ { amount, date, status, receipt_url } ]

┌─────────────────────────────────────────────────────────────────┐
│                   PROFILE MANAGEMENT                            │
└─────────────────────────────────────────────────────────────────┘

View Complete Profile
   │
   ├─→ GET /api/v1/profile/complete
   │   Response: {
   │     profile: { headline, summary, skills, ... },
   │     experiences: [...],
   │     educations: [...],
   │     completeness: 85
   │   }
   │
   ▼
Update Profile
   │
   ├─→ PUT /api/v1/profile
   │   Body: { headline, summary, skills, linkedin_url }
   │   Process: Completeness recalculated automatically
   │
   ▼
Manage Experience
   │
   ├─→ POST /api/v1/profile/experience (Add)
   ├─→ GET /api/v1/profile/experience (List all)
   ├─→ GET /api/v1/profile/experience/:id (Get one)
   ├─→ PUT /api/v1/profile/experience/:id (Update)
   └─→ DELETE /api/v1/profile/experience/:id (Delete)
   │
   ▼
Manage Education
   │
   ├─→ POST /api/v1/profile/education (Add)
   ├─→ GET /api/v1/profile/education (List all)
   ├─→ PUT /api/v1/profile/education/:id (Update)
   └─→ DELETE /api/v1/profile/education/:id (Delete)
   │
   ▼
After Each Update
   │
   └─→ Completeness automatically recalculated
       Profile completeness indicator updated
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  JWT AUTHENTICATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

Client Request
     │
     ├─→ Include JWT token in header
     │   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
     │
     ▼
API Middleware (isAuth)
     │
     ├─→ Extract token from header
     │
     ├─→ Verify token signature
     │   │
     │   ├─→ Valid? Continue
     │   │
     │   └─→ Invalid? Return 401 Unauthorized
     │
     ├─→ Decode token payload
     │   { userId: 1, email: "john@example.com" }
     │
     ├─→ Fetch user from database
     │
     ├─→ Attach user to req.user
     │
     ▼
Controller Access
     │
     └─→ req.user available in all controllers
         { id, name, email, subscription_plan, ... }
```

---

## 💳 Stripe Webhook Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE WEBHOOK FLOW                          │
└─────────────────────────────────────────────────────────────────┘

User Completes Payment on Stripe
     │
     ▼
Stripe Sends Webhook Event
     │
     ├─→ POST /api/v1/subscription/webhook
     │   Headers: stripe-signature: ...
     │   Body: {
     │     type: "customer.subscription.created",
     │     data: { subscription details }
     │   }
     │
     ▼
Webhook Handler
     │
     ├─→ Verify webhook signature
     │   (ensures request is from Stripe)
     │
     ├─→ Parse event type
     │
     ├─→ Handle Event:
     │   │
     │   ├─→ customer.subscription.created
     │   │   Process:
     │   │   1. Extract customer_id and subscription_id
     │   │   2. Get plan details from price_id
     │   │   3. Update user in database:
     │   │      - subscription_plan: "standard"
     │   │      - subscription_status: "active"
     │   │      - applications_limit: 50
     │   │      - ai_generations_limit: 100
     │   │      - applications_used: 0 (reset)
     │   │      - ai_generations_used: 0 (reset)
     │   │   4. Create subscription record
     │   │
     │   ├─→ customer.subscription.updated
     │   │   Process: Update subscription details
     │   │
     │   ├─→ customer.subscription.deleted
     │   │   Process: Downgrade to free plan
     │   │
     │   ├─→ invoice.payment_succeeded
     │   │   Process: Create payment history record
     │   │
     │   └─→ invoice.payment_failed
     │       Process: Update subscription status to "past_due"
     │
     ▼
Database Updated
     │
     └─→ User's subscription and limits are current
         Next API call reflects new plan
```

---

## 🤖 AI Generation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  AI CONTENT GENERATION FLOW                     │
└─────────────────────────────────────────────────────────────────┘

User Clicks "Generate AI Content"
     │
     ├─→ POST /api/v1/application/generate
     │   Body: { jobId: 1 }
     │
     ▼
ApplicationService.generateAIContent()
     │
     ├─→ 1. Check AI generation limits
     │      if (user.ai_generations_used >= user.ai_generations_limit)
     │        return 403 Forbidden
     │
     ├─→ 2. Fetch User Profile
     │      - Name, email, phone
     │      - Headline, summary
     │      - Skills array
     │      - Experiences (company, title, dates, description)
     │      - Educations (institution, degree, field)
     │
     ├─→ 3. Fetch Job Details
     │      - Company name
     │      - Job title
     │      - Description
     │      - Requirements
     │
     ▼
Call OpenAI API (Resume Generation)
     │
     ├─→ openai.utils.js → generateResume()
     │
     ├─→ Construct Prompt:
     │   "You are an expert resume writer.
     │    Create a tailored, ATS-optimized resume...
     │    USER PROFILE: { ...profile data... }
     │    JOB DESCRIPTION: { ...job data... }
     │    Return JSON with: summary, experience, skills, education"
     │
     ├─→ Call OpenAI API
     │   model: "gpt-4"
     │   messages: [{ role: "system", content: prompt }]
     │   temperature: 0.7
     │
     ├─→ Parse Response
     │   Extract JSON from AI response
     │
     ├─→ Track Usage
     │   tokens_used: response.usage.total_tokens
     │   estimated_cost: tokens * price_per_token
     │
     ▼
Call OpenAI API (Cover Letter Generation)
     │
     ├─→ openai.utils.js → generateCoverLetter()
     │
     ├─→ Similar process as resume
     │   Generate personalized cover letter
     │
     ▼
Calculate Match Score
     │
     ├─→ openai.utils.js → calculateMatchScore()
     │
     ├─→ Analyze:
     │   - Skills match (user skills vs job requirements)
     │   - Experience relevance
     │   - Education alignment
     │
     ├─→ Return:
     │   score: 87,
     │   strengths: ["React", "Node.js", "5+ years"],
     │   gaps: ["AWS", "Docker"],
     │   recommendations: ["Highlight cloud experience"]
     │
     ▼
Log AI Usage
     │
     ├─→ Create ai_logs record:
     │   - user_id
     │   - type: "resume_generation"
     │   - model: "gpt-4"
     │   - prompt: (full prompt text)
     │   - response: (full AI response)
     │   - tokens_used: 2500
     │   - cost: 0.05
     │   - status: "success"
     │
     ▼
Update Usage Counter
     │
     ├─→ Increment user.ai_generations_used
     │
     ▼
Return to Frontend
     │
     └─→ Response: {
           resume: { summary, experience, skills, education },
           coverLetter: "Dear Hiring Manager...",
           matchScore: { score: 87, strengths: [...], gaps: [...] },
           tokensUsed: 2500,
           estimatedCost: 0.05
         }
```

---

## 🔗 ATS Auto-Apply Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              1-CLICK ATS AUTO-APPLY FLOW                        │
└─────────────────────────────────────────────────────────────────┘

User Clicks "1-Click Apply"
     │
     ├─→ POST /api/v1/application/:id/ats-apply
     │
     ▼
ApplicationService.atsAutoApply()
     │
     ├─→ 1. Validate Application
     │      - Check application exists
     │      - Check status is "draft"
     │      - Check user ownership
     │
     ├─→ 2. Check Usage Limits
     │      if (user.applications_used >= user.applications_limit)
     │        return 403 Forbidden "Upgrade your plan"
     │
     ├─→ 3. Get Job Details
     │      - source: "greenhouse"
     │      - source_url: "https://boards.greenhouse.io/..."
     │      - external_id: "1234567"
     │
     ├─→ 4. Verify ATS Support
     │      if (source === "manual")
     │        return 400 "ATS not supported for this job"
     │
     ▼
Parse Job ID from URL
     │
     ├─→ ats.utils.js → parseJobIdFromUrl()
     │
     ├─→ Example URLs:
     │   Greenhouse: /jobs/1234567 → extract "1234567"
     │   Lever: /company/posting-id → extract "posting-id"
     │   Workday: /JR123456 → extract "JR123456"
     │
     ▼
Prepare Application Data
     │
     ├─→ Split user name: firstName, lastName
     │
     ├─→ Fetch master resume
     │
     ├─→ Build payload:
     │   {
     │     firstName: "John",
     │     lastName: "Doe",
     │     email: "john@example.com",
     │     phone: "+1234567890",
     │     resumeText: JSON.stringify(parsed_resume),
     │     resumeFilename: "resume.pdf",
     │     coverLetter: "Dear Hiring Manager...",
     │     customFields: []
     │   }
     │
     ▼
Create Event Log (Attempt)
     │
     ├─→ application_events.create:
     │   - event_type: "ats_submit_attempt"
     │   - event_data: { ats: "greenhouse", jobId: "1234567" }
     │
     ▼
Call ATS API
     │
     ├─→ ats.utils.js → ATSAdapter.submitApplication()
     │
     ├─→ Route to appropriate ATS:
     │   │
     │   ├─→ Greenhouse:
     │   │   API: POST https://harvest.greenhouse.io/v1/jobs/{id}/candidates
     │   │   Auth: Basic auth with API key
     │   │   Response: { id: "12345678", ...candidate details }
     │   │
     │   ├─→ Lever:
     │   │   API: POST https://api.lever.co/v1/postings/{id}/apply
     │   │   Auth: API key in query params
     │   │   Response: { ok: true }
     │   │
     │   └─→ Workday:
     │       Response: { requiresManual: true }
     │       (Workday doesn't have public API)
     │
     ▼
Handle API Response
     │
     ├─→ Success Path:
     │   │
     │   ├─→ Update Application:
     │   │   - status: "submitted"
     │   │   - applied_at: new Date()
     │   │   - submission_method: "api"
     │   │   - external_application_id: "12345678"
     │   │
     │   ├─→ Create Success Event:
     │   │   - event_type: "submitted"
     │   │   - event_data: { method: "ats_auto_apply", candidateId: "..." }
     │   │
     │   ├─→ Increment applications_used
     │   │
     │   ├─→ Create Analytics Record:
     │   │   - metric_type: "ats_application_success"
     │   │
     │   └─→ Return: {
     │         success: true,
     │         message: "Application submitted via greenhouse!",
     │         candidateId: "12345678"
     │       }
     │
     └─→ Failure Path:
         │
         ├─→ Create Failure Event:
         │   - event_type: "ats_submit_failed"
         │   - event_data: { error: "...", requiresManual: true }
         │
         └─→ Return: {
               success: false,
               requiresManual: true,
               message: "This job requires manual application",
               jobUrl: "https://..."
             }

Frontend Handles Response
     │
     ├─→ If success: Show success message + track application
     │
     └─→ If requiresManual: Show job URL + open in new tab
```

---

## 📊 Database Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE TABLES                           │
└─────────────────────────────────────────────────────────────────┘

users
  ├─ id (PK)
  ├─ name, email, password
  ├─ role_id (FK → roles)
  ├─ subscription fields:
  │  ├─ stripe_customer_id
  │  ├─ stripe_subscription_id
  │  ├─ subscription_plan (free/standard/premium)
  │  ├─ subscription_status (active/canceled/past_due)
  │  ├─ applications_used, applications_limit
  │  └─ ai_generations_used, ai_generations_limit
  ├─ onboarding fields:
  │  ├─ onboarding_completed
  │  ├─ onboarding_step
  │  └─ onboarding_data (JSON)
  └─ created_at, updated_at

user_profiles
  ├─ id (PK)
  ├─ user_id (FK → users, unique)
  ├─ headline, summary
  ├─ skills (JSON array)
  ├─ linkedin_url, github_url, portfolio_url
  ├─ preferred_roles (JSON array)
  ├─ preferred_locations (JSON array)
  ├─ work_mode, salary_min, salary_max
  └─ completeness (0-100)

experiences
  ├─ id (PK)
  ├─ profile_id (FK → user_profiles)
  ├─ company, title, location
  ├─ start_date, end_date, is_current
  └─ description

educations
  ├─ id (PK)
  ├─ profile_id (FK → user_profiles)
  ├─ institution, degree, field
  ├─ start_date, end_date, is_current
  └─ description

resumes
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ name, file_path, file_url
  ├─ parsed_data (JSON)
  ├─ version, is_master, is_active
  └─ created_at

jobs
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ external_id, source, source_url
  ├─ company_name, job_title
  ├─ location, work_mode, salary_range
  ├─ description, requirements (JSON), benefits (JSON)
  ├─ status (active/closed/applied)
  └─ created_at

applications
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ job_id (FK → jobs)
  ├─ cover_letter
  ├─ status (draft/submitted/viewed/interview/offer/rejected)
  ├─ submission_method (manual/api/automated)
  ├─ external_application_id (from ATS)
  ├─ applied_at, interview_date, offer_date
  └─ created_at

application_events
  ├─ id (PK)
  ├─ application_id (FK → applications)
  ├─ event_type (created/submitted/interview/offer/rejected)
  ├─ event_data (JSON)
  └─ created_at

ai_logs
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ type (resume_generation/cover_letter/match_score)
  ├─ model (gpt-4)
  ├─ prompt (text)
  ├─ response (JSON)
  ├─ tokens_used, cost
  ├─ status (success/failed)
  └─ created_at

subscriptions
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ stripe_subscription_id
  ├─ plan_name, status
  ├─ current_period_start, current_period_end
  └─ created_at

payment_history
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ stripe_payment_intent_id
  ├─ amount, currency, status
  ├─ description, receipt_url
  └─ created_at

analytics
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ metric_type (application_submitted/interview/offer/ats_success)
  ├─ metric_value
  ├─ metadata (JSON)
  └─ created_at
```

---

## 🔄 Data Flow Summary

```
1. User Sign Up
   → users table

2. Onboarding
   → user_profiles table
   → users.onboarding_* fields updated

3. Resume Upload
   → resumes table
   → AWS S3 (file storage)
   → user_profiles (parsed data)
   → experiences table
   → educations table

4. Job Import
   → jobs table

5. AI Generation
   → ai_logs table (full prompt + response)
   → users.ai_generations_used incremented

6. Application Creation
   → applications table (status: draft)

7. ATS Submit
   → applications table (status: submitted, external_application_id)
   → application_events table (event log)
   → users.applications_used incremented
   → analytics table

8. Status Updates
   → applications table (status updated)
   → application_events table (new event)
   → analytics table

9. Subscription Payment
   → Stripe → Webhook
   → users table (subscription fields updated)
   → subscriptions table
   → payment_history table

10. Analytics Query
    → Read from: applications, application_events, ai_logs, analytics
    → Aggregate and calculate metrics
```

---

## 📈 Metrics & Analytics Calculations

```
Interview Rate = (Interviews / Submitted Applications) * 100
Offer Rate = (Offers / Submitted Applications) * 100
Conversion Rate = (Interviews / Submitted Applications) * 100

Average Response Time = avg(time_between_submitted_and_first_response)
Average Time to Interview = avg(time_between_submitted_and_interview)
Average Time to Offer = avg(time_between_submitted_and_offer)

AI Cost = sum(ai_logs.tokens_used) * price_per_token
Applications Used = users.applications_used
Applications Remaining = users.applications_limit - users.applications_used
```

---

**Version:** 1.0.0  
**Last Updated:** November 6, 2025  
**Project:** NextHire MVP - AI-Powered Job Application Platform

