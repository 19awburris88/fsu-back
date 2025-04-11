const prisma = require("../prisma")
const { faker } = require("@faker-js/faker");
// const faker = require("faker");


async function main() {
  
  // Create 5 departments
  const departments = [];
  for (let i = 0; i < 5; i++) {
    const dept = await prisma.department.create({
      data: {
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        // bannerImage: faker.image.imageUrl(),
        contactInfo: faker.internet.email()
      }
    });
    departments.push(dept);
  }

  // Create 20 professors
  for (let i = 0; i < 20; i++) {
    await prisma.professor.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        bio: faker.lorem.sentences(2),
        profileImage: faker.image.avatar(),
        departmentId: faker.helpers.arrayElement(departments).id
      }
    });
  }

  // Create 1 default admin
  const bcrypt = require("bcrypt");
  const adminPassword = process.env.ADMIN_PASSWORD || require("faker").internet.password();
  await prisma.admin.create({
    data: {
      username: "admin",
      password: await bcrypt.hash(adminPassword, 10),
    },
  });
  console.log(`Admin created with password: ${adminPassword}`);

  console.log("Database seeded successfully 🚀");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
