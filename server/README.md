# ASIF TRADERS - Backend API

Production-ready backend for ASIF TRADERS building materials e-commerce platform.

## Features

- **Authentication**: JWT + 2FA (TOTP) for admin access
- **Products**: Full CRUD with categories, brands, variants, and images
- **Quote Management**: Complete quote request workflow with status tracking
- **Contact Management**: Contact form submissions with status updates
- **Lead Tracking**: Track all customer interactions (views, clicks, quotes, etc.)
- **Testimonials**: Customer feedback management
- **Settings**: Configurable company info, delivery settings
- **Admin Panel**: Full-featured admin dashboard

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt + TOTP (2FA)
- **Image Storage**: Cloudinary (optional)

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Install Dependencies

```bash
cd server
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database credentials and secrets
```

### 3. Setup Database

```bash
# Push schema to database
pnpm db:push

# Seed initial data
pnpm db:seed
```

### 4. Start Development Server

```bash
pnpm dev
```

API will be available at `http://localhost:3001/api/v1`

### 5. Access Admin Panel

Admin panel: `http://localhost:3001/admin`

Default credentials:
- Email: `admin@asiftraders.in`
- Password: `Admin@123`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Yes |
| `PORT` | Server port (default: 3001) | No |
| `CLOUDINARY_*` | Cloudinary credentials | No |
| `WHATSAPP_NUMBER` | WhatsApp business number | No |
| `FRONTEND_URL` | Frontend URL for CORS | No |

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | List all categories |
| GET | `/api/v1/categories/:slug` | Get category with products |
| GET | `/api/v1/brands` | List all brands |
| GET | `/api/v1/products` | List products (with filters) |
| GET | `/api/v1/products/featured` | Get featured products |
| GET | `/api/v1/products/:slug` | Get product details |
| POST | `/api/v1/quotes` | Submit quote request |
| POST | `/api/v1/contact` | Submit contact form |
| GET | `/api/v1/testimonials` | Get approved testimonials |
| GET | `/api/v1/leads` | Track lead event |
| GET | `/api/v1/search` | Search products |

### Admin Routes (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Admin login |
| POST | `/api/v1/auth/verify-2fa` | Verify 2FA code |
| POST | `/api/v1/auth/refresh` | Refresh token |
| GET | `/api/v1/admin/dashboard` | Dashboard stats |
| CRUD | `/api/v1/admin/products` | Manage products |
| CRUD | `/api/v1/admin/categories` | Manage categories |
| CRUD | `/api/v1/admin/brands` | Manage brands |
| CRUD | `/api/v1/admin/quotes` | Manage quotes |
| CRUD | `/api/v1/admin/contacts` | Manage contacts |
| CRUD | `/api/v1/admin/testimonials` | Manage testimonials |
| GET | `/api/v1/admin/leads` | View lead analytics |
| GET | `/api/v1/admin/settings` | View/update settings |

## Database Schema

### Core Tables

- `users` - Customer information
- `admin_users` - Admin accounts with roles
- `categories` - Product categories
- `brands` - Product brands
- `products` - Product catalog
- `product_variants` - Size/price variants
- `product_images` - Product images
- `inventory_logs` - Stock tracking
- `quote_requests` - Quote submissions
- `quote_request_items` - Quote items
- `contact_submissions` - Contact form entries
- `testimonials` - Customer reviews
- `lead_events` - All customer interactions
- `settings` - Configuration data

## 2FA Setup

1. Login to admin panel
2. Navigate to Settings
3. Enable 2FA
4. Scan QR code with authenticator app
5. Enter verification code to activate

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure proper CORS origins
4. Setup PostgreSQL with SSL
5. Use process manager (PM2) for production

```bash
pnpm build
pnpm start
```

## License

Proprietary - ASIF TRADERS
