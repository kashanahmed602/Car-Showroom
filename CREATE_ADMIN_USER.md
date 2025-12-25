# How to Create an Admin User

There are several ways to create an admin user in the Showroom Management System. Choose the method that works best for your situation.

## Method 1: Using the Seed Script (Recommended for First Time Setup)

The seed script automatically creates a default admin user. This is the easiest method for initial setup.

### Steps:

1. Navigate to the server directory:
```bash
cd server
```

2. Run the seed script:
```bash
npm run prisma:seed
```

This will create:
- **Admin User:**
  - Email: `admin@showroom.com`
  - Password: `admin123`
  - Role: `ADMIN`

- **Employee User:**
  - Email: `employee@showroom.com`
  - Password: `employee123`
  - Role: `EMPLOYEE`

⚠️ **Important**: Change these default passwords after first login!

---

## Method 2: Using the Admin Portal (If Already Logged In as Admin)

If you're already logged in as an admin, you can create new admin users through the Employees page.

### Steps:

1. Login to the admin portal at `http://localhost:5173/admin/login`
2. Navigate to **Employees** in the sidebar
3. Click **Add New Employee** or **Create Employee**
4. Fill in the form:
   - Name
   - Email
   - Password
   - **Role: Select "ADMIN"**
   - Commission (optional, usually for employees)
5. Click **Save** or **Create**

---

## Method 3: Using the API Endpoint (Requires Admin Authentication)

You can create an admin user using the API if you have an admin token.

### Steps:

1. First, login as an existing admin to get a token:
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@showroom.com",
  "password": "admin123"
}
```

2. Use the token to create a new admin:
```bash
POST http://localhost:5000/api/employees
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "New Admin Name",
  "email": "newadmin@showroom.com",
  "password": "securepassword123",
  "role": "ADMIN",
  "isActive": true
}
```

---

## Method 4: Using Prisma Studio (Direct Database Access)

You can directly create a user in the database using Prisma Studio.

### Steps:

1. Open Prisma Studio:
```bash
cd server
npm run prisma:studio
```

2. This will open a browser at `http://localhost:5555`
3. Navigate to the **User** model
4. Click **Add record**
5. Fill in the fields:
   - `email`: Your admin email
   - `password`: **IMPORTANT** - You need to hash the password first (see below)
   - `name`: Admin name
   - `role`: Select `ADMIN`
   - `isActive`: `true`
   - `commission`: Leave null for admin

⚠️ **Password Hashing**: You cannot enter a plain password. You need to hash it first using bcrypt. Use this Node.js script:

```javascript
import bcrypt from 'bcryptjs';
const hashedPassword = await bcrypt.hash('yourpassword', 10);
console.log(hashedPassword);
```

---

## Method 5: Create a Standalone Script

Create a custom script to add admin users programmatically.

### Create `server/scripts/create-admin.js`:

```javascript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('=== Create Admin User ===\n');

  const name = await question('Enter admin name: ');
  const email = await question('Enter admin email: ');
  const password = await question('Enter admin password: ');

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    console.error('❌ User with this email already exists!');
    process.exit(1);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'ADMIN',
      isActive: true
    }
  });

  console.log('\n✅ Admin user created successfully!');
  console.log(`Email: ${admin.email}`);
  console.log(`Name: ${admin.name}`);
  console.log(`Role: ${admin.role}`);

  rl.close();
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Run the script:

```bash
cd server
node scripts/create-admin.js
```

---

## Method 6: Using cURL (Command Line)

If you have an admin token, you can use cURL:

```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "securepassword123",
    "role": "ADMIN",
    "isActive": true
  }'
```

---

## Quick Reference

### Default Admin Credentials (from seed):
- **Email**: `admin@showroom.com`
- **Password**: `admin123`

### API Endpoints:
- **Create Employee/Admin**: `POST /api/employees` (Requires ADMIN auth)
- **Login**: `POST /api/auth/login`
- **Register** (Public, but creates EMPLOYEE by default): `POST /api/auth/register`

### Important Notes:
1. ⚠️ Always change default passwords in production
2. 🔒 Admin users have full access to all features
3. 👤 Employee users have limited access
4. 🔑 Passwords are automatically hashed using bcrypt
5. ✅ Users must be `isActive: true` to login

---

## Troubleshooting

### "User already exists"
- The email is already registered. Use a different email or update the existing user.

### "Unauthorized" when creating via API
- Make sure you're logged in as an ADMIN user
- Check that your JWT token is valid and included in the Authorization header

### "Invalid role"
- Role must be exactly `ADMIN` or `EMPLOYEE` (case-sensitive)

### Can't login after creating user
- Verify `isActive` is set to `true`
- Check that the password was hashed correctly
- Ensure the email matches exactly (case-insensitive)

---

## Security Best Practices

1. **Use Strong Passwords**: Minimum 8 characters, mix of letters, numbers, and symbols
2. **Change Default Passwords**: Never use default passwords in production
3. **Limit Admin Users**: Only create admin users when necessary
4. **Regular Audits**: Review admin users periodically
5. **Two-Factor Authentication**: Consider implementing 2FA for admin accounts (future enhancement)

