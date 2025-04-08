const prisma = require("../prisma");

const seed = async () => {
  const createProfessors = async () => {
    const professors = [];
    await prisma.professor.createMany({ data: professors })
  };

  const createDepartments = async () => {
    const departments = [];
    await prisma.department.createMany({ data: departments })
  };

  await createProfessors();
  await createDepartments();
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });