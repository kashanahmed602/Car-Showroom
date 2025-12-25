# Showroom Management System - Project Summary

## Overview

A complete, production-ready full-stack web application for managing a car showroom business. The system includes both an admin portal for showroom management and a public customer portal for browsing available vehicles.

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Recharts** - Chart library for analytics

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **PDFKit** - Invoice generation
- **Express Validator** - Input validation

### Database
- **PostgreSQL** - Relational database
- **Prisma ORM** - Type-safe database client

## Features

### Admin Portal Features

1. **Dashboard**
   - Key Performance Indicators (KPIs)
   - Sales charts and analytics
   - Top selling cars
   - Best performing employees
   - Monthly revenue and profit tracking

2. **Car Management**
   - Add, edit, delete cars
   - Multiple image uploads per car
   - Car specifications (make, model, year, price, etc.)
   - Status management (Available, Sold, Reserved)
   - Filtering and search functionality

3. **Employee Management**
   - Create and manage employee accounts
   - Role-based access (Admin/Employee)
   - Commission tracking
   - Employee performance metrics

4. **Sales Management**
   - Record car sales
   - Generate PDF invoices
   - Track payment methods
   - Discount management
   - Sales history

5. **Customer Management**
   - Customer database
   - Contact information
   - Purchase history
   - Customer notes

6. **Expense Tracking**
   - Categorize expenses
   - Track showroom costs
   - Expense reports

7. **Reports & Analytics**
   - Sales reports
   - Profit analysis
   - Employee performance
   - Export functionality

8. **Settings**
   - Showroom profile configuration
   - Tax percentage settings
   - Currency settings
   - Logo upload

### Customer Portal Features

1. **Car Listings**
   - Browse available cars
   - Filter by make, model, price, etc.
   - Search functionality
   - Image galleries

2. **Car Details**
   - Full specifications
   - Multiple images
   - Contact form

3. **Wishlist**
   - Save favorite cars
   - Email-based wishlist

4. **Inquiry System**
   - Contact showroom
   - Car-specific inquiries

## Database Schema

### Main Models

- **User** - Admin and employee accounts
- **Car** - Vehicle inventory
- **CarImage** - Car image storage
- **Customer** - Customer information
- **Sale** - Sales records
- **Expense** - Expense tracking
- **Wishlist** - Customer wishlist
- **Inquiry** - Customer inquiries
- **Settings** - System settings

## API Structure

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Protected Endpoints
All admin endpoints require JWT authentication and appropriate role permissions.

### Public Endpoints
Customer-facing endpoints for browsing cars and submitting inquiries.

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration
- File upload restrictions

## File Structure

```
showroom-management/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts (Auth)
│   │   ├── layouts/     # Page layouts
│   │   ├── pages/       # Page components
│   │   │   ├── admin/   # Admin portal pages
│   │   │   └── customer/# Customer portal pages
│   │   └── App.jsx      # Main app component
│   └── package.json
│
├── server/              # Node.js backend
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── seed.js       # Database seeding
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   └── server.js      # Server entry point
│   ├── uploads/          # Uploaded images
│   └── package.json
│
└── Documentation files
```

## Getting Started

1. **Setup Database**: Create PostgreSQL database
2. **Backend Setup**: Install dependencies, configure `.env`, run migrations
3. **Frontend Setup**: Install dependencies, start dev server
4. **Login**: Use default admin credentials from seed data

See `SETUP.md` for detailed instructions or `QUICK_START.md` for a quick setup guide.

## Default Credentials

After seeding:
- **Admin**: admin@showroom.com / admin123
- **Employee**: employee@showroom.com / employee123

⚠️ **Important**: Change these passwords in production!

## Development

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:5173`
- Prisma Studio: `npm run prisma:studio` (database GUI)

## Production Considerations

- Use environment variables for all secrets
- Set strong JWT_SECRET
- Configure proper CORS
- Use HTTPS
- Set up database backups
- Consider cloud storage for images
- Implement rate limiting
- Add logging and monitoring

## License

Open source - available for use and modification.

