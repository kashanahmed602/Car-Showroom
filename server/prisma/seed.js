import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@showroom.com' },
    update: {},
    create: {
      email: 'admin@showroom.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true
    }
  });

  // Create employee
  const employeePassword = await bcrypt.hash('employee123', 10);
  const employee = await prisma.user.upsert({
    where: { email: 'employee@showroom.com' },
    update: {},
    create: {
      email: 'employee@showroom.com',
      password: employeePassword,
      name: 'John Employee',
      role: 'EMPLOYEE',
      isActive: true,
      commission: 5.0
    }
  });

  // Create sample cars (using upsert to avoid duplicates)
  const car1Data = {
    make: 'Toyota',
    model: 'Corolla',
    variant: 'XLI',
    year: 2022,
    price: 3500000,
    mileage: 15000,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    color: 'White',
    engineCapacity: 1800,
    condition: 'USED',
    vin: 'VIN001',
    chassisNumber: 'CH001',
    status: 'AVAILABLE',
    description: 'Well maintained car with full service history'
  };

  const car2Data = {
    make: 'Honda',
    model: 'Civic',
    variant: 'RS',
    year: 2023,
    price: 4500000,
    mileage: 5000,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    color: 'Black',
    engineCapacity: 1800,
    condition: 'USED',
    vin: 'VIN002',
    chassisNumber: 'CH002',
    status: 'AVAILABLE',
    description: 'Like new condition'
  };

  const car3Data = {
    make: 'Suzuki',
    model: 'Mehran',
    variant: 'VXR',
    year: 2021,
    price: 1200000,
    mileage: 30000,
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    color: 'Silver',
    engineCapacity: 800,
    condition: 'USED',
    vin: 'VIN003',
    chassisNumber: 'CH003',
    status: 'AVAILABLE',
    description: 'Economical and reliable'
  };

  const cars = await Promise.all([
    prisma.car.upsert({
      where: { vin: 'VIN001' },
      update: {},
      create: car1Data
    }),
    prisma.car.upsert({
      where: { vin: 'VIN002' },
      update: {},
      create: car2Data
    }),
    prisma.car.upsert({
      where: { vin: 'VIN003' },
      update: {},
      create: car3Data
    })
  ]);

  // Create sample customer (check if exists first)
  let customer = await prisma.customer.findFirst({
    where: { phone: '+92-300-1234567' }
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: 'Ahmed Khan',
        email: 'ahmed@example.com',
        phone: '+92-300-1234567',
        address: 'Karachi, Pakistan',
        notes: 'Regular customer'
      }
    });
  }

  // Create sample sale (only if it doesn't exist)
  const existingSale = await prisma.sale.findFirst({
    where: { carId: cars[0].id }
  });

  if (!existingSale) {
    const sale = await prisma.sale.create({
      data: {
        carId: cars[0].id,
        customerId: customer.id,
        soldById: employee.id,
        salePrice: 3400000,
        discount: 100000,
        paymentMethod: 'BANK_TRANSFER',
        invoiceNumber: 'INV-' + Date.now()
      }
    });

    // Update car status
    await prisma.car.update({
      where: { id: cars[0].id },
      data: { status: 'SOLD' }
    });
  }

  // Create sample expenses (only if they don't exist)
  const expenseCount = await prisma.expense.count();
  if (expenseCount === 0) {
    await Promise.all([
      prisma.expense.create({
        data: {
          category: 'rent',
          amount: 50000,
          description: 'Monthly rent',
          expenseDate: new Date()
        }
      }),
      prisma.expense.create({
        data: {
          category: 'utilities',
          amount: 15000,
          description: 'Electricity and water',
          expenseDate: new Date()
        }
      }),
      prisma.expense.create({
        data: {
          category: 'marketing',
          amount: 25000,
          description: 'Online advertising',
          expenseDate: new Date()
        }
      })
    ]);
  }

  // Create default settings
  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        showroomName: 'Premium Auto Showroom',
        address: '123 Main Street, Karachi',
        phone: '+92-21-1234567',
        email: 'info@showroom.com',
        taxPercentage: 5,
        currency: 'PKR'
      }
    });
  }

  console.log('\n✅ Seeding completed successfully!');
  console.log('\n📋 Default Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Admin User:');
  console.log('   Email: admin@showroom.com');
  console.log('   Password: admin123');
  console.log('\n👤 Employee User:');
  console.log('   Email: employee@showroom.com');
  console.log('   Password: employee123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n⚠️  IMPORTANT: Change these passwords after first login!');
  console.log('💡 You can now login at: http://localhost:5173/admin/login\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

