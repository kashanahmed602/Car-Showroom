# Showroom Management System

A complete production-ready full-stack web application for managing a car showroom. The system includes an admin portal for showroom owners and a public customer portal for browsing available cars.

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Recharts (for charts)

### Backend
- Node.js
- Express.js
- JWT authentication
- Multer for image uploads

### Database
- PostgreSQL
- Prisma ORM

## Features

### Admin Portal
- **Dashboard**: KPIs, charts, and analytics
- **Car Management**: Add, edit, delete cars with multiple images
- **Employee Management**: Manage employees with roles and commissions
- **Sales Management**: Create sales records and generate PDF invoices
- **Customer Management**: Store and manage customer information
- **Expense Tracking**: Track showroom expenses
- **Reports & Analytics**: Sales reports, profit analysis, employee performance
- **Settings**: Configure showroom profile, tax, currency

### Customer Portal
- **Car Listings**: Browse available cars with filters
- **Car Details**: View full specifications and image gallery
- **Wishlist**: Save favorite cars
- **Inquiry Form**: Contact showroom for inquiries

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/showroom_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173
```

4. Create the PostgreSQL database:
```bash
createdb showroom_db
```

5. Run Prisma migrations:
```bash
npm run prisma:migrate
```

6. Generate Prisma client:
```bash
npm run prisma:generate
```

7. Seed the database (optional):
```bash
npm run prisma:seed
```

8. Start the server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Default Credentials

After running the seed script, you can login with:

**Admin:**
- Email: `admin@showroom.com`
- Password: `admin123`

**Employee:**
- Email: `employee@showroom.com`
- Password: `employee123`

## Project Structure

```
showroom-management/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin portal pages
│   │   │   └── customer/  # Customer portal pages
│   │   └── App.jsx
│   └── package.json
├── server/                 # Node.js backend
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.js        # Database seed script
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── server.js      # Entry point
│   ├── uploads/           # Uploaded images
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create new car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car
- `POST /api/cars/:id/images` - Upload car images
- `DELETE /api/cars/images/:imageId` - Delete car image

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get sale by ID
- `POST /api/sales` - Create new sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale
- `GET /api/sales/:id/invoice` - Download invoice PDF

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics
- `GET /api/reports/sales` - Get sales report
- `GET /api/reports/profit` - Get profit report
- `GET /api/reports/employees` - Get employee performance
- `GET /api/reports/export/sales` - Export sales report as CSV

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

### Public API
- `GET /api/public/cars` - Get available cars (public)
- `GET /api/public/cars/:id` - Get car details (public)
- `POST /api/public/wishlist` - Add to wishlist
- `GET /api/public/wishlist/:email` - Get wishlist
- `DELETE /api/public/wishlist/:carId` - Remove from wishlist
- `POST /api/public/inquiry` - Create inquiry

## Database Schema

The application uses the following main models:
- **User**: Admin and employee accounts
- **Car**: Car inventory with images
- **Customer**: Customer information
- **Sale**: Sales records with invoice generation
- **Expense**: Showroom expenses
- **Wishlist**: Customer wishlist items
- **Inquiry**: Customer inquiries
- **Settings**: Showroom settings

## Production Deployment

1. Set `NODE_ENV=production` in the backend `.env` file
2. Update `FRONTEND_URL` to your production frontend URL
3. Use a strong `JWT_SECRET` in production
4. Configure proper CORS settings
5. Set up proper file storage (consider using cloud storage for images)
6. Use environment variables for all sensitive data
7. Set up proper database backups
8. Configure HTTPS for both frontend and backend

## License

This project is open source and available for use.


