# NextHire API Documentation

## Swagger UI

Comprehensive Swagger/OpenAPI documentation has been added to the Next-Hire API. All endpoints are now documented with detailed request/response schemas.

### Accessing the Documentation

Once the server is running, you can access the interactive API documentation at:

**Local Development:**
```
http://localhost:8000/api-docs
```

**Production:**
```
https://your-domain.com/api-docs
```

### Features

The Swagger documentation includes:

✅ **All API Endpoints** - Complete coverage of all routes
✅ **Request/Response Schemas** - Detailed schema definitions
✅ **Authentication** - Bearer token authentication support
✅ **Interactive Testing** - Test API endpoints directly from the browser
✅ **Example Values** - Pre-filled example requests
✅ **Response Codes** - All possible HTTP status codes documented

### API Categories

The API is organized into the following categories:

#### 🔐 Authentication
- User registration and login
- Email verification (OTP)
- Password reset
- Get logged-in user details

#### 👥 Users
- CRUD operations for users
- Bulk operations

#### 👤 Profile
- Complete profile management
- Work experience management
- Education management

#### 📄 Resume
- Upload and parse resumes (PDF/DOCX)
- Resume version management
- Set master resume

#### 💼 Jobs
- Import jobs from LinkedIn, Indeed, Glassdoor
- Manual job creation
- Job search and filtering

#### 📝 Applications
- AI-powered resume and cover letter generation
- Application creation and tracking
- Status updates
- ATS auto-apply integration
- Application statistics

#### 📊 Analytics
- Dashboard analytics
- Detailed analytics with date ranges
- User data export

#### 💳 Subscription
- Stripe integration
- Checkout session creation
- Billing portal
- Payment history
- Subscription management

#### 🚀 Onboarding
- Multi-step onboarding flow
- Preference setting
- Profile confirmation

#### 🛡️ Roles
- Role management
- CRUD operations

### Using the Documentation

#### 1. Authorization

For protected endpoints:

1. Click the **"Authorize"** button at the top right
2. Enter your JWT token in the format: `Bearer your-token-here`
3. Click **"Authorize"**
4. All subsequent requests will include the token

#### 2. Testing Endpoints

1. Click on any endpoint to expand it
2. Click **"Try it out"**
3. Fill in the required parameters
4. Click **"Execute"**
5. View the response below

#### 3. Request/Response Examples

Each endpoint includes:
- Request body schema with example values
- Response schemas for all status codes
- Parameter descriptions
- Required vs optional fields

### JSON Specification

The raw OpenAPI/Swagger JSON specification is available at:

```
http://localhost:8000/api-docs.json
```

You can use this with:
- Postman (import OpenAPI spec)
- API testing tools
- Code generators
- Documentation generators

### Documentation Location

All Swagger documentation is maintained directly in the route files:

```
routes/
├── auth.routes.js          # Authentication endpoints
├── user.routes.js          # User management
├── profile.routes.js       # Profile management
├── resume.routes.js        # Resume management
├── job.routes.js           # Job management
├── application.routes.js   # Application management
├── analytics.routes.js     # Analytics endpoints
├── subscription.routes.js  # Subscription & payments
├── onboarding.routes.js    # Onboarding flow
└── role.routes.js          # Role management
```

### Configuration

Swagger configuration is in:
```
swagger.config.js
```

This file defines:
- API information (title, version, description)
- Servers (development, production)
- Security schemes (Bearer authentication)
- Reusable schemas (User, Job, Application, etc.)
- Tags for grouping endpoints

### Updating Documentation

When adding or modifying endpoints:

1. Add JSDoc comments above the route definition:

```javascript
/**
 * @swagger
 * /your-endpoint:
 *   post:
 *     summary: Brief description
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/your-endpoint', handler);
```

2. Restart the server to see changes
3. Refresh the `/api-docs` page

### Best Practices

1. **Always document new endpoints** before pushing to production
2. **Include all possible response codes** (200, 400, 401, 404, 500, etc.)
3. **Provide example values** for better understanding
4. **Mark required fields** in request schemas
5. **Use tags consistently** to group related endpoints
6. **Keep descriptions clear** and concise

### Common Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Support

For issues with the API documentation:
1. Check the server logs for errors
2. Verify the swagger.config.js file is correct
3. Ensure all route files have valid JSDoc comments
4. Test the `/api-docs.json` endpoint

### Additional Resources

- [Swagger Documentation](https://swagger.io/docs/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)

