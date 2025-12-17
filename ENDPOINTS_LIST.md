# 📍 NextHire API - Quick Endpoint Reference

**Base URL:** `http://localhost:3001`  
**API Base:** `http://localhost:3001/api/v1`  
**Last Updated:** November 7, 2025

---

## 🏥 Health & Utility (4)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Root - Check server status |
| GET | `/home` | ❌ | Health check with environment |
| GET | `/health` | ❌ | Detailed health with uptime |
| GET | `/seed` | ❌ | Seed database (Dev only) |

---

## 🔐 Authentication (6)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | ❌ | Register new user |
| POST | `/api/v1/auth/verify/:userId` | ❌ | Verify email with OTP |
| POST | `/api/v1/auth/login` | ❌ | Login user |
| GET | `/api/v1/auth/me` | ✅ | Get current user |
| POST | `/api/v1/auth/forgot` | ❌ | Request password reset |
| POST | `/api/v1/auth/reset/:resetId` | ❌ | Reset password |

---

## 💳 Subscription & Billing (6)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/subscription/checkout` | ✅ | Create Stripe checkout session |
| GET | `/api/v1/subscription/details` | ✅ | Get subscription details |
| POST | `/api/v1/subscription/portal` | ✅ | Create billing portal session |
| GET | `/api/v1/subscription/payment-history` | ✅ | Get payment history |
| POST | `/api/v1/subscription/cancel` | ✅ | Cancel subscription |
| POST | `/api/v1/subscription/webhook` | 🔒 | Stripe webhook handler |

---

## 🎓 Onboarding (6)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/onboarding/status` | ✅ | Get onboarding progress |
| POST | `/api/v1/onboarding/step1` | ✅ | Set preferences |
| POST | `/api/v1/onboarding/step2` | ✅ | Mark resume uploaded |
| POST | `/api/v1/onboarding/step3` | ✅ | Confirm profile |
| POST | `/api/v1/onboarding/skip` | ✅ | Skip onboarding |
| POST | `/api/v1/onboarding/restart` | ✅ | Restart onboarding |

---

## 👤 Profile (13)

### Profile Routes (2)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/profile/complete` | ✅ | Get complete profile with completeness |
| PUT | `/api/v1/profile` | ✅ | Update profile |

### Experience Routes (5)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/profile/experience` | ✅ | Create experience |
| GET | `/api/v1/profile/experience` | ✅ | Get all experiences |
| GET | `/api/v1/profile/experience/:id` | ✅ | Get single experience |
| PUT | `/api/v1/profile/experience/:id` | ✅ | Update experience |
| DELETE | `/api/v1/profile/experience/:id` | ✅ | Delete experience |

### Education Routes (5)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/profile/education` | ✅ | Create education |
| GET | `/api/v1/profile/education` | ✅ | Get all education |
| GET | `/api/v1/profile/education/:id` | ✅ | Get single education |
| PUT | `/api/v1/profile/education/:id` | ✅ | Update education |
| DELETE | `/api/v1/profile/education/:id` | ✅ | Delete education |

---

## 📄 Resume (7)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/resume/upload` | ✅ | Upload & parse resume (multipart) |
| GET | `/api/v1/resume/list` | ✅ | Get all resumes |
| GET | `/api/v1/resume/:id` | ✅ | Get resume details |
| DELETE | `/api/v1/resume/:id` | ✅ | Delete resume |
| PUT | `/api/v1/resume/:id/set-master` | ✅ | Set as master resume |
| GET | `/api/v1/resume/profile/me` | ✅ | Get profile (legacy) |
| PUT | `/api/v1/resume/profile/me` | ✅ | Update profile (legacy) |

---

## 💼 Jobs (6)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/job/import` | ✅ | Import job from URL |
| POST | `/api/v1/job/manual` | ✅ | Create manual job |
| GET | `/api/v1/job/list` | ✅ | Get all jobs (with filters) |
| GET | `/api/v1/job/:id` | ✅ | Get job details |
| PUT | `/api/v1/job/:id` | ✅ | Update job |
| DELETE | `/api/v1/job/:id` | ✅ | Delete job |

---

## 🤖 Applications (9)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/application/generate` | ✅ | Generate AI content |
| POST | `/api/v1/application/create` | ✅ | Create application |
| POST | `/api/v1/application/:id/submit` | ✅ | Submit manually |
| POST | `/api/v1/application/:id/ats-apply` | ✅ | 1-Click ATS auto-apply 🆕 |
| GET | `/api/v1/application/list` | ✅ | Get all applications |
| GET | `/api/v1/application/statistics` | ✅ | Get statistics |
| GET | `/api/v1/application/:id` | ✅ | Get application details |
| PUT | `/api/v1/application/:id/status` | ✅ | Update status |
| DELETE | `/api/v1/application/:id` | ✅ | Delete application |

---

## 📊 Analytics (3)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/analytics/dashboard` | ✅ | Get dashboard analytics |
| GET | `/api/v1/analytics/detailed` | ✅ | Get detailed analytics |
| GET | `/api/v1/analytics/export` | ✅ | Export user data (GDPR) |

---

## 📈 Summary

| Category | Count | Auth Required |
|----------|-------|---------------|
| Health & Utility | 4 | ❌ No |
| Authentication | 6 | Partial |
| Subscription | 6 | ✅ Yes |
| Onboarding | 6 | ✅ Yes |
| Profile | 13 | ✅ Yes |
| Resume | 7 | ✅ Yes |
| Jobs | 6 | ✅ Yes |
| Applications | 9 | ✅ Yes |
| Analytics | 3 | ✅ Yes |
| **TOTAL** | **60** | - |

---

## 🔑 Legend

- ✅ = Authentication Required (Bearer Token)
- ❌ = No Authentication Required
- 🔒 = Special Authentication (Stripe Signature)

---

## 📝 Notes

1. All API endpoints use `/api/v1` prefix except health routes
2. Authentication uses JWT Bearer tokens in header: `Authorization: Bearer <token>`
3. Webhook endpoint uses Stripe signature verification
4. `/seed` endpoint should be disabled in production

---

**For detailed request/response examples, see:**
- `API_ENDPOINTS.md` - Detailed API documentation
- `PROJECT_FLOW.md` - Complete workflow diagrams
- `README.md` - Project overview

