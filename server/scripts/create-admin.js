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
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║     Create Admin User Script          ║');
  console.log('╚═══════════════════════════════════════╝\n');

  const name = await question('Enter admin name: ');
  const email = await question('Enter admin email: ');
  const password = await question('Enter admin password: ');

  if (!name || !email || !password) {
    console.error('\n❌ All fields are required!');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('\n❌ Password must be at least 6 characters!');
    process.exit(1);
  }

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      console.error('\n❌ User with this email already exists!');
      console.log(`   Existing user: ${existingUser.name} (${existingUser.role})`);
      process.exit(1);
    }

    // Hash password
    console.log('\n⏳ Creating admin user...');
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
    console.log('╔═══════════════════════════════════════╗');
    console.log('║         User Details                   ║');
    console.log('╠═══════════════════════════════════════╣');
    console.log(`║ Name:  ${admin.name.padEnd(28)} ║`);
    console.log(`║ Email: ${admin.email.padEnd(28)} ║`);
    console.log(`║ Role:  ${admin.role.padEnd(28)} ║`);
    console.log('╚═══════════════════════════════════════╝');
    console.log('\n💡 You can now login with these credentials at /admin/login\n');

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    process.exit(1);
  }

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

