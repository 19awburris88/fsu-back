const prisma = require("../prisma");

const seed = async () => {
  const createDepartments = async () => {
    const departments = [
      {name: 'Fullstack Development', desc: 'Make websites', img: 'image of Fullstack', email: 'fullstack@academy.com'},
      {name: 'Cybersecurity', desc: 'Protect websites', img: 'image of Cybersec', email: 'cybersecurity@fullstack.com'}
    ];
    await prisma.department.createMany({ data: departments })
  };
  
  const createProfessors = async () => {
    const professors = [
      {name: 'Mark Lawrence', bio: 'Instructor PT', img: 'image of Mark', email: 'mark@email.com', departmentId: 1},
      {name: 'Madi Bromfield', bio: 'Teacher Assistant', img: 'image of Madi', email: 'madi@email.com', departmentId: 1},
      {name: 'Pawan Benjamin', bio: 'Learner Experience Manager', img: 'image of Pawan', email: 'pawan@email.com', departmentId: 1}
    ];
    await prisma.professor.createMany({ data: professors })
  };

  const createAdmins = async () => {
    const admins = [
      {email: 'fernando@gmail.com', password: 'password'},
      {email: 'lincoln@gmail.com', password: 'woof'}
    ];
    await prisma.admin.createMany({ data: admins})
  }

  await createDepartments();
  await createProfessors();
  await createAdmins();
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });