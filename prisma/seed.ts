import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password for admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@commerceflow.com' },
    update: {},
    create: {
      email: 'admin@commerceflow.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
    },
  });

  console.log('✅ Admin user created:', {
    email: admin.email,
    role: admin.role,
  });

  // Create some sample categories
  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
    },
  });

  const clothing = await prisma.category.upsert({
    where: { name: 'Clothing' },
    update: {},
    create: {
      name: 'Clothing',
    },
  });

  console.log('✅ Categories created');

  // Create sample products
  const laptop = await prisma.product.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Laptop Dell XPS 15',
      description: 'High-performance laptop for professionals',
      price: 1299.99,
      isActive: true,
      categoryId: electronics.id,
    },
  });

  const tshirt = await prisma.product.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Cotton T-Shirt',
      description: 'Comfortable cotton t-shirt',
      price: 19.99,
      isActive: true,
      categoryId: clothing.id,
    },
  });

  console.log('✅ Products created');

  // Create SKUs for products
  await prisma.sKU.upsert({
    where: { productId: laptop.id },
    update: {},
    create: {
      productId: laptop.id,
      stock: 50,
      reserved: 0,
    },
  });

  await prisma.sKU.upsert({
    where: { productId: tshirt.id },
    update: {},
    create: {
      productId: tshirt.id,
      stock: 200,
      reserved: 0,
    },
  });

  console.log('✅ SKUs created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
