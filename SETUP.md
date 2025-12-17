# NextHire MVP - Setup & Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Stripe Configuration](#stripe-configuration)
6. [AWS S3 Configuration](#aws-s3-configuration)
7. [OpenAI Configuration](#openai-configuration)
8. [Running the Application](#running-the-application)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 📌 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- ✅ **MySQL** >= 8.0 ([Download](https://dev.mysql.com/downloads/mysql/))
- ✅ **npm** or **yarn** package manager
- ✅ **Git** for version control
- ✅ **Stripe Account** ([Sign up](https://dashboard.stripe.com/register))
- ✅ **OpenAI API Key** ([Get API key](https://platform.openai.com/api-keys))
- ✅ **AWS Account** with S3 access ([Sign up](https://aws.amazon.com/))

---

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd next-hire
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env.development
```

---

## ⚙️ Environment Configuration

Edit `.env.development` with your credentials:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=mysql://username:password@localhost:3306/next_hire_local

# JWT Secrets (Generate random strings)
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this
ACCESS_TOKEN_EXPIRY=7d
OTP_TOKEN_SECRET=your-super-secret-otp-token-key-change-this
OTP_TOKEN_EXPIRY=10m

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_PASS=your-app-specific-password
FROM_EMAIL=noreply@nexthire.com
FROM_NAME=NextHire
ADMIN_EMAIL=admin@nexthire.com
SUPPORT_EMAIL=support@nexthire.com

# Frontend URL
LIVE_URL=http://localhost:3001

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_FREE_PRICE_ID=price_free
STRIPE_STANDARD_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...

# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4-turbo-preview

# AWS S3
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=nexthire-resumes

# ATS Integration (Optional)
GREENHOUSE_API_KEY=
WORKDAY_API_KEY=
LEVER_API_KEY=

# Encryption (Generate 32-character random string)
ENCRYPTION_KEY=your-32-char-encryption-key-here

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Generate Secrets

```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🗄️ Database Setup

### 1. Create MySQL Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE next_hire_local;
CREATE USER 'nexthire_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON next_hire_local.* TO 'nexthire_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Run Migrations

```bash
npm run migrate:dev
```

This will:
- Create all required tables
- Set up indexes
- Generate Prisma Client

### 3. Seed Database

Start the server and visit:
```
http://localhost:3000/seed
```

This will create:
- Default roles (User, Admin)
- Sample data (optional)

---

## 💳 Stripe Configuration

### 1. Create Stripe Account

1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Complete verification
3. Get API keys from **Developers → API keys**

### 2. Create Products & Prices

**Standard Plan ($29/month):**
```bash
stripe products create \
  --name="NextHire Standard" \
  --description="50 applications/month, 100 AI generations"

stripe prices create \
  --product=prod_xxx \
  --unit-amount=2900 \
  --currency=usd \
  --recurring[interval]=month
```

**Premium Plan ($79/month):**
```bash
stripe products create \
  --name="NextHire Premium" \
  --description="Unlimited applications and AI generations"

stripe prices create \
  --product=prod_xxx \
  --unit-amount=7900 \
  --currency=usd \
  --recurring[interval]=month
```

Copy the `price_xxx` IDs to your `.env.development` file.

### 3. Set Up Webhooks (Local Development)

Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

Login and forward webhooks:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/v1/subscription/webhook
```

Copy the webhook signing secret (starts with `whsec_`) to `STRIPE_WEBHOOK_SECRET` in `.env.development`.

### 4. Test Webhooks

In another terminal:
```bash
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

---

## ☁️ AWS S3 Configuration

### 1. Create S3 Bucket

```bash
aws s3 mb s3://nexthire-resumes --region us-east-1
```

Or via AWS Console:
1. Go to **S3 → Create bucket**
2. Name: `nexthire-resumes`
3. Region: `us-east-1`
4. Block all public access: ✅ (We'll use signed URLs)

### 2. Create IAM User

1. Go to **IAM → Users → Add user**
2. Username: `nexthire-s3-user`
3. Attach policy: `AmazonS3FullAccess` (or create custom policy)
4. Save **Access Key ID** and **Secret Access Key**

### 3. Configure CORS (Optional)

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3001", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 4. Test S3 Connection

```bash
node -e "
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const client = new S3Client({ region: 'us-east-1' });
client.send(new ListBucketsCommand({})).then(console.log);
"
```

---

## 🤖 OpenAI Configuration

### 1. Get API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy to `OPENAI_API_KEY` in `.env.development`

### 2. Add Credits

Add payment method in [Billing](https://platform.openai.com/account/billing/overview)

### 3. Set Usage Limits

Set monthly budget limits to prevent unexpected charges:
- Settings → Billing → Usage limits

### 4. Test API

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4-turbo-preview",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## 🎯 Running the Application

### Development Mode

```bash
npm run dev
```

Server runs on: `http://localhost:3000`

### Production Mode

```bash
npm run start
```

### Database Migrations

```bash
# Development
npm run migrate:dev

# Production
npm run migrate:production
```

---

## 🧪 Testing

### 1. Import Postman Collection

Import `NextHire-API.postman_collection.json` into Postman.

### 2. Test Authentication

**Register:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "role_id": 1
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

Save the `token` from response.

### 3. Test Resume Upload

```bash
curl -X POST http://localhost:3000/api/v1/resume/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

### 4. Test Job Import

```bash
curl -X POST http://localhost:3000/api/v1/job/import \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://boards.greenhouse.io/stripe/jobs/123456"
  }'
```

### 5. Test AI Generation

```bash
curl -X POST http://localhost:3000/api/v1/application/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": 1
  }'
```

---

## 🚢 Deployment

### Option 1: Render (Recommended)

1. **Create Render Account**: [render.com](https://render.com)

2. **Create Web Service**:
   - New → Web Service
   - Connect your GitHub repo
   - Name: `nexthire-api`
   - Environment: `Node`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`

3. **Add Environment Variables**:
   - Copy all variables from `.env.development`
   - Update `DATABASE_URL` to production database
   - Update `LIVE_URL` to your frontend URL

4. **Create MySQL Database**:
   - New → PostgreSQL (or use external MySQL)
   - Copy connection string to `DATABASE_URL`

5. **Deploy**:
   - Click "Create Web Service"
   - Monitor logs for successful deployment

### Option 2: Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 3: AWS EC2

1. **Launch EC2 Instance**:
   - AMI: Ubuntu 22.04
   - Instance type: t3.medium
   - Security groups: Allow ports 22, 80, 443, 3000

2. **SSH into instance**:
```bash
ssh -i your-key.pem ubuntu@ec2-xx-xx-xx-xx.compute.amazonaws.com
```

3. **Install dependencies**:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install PM2
sudo npm install -g pm2
```

4. **Clone and setup**:
```bash
git clone <your-repo>
cd next-hire
npm install
cp .env.example .env.production
nano .env.production  # Edit with production values
npm run migrate:production
```

5. **Start with PM2**:
```bash
pm2 start npm --name "nexthire-api" -- start
pm2 save
pm2 startup
```

6. **Setup Nginx reverse proxy**:
```bash
sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/nexthire
```

```nginx
server {
    listen 80;
    server_name api.nexthire.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/nexthire /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **SSL with Let's Encrypt**:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.nexthire.com
```

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u nexthire_user -p next_hire_local

# Reset password if needed
ALTER USER 'nexthire_user'@'localhost' IDENTIFIED BY 'new_password';
```

### Stripe Webhook Not Working

```bash
# Check webhook secret is correct
echo $STRIPE_WEBHOOK_SECRET

# Test webhook locally
stripe listen --forward-to localhost:3000/api/v1/subscription/webhook

# Check server logs for errors
```

### OpenAI API Errors

```bash
# Check API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check credits
# Visit: https://platform.openai.com/account/usage
```

### S3 Upload Failing

```bash
# Check credentials
aws s3 ls s3://nexthire-resumes

# Check permissions
aws iam get-user

# Test upload
aws s3 cp test.pdf s3://nexthire-resumes/test.pdf
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Migration Fails

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name fix_schema
```

---

## 📊 Monitoring

### Logs

```bash
# Development
npm run dev  # Logs to console

# Production (PM2)
pm2 logs nexthire-api
pm2 monit
```

### Health Check Endpoint

```bash
curl http://localhost:3000/home
```

### Database Monitoring

```sql
-- Check active connections
SHOW PROCESSLIST;

-- Check table sizes
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'next_hire_local'
ORDER BY (data_length + index_length) DESC;
```

---

## 🔐 Security Checklist

- [ ] Change all default passwords and secrets
- [ ] Enable SSL/TLS in production
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Set up CORS properly
- [ ] Use environment variables for all secrets
- [ ] Enable database backups
- [ ] Set up monitoring and alerting
- [ ] Implement logging
- [ ] Regular security updates

---

## 📞 Support

- **Documentation**: [docs.nexthire.com](https://docs.nexthire.com)
- **Email**: support@nexthire.com
- **Discord**: [Join our community](https://discord.gg/nexthire)
- **GitHub Issues**: [Report bugs](https://github.com/nexthire/issues)

---

## 🎉 Success!

Your NextHire MVP is now running! 

Next steps:
1. Test all API endpoints using Postman
2. Set up Stripe webhooks in production
3. Configure domain and SSL
4. Deploy frontend application
5. Set up monitoring and analytics

Happy coding! 🚀

