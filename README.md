# Node Base App - Enterprise Backend Boilerplate

A production-ready, database-agnostic Node.js backend boilerplate with authentication, role-based access control, and best practices built-in. **No database required to start** - uses in-memory storage for demonstration, ready for your database of choice.

## 🚀 Features

- **Authentication & Authorization**

  - JWT-based authentication (Access & OTP tokens)
  - Role-based access control (RBAC)
  - Password reset with OTP verification
  - Secure password hashing with bcrypt

- **Database Agnostic**

  - In-memory storage for instant setup
  - No database required to start
  - Easy to integrate any database (Prisma, Mongoose, Sequelize, etc.)
  - Service layer ready for your ORM of choice

- **Security**

  - Helmet.js for HTTP headers
  - Rate limiting
  - CORS protection
  - Input validation & sanitization
  - Request size limits

- **Developer Experience**

  - ES6+ with ESM modules
  - Hot reload with Nodemon
  - ESLint + Prettier
  - Husky pre-commit hooks
  - Environment-based configuration

- **Logging & Monitoring**

  - Winston logger with daily rotation
  - Separate log levels
  - Exception & rejection handlers
  - Request/Response logging with Morgan

- **API Features**
  - RESTful API structure
  - Pagination, filtering, and sorting
  - File upload support (Multer)
  - Email notifications (Nodemailer)
  - Centralized error handling
  - Health check endpoint

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- **No database required!** (uses in-memory storage)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd node-base-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file:

   ```bash
   cp .env.example .env.development
   ```

   Update `.env.development` with your configuration:

   ```env
   # ================================
   # SERVER CONFIGURATION
   # ================================
   NODE_ENV=development
   PORT=3000

   # ================================
   # JWT & AUTHENTICATION
   # ================================
   # Generate secure random strings using:
   # node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

   ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this
   ACCESS_TOKEN_EXPIRY=7d

   OTP_TOKEN_SECRET=your-super-secret-otp-token-key-change-this
   OTP_TOKEN_EXPIRY=15m

   # ================================
   # RATE LIMITING
   # ================================
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX=100

   # ================================
   # EMAIL CONFIGURATION (SMTP) - Optional
   # ================================
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   FROM_NAME=Your App Name
   FROM_EMAIL=noreply@yourapp.com

   # ================================
   # APPLICATION EMAILS
   # ================================
   ADMIN_EMAIL=admin@yourapp.com
   SUPPORT_EMAIL=support@yourapp.com

   # ================================
   # APPLICATION URLS
   # ================================
   LIVE_URL=http://localhost:3000

   # ================================
   # CORS CONFIGURATION
   # ================================
   # Comma-separated list of allowed origins
   CORS_ORIGIN=http://localhost:3000,http://localhost:5173
   ```

   > **Note:** No database configuration needed! The app uses in-memory storage by default.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   **That's it!** The server will start at `http://localhost:3000` with in-memory storage.

## 💾 Data Storage

This boilerplate uses **in-memory storage** by default:

- ✅ **No database setup required**
- ✅ **Perfect for development and testing**
- ✅ **Data persists while server is running**
- ⚠️ **Data is reset when server restarts**

### Adding Your Own Database

When you're ready to connect a database:

1. **Install your preferred database package:**

   ```bash
   # Prisma (PostgreSQL, MySQL, SQLite, SQL Server)
   npm install @prisma/client prisma

   # Mongoose (MongoDB)
   npm install mongoose

   # Sequelize (PostgreSQL, MySQL, MariaDB, SQLite, MSSQL)
   npm install sequelize mysql2
   ```

2. **Update the service files** (`services/*.js`):
   Replace the in-memory arrays with database calls while keeping the same structure.

3. **Add environment variables** for database connection in `.env.development`

See `CONTRIBUTING.md` for detailed instructions on integrating databases.

## 📁 Project Structure

```
node-base-app/
├── config.js                 # Environment configuration
├── server.js                 # Application entry point
├── configs/                  # Configuration files
│   ├── logger.configs.js     # Winston logger setup
│   ├── multer.configs.js     # File upload config
│   └── index.js
├── constants/                # Application constants
│   ├── auth.constants.js
│   ├── error.constants.js
│   ├── role.constants.js
│   └── index.js
├── controllers/              # Request handlers
│   ├── auth.controllers.js
│   ├── user.controllers.js
│   ├── role.controllers.js
│   └── index.js
├── errors/                   # Custom error classes
│   ├── app.errors.js
│   ├── validation.errors.js
│   └── index.js
├── middlewares/              # Express middlewares
│   ├── auth.middlewares.js
│   ├── error.middlewares.js
│   ├── validation.middlewares.js
│   ├── rateLimiter.middlewares.js
│   └── index.js
├── routes/                   # API routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── role.routes.js
│   └── index.js
├── services/                 # Business logic (in-memory storage)
│   ├── auth.services.js
│   ├── user.services.js
│   ├── role.services.js
│   └── index.js
├── utils/                    # Utility functions
│   ├── token.utils.js
│   ├── email.utils.js
│   ├── response.utils.js
│   ├── string.utils.js
│   └── index.js
├── validations/              # Request validation schemas
│   ├── auth.validations.js
│   ├── user.validations.js
│   └── index.js
├── logs/                     # Application logs
├── temp_uploads/             # Temporary file uploads
└── package.json
```

## 🔑 API Endpoints

### Health Check

- `GET /health` - Server health status

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/verify/:id` - Verify OTP
- `GET /api/v1/auth/resendOTP/:id` - Resend OTP
- `POST /api/v1/auth/forgot` - Forgot password
- `POST /api/v1/auth/reset/:id` - Reset password
- `GET /api/v1/auth/me` - Get logged-in user

### Users (Protected)

- `GET /api/v1/user` - Get all users (paginated)
- `GET /api/v1/user/:id` - Get user by ID
- `POST /api/v1/user` - Create new user
- `PUT /api/v1/user/:id` - Update user
- `PUT /api/v1/user` - Update multiple users
- `DELETE /api/v1/user/:id` - Soft delete user
- `DELETE /api/v1/user` - Soft delete multiple users

### Roles (Protected)

- `GET /api/v1/role` - Get all roles
- `GET /api/v1/role/:id` - Get role by ID
- `POST /api/v1/role` - Create new role
- `PUT /api/v1/role/:id` - Update role
- `DELETE /api/v1/role/:id` - Soft delete role

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run production       # Start production server
npm start               # Start production server

# Setup
npm run setup           # Interactive setup wizard

# Code Quality
npm run lint            # Run ESLint
npm run prettier        # Format code with Prettier
npm run format          # Check code formatting
npm run ci-check        # Run lint + format check
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files. Use `.env.example` as a template.

2. **JWT Secrets**: Generate strong, random secrets:

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Database**: When you add a database, use connection pooling in production and secure your credentials.

4. **In-Memory Data**: Remember that in-memory storage is reset on server restart. Add a database for production.

5. **CORS**: Specify allowed origins instead of using `*` in production.

6. **Rate Limiting**: Adjust rate limits based on your application needs.

7. **File Uploads**: Implement file size limits and type validation.

## 📧 Email Configuration

### Gmail SMTP Setup

1. Enable 2-factor authentication in your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `SMTP_PASS`

### Other SMTP Providers

Update the SMTP configuration for your provider:

- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`
- **AWS SES**: `email-smtp.region.amazonaws.com:587`

## 🗄️ Database Integration (Optional)

By default, this app uses **in-memory storage** (JavaScript arrays). When you're ready to add a database:

### Option 1: Prisma (PostgreSQL, MySQL, SQLite)

```bash
# Install Prisma
npm install @prisma/client prisma

# Initialize Prisma
npx prisma init

# Update prisma/schema.prisma with your models
# Run migration
npx prisma migrate dev --name init

# Update services to use Prisma
# Example: services/user.services.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async getAllUsers() {
  return await prisma.users.findMany();
}
```

### Option 2: Mongoose (MongoDB)

```bash
# Install Mongoose
npm install mongoose

# Connect in server.js
import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);

# Create models and update services
```

### Option 3: Sequelize (SQL Databases)

```bash
# Install Sequelize
npm install sequelize mysql2

# Set up connection and models
# Update services to use Sequelize
```

See `CONTRIBUTING.md` for detailed integration guides.

## 🚀 Deployment

### Production Environment

1. **Add a database** - In-memory storage is not suitable for production
2. Create `.env.production` with production values
3. Set `NODE_ENV=production`
4. Use strong secrets and secure database credentials
5. Configure proper CORS origins
6. Set up SSL/TLS certificates
7. Use process managers like PM2:

```bash
npm install -g pm2
pm2 start server.js --name "node-base-app"
pm2 save
pm2 startup
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Note:** Add database connection and setup steps when you integrate a database.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Standards

- Use ESLint and Prettier for code formatting
- Follow Airbnb JavaScript style guide
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Keep functions small and focused

## 📄 License

ISC License - feel free to use this boilerplate for your projects!

## 🆘 Support

For issues and questions:

- Create an issue in the repository
- Email: support@yourapp.com

## ⚡ Quick Start Example

```bash
# Install and run
npm install
npm run dev

# Server starts at http://localhost:3000

# Test the health endpoint
curl http://localhost:3000/health

# Register a user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "number": "1234567890",
    "role_id": 2
  }'
```

## 🎯 Roadmap

- [ ] Add unit and integration tests
- [ ] Add Swagger/OpenAPI documentation
- [ ] Add Redis caching layer
- [ ] Add WebSocket support
- [ ] Add GraphQL API option
- [ ] Add Docker compose setup
- [ ] Add CI/CD pipeline examples
- [ ] Add monitoring and APM integration

## 📚 Additional Documentation

- **[QUICKSTART_DATABASE_FREE.md](./QUICKSTART_DATABASE_FREE.md)** - Detailed quick start guide
- **[DATABASE_REMOVAL_COMPLETE.md](./DATABASE_REMOVAL_COMPLETE.md)** - Migration details and architecture
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines and database integration

---

**Built with ❤️ for developers who want to start fast and scale easily.**
