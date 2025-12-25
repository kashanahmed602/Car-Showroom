# Quick Start Guide

Get your Showroom Management System up and running in 5 minutes!

## Prerequisites Check

✅ Node.js installed (v18+)  
✅ PostgreSQL installed and running  
✅ Database `showroom_db` created

## Quick Setup

### 1. Backend Setup (Terminal 1)

```bash
cd server
npm install
```

Create `.env` file:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/showroom_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173
```

```bash
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
npm run dev
```

### 2. Frontend Setup (Terminal 2)

```bash
cd client
npm install
npm run dev
```

### 3. Login

Go to: `http://localhost:5173/admin/login`

**Admin Login:**
- Email: `admin@showroom.com`
- Password: `admin123`

## That's it! 🎉

Your showroom management system is now running!

## Common Commands

**Backend:**
- `npm run dev` - Start development server
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production

## Need Help?

See `SETUP.md` for detailed instructions and troubleshooting.

