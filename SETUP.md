# Showroom Management System - Setup Guide

This guide will help you set up the Showroom Management System from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for version control)

## Step 1: Database Setup

1. **Install PostgreSQL** if you haven't already
2. **Create a new database**:
   ```bash
   # Using psql command line
   psql -U postgres
   CREATE DATABASE showroom_db;
   \q
   ```

   Or use pgAdmin to create a database named `showroom_db`

## Step 2: Backend Setup

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `server` directory with the following content:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/showroom_db?schema=public"
   
   # Replace 'username' and 'password' with your PostgreSQL credentials
   # Example: DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/showroom_db?schema=public"
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # File Upload Configuration
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5242880
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

4. **Run Prisma migrations** to create database tables:
   ```bash
   npm run prisma:migrate
   ```
   When prompted, enter a migration name (e.g., "init")

5. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

6. **Seed the database** (creates default admin user and sample data):
   ```bash
   npm run prisma:seed
   ```

7. **Start the backend server**:
   ```bash
   npm run dev
   ```

   The server should now be running on `http://localhost:5000`

## Step 3: Frontend Setup

1. **Open a new terminal** and navigate to the client directory:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend should now be running on `http://localhost:5173`

## Step 4: Access the Application

1. **Admin Portal**: Navigate to `http://localhost:5173/admin/login`

2. **Default Login Credentials** (created by seed script):
   - **Admin Account**:
     - Email: `admin@showroom.com`
     - Password: `admin123`
   
   - **Employee Account**:
     - Email: `employee@showroom.com`
     - Password: `employee123`

3. **Customer Portal**: Navigate to `http://localhost:5173` (public homepage)

## Project Structure

```
showroom-management/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin portal pages
│   │   │   └── customer/  # Customer portal pages
│   │   └── App.jsx
│   └── package.json
│
├── server/                 # Node.js Backend
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
│
└── README.md
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify your database credentials in the `.env` file
- Check that the database `showroom_db` exists
- Make sure the DATABASE_URL format is correct

### Port Already in Use

- Backend: Change `PORT` in `.env` file
- Frontend: Change port in `vite.config.js` or use `npm run dev -- --port 3000`

### Prisma Issues

- Run `npm run prisma:generate` after schema changes
- If migrations fail, you may need to reset: `npx prisma migrate reset` (WARNING: This deletes all data)

### CORS Errors

- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that both servers are running

## Next Steps

1. **Change default passwords** after first login
2. **Update showroom settings** in the admin panel
3. **Add your first car** to the inventory
4. **Create employee accounts** as needed
5. **Customize the showroom** branding and information

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use a strong, unique `JWT_SECRET`
3. Update `FRONTEND_URL` to your production domain
4. Configure proper database backups
5. Use environment variables for all sensitive data
6. Set up HTTPS for both frontend and backend
7. Consider using cloud storage for images instead of local uploads

## Support

If you encounter any issues, check:
- Node.js and PostgreSQL versions
- All dependencies are installed
- Environment variables are set correctly
- Both servers are running
- Database is accessible

