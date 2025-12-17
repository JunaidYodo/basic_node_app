# Quick Start Guide - Swagger API Documentation

## 🚀 Quick Start

### 1. Start the Server

```bash
npm run dev
```

### 2. Open Swagger UI

Open your browser and navigate to:
```
http://localhost:8000/api-docs
```

### 3. Authenticate (For Protected Routes)

1. Click the **"Authorize"** button (🔒 icon at top right)
2. Enter your JWT token in the format:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Click **"Authorize"**
4. Click **"Close"**

All protected endpoints will now include your authentication token automatically.

### 4. Test an Endpoint

**Example: Login**

1. Scroll to **Authentication** section
2. Click on `POST /auth/login`
3. Click **"Try it out"**
4. Edit the request body:
   ```json
   {
     "email": "john@example.com",
     "password": "yourpassword"
   }
   ```
5. Click **"Execute"**
6. View the response below

**Example: Upload Resume**

1. First, authenticate using the token from login
2. Scroll to **Resume** section
3. Click on `POST /resume/upload`
4. Click **"Try it out"**
5. Click **"Choose File"** and select your resume (PDF or DOCX)
6. Click **"Execute"**
7. View the parsed resume data in the response

## 📋 Common Workflows

### Workflow 1: User Registration & Login

1. **POST /auth/register** - Register new user
2. **POST /auth/verify/{id}** - Verify email with OTP
3. **POST /auth/login** - Login and get JWT token
4. **Authorize** - Add token to Swagger
5. **GET /auth/me** - Get user details

### Workflow 2: Complete Profile Setup

1. **POST /resume/upload** - Upload resume
2. **GET /profile/complete** - View profile
3. **PUT /profile** - Update profile details
4. **POST /profile/experience** - Add work experience
5. **POST /profile/education** - Add education

### Workflow 3: Job Application Process

1. **POST /job/import** - Import job from LinkedIn/Indeed
2. **POST /application/generate** - Generate AI resume & cover letter
3. **POST /application/create** - Create application
4. **POST /application/{id}/submit** - Submit application
5. **GET /application/list** - View all applications

### Workflow 4: Analytics & Tracking

1. **GET /analytics/dashboard** - View dashboard stats
2. **GET /analytics/detailed** - Get detailed analytics
3. **GET /application/statistics** - Application statistics

## 🔑 Getting Your JWT Token

### Method 1: From Swagger UI

1. Use `POST /auth/login` endpoint in Swagger
2. Copy the `token` from the response
3. Use it in the Authorize dialog

### Method 2: From Postman/cURL

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

Copy the token from the response.

## 📊 API Categories Overview

| Category | Endpoints | Authentication Required |
|----------|-----------|------------------------|
| **Authentication** | 8 | Mixed (some public) |
| **Users** | 7 | Yes (most) |
| **Profile** | 11 | Yes |
| **Resume** | 6 | Yes |
| **Jobs** | 6 | Yes |
| **Applications** | 9 | Yes |
| **Analytics** | 3 | Yes |
| **Subscription** | 6 | Mixed |
| **Onboarding** | 6 | Yes |
| **Roles** | 6 | Yes (most) |

## 🎯 Tips & Tricks

### Filter by Tag
Click on any tag (e.g., "Authentication", "Jobs") to show only those endpoints.

### Search Endpoints
Use the search box at the top to find specific endpoints.

### Copy as cURL
After executing a request, click the **"Copy"** button to get the cURL command.

### View Schemas
Scroll to the bottom of Swagger UI to see all schema definitions.

### Download Spec
Get the OpenAPI JSON specification:
```
http://localhost:8000/api-docs.json
```

### Use with Postman
1. In Postman, click **Import**
2. Select **Link** tab
3. Enter: `http://localhost:8000/api-docs.json`
4. Click **Continue**

## ⚠️ Troubleshooting

### Swagger UI Not Loading
- Check if server is running: `npm run dev`
- Verify port 8000 is not in use
- Clear browser cache
- Check console for errors

### 401 Unauthorized Error
- Make sure you've authenticated
- Check if token is expired
- Verify token format: `Bearer <token>`
- Re-login to get a fresh token

### 400 Bad Request
- Check required fields in request body
- Verify data types match schema
- Check parameter formats
- Review validation errors in response

### File Upload Not Working
- Ensure file is PDF or DOCX
- Check file size (max 5MB)
- Use correct field name: `resume`
- Select file in form, don't paste path

## 📱 Mobile/Tablet Access

Swagger UI is responsive and works on mobile devices:
1. Connect to same network as server
2. Find server IP: `ipconfig` or `ifconfig`
3. Navigate to: `http://<server-ip>:8000/api-docs`

## 🔄 Updating Documentation

When you add/modify endpoints:

1. Edit the route file
2. Add/update JSDoc comments
3. Save the file
4. Restart the server
5. Refresh `/api-docs` in browser

## 📚 Learning Resources

- **Swagger Editor**: https://editor.swagger.io/
- **OpenAPI Spec**: https://swagger.io/specification/
- **JSDoc Format**: See existing route files for examples

## 🎓 Example Request Bodies

### Register User
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

### Create Manual Job
```json
{
  "company_name": "Tech Corp",
  "job_title": "Senior Software Engineer",
  "location": "San Francisco, CA",
  "job_type": "full-time",
  "salary_range": "$120k - $180k",
  "description": "We're looking for a talented engineer..."
}
```

### Update Profile
```json
{
  "full_name": "John Doe",
  "location": "San Francisco, CA",
  "professional_summary": "Experienced software engineer...",
  "skills": ["JavaScript", "React", "Node.js", "Python"],
  "linkedin_url": "https://linkedin.com/in/johndoe"
}
```

## 🌟 Best Practices

1. **Always authenticate first** for protected endpoints
2. **Use example values** as templates
3. **Check response codes** to understand what happened
4. **Read error messages** for troubleshooting
5. **Test in order** (register → login → use API)

## 🆘 Support

If you encounter issues:
1. Check server logs in terminal
2. Review this quick start guide
3. Check SWAGGER_DOCS.md for detailed info
4. Verify your request matches the schema

---

**Happy API Testing! 🚀**

