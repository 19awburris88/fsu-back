const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable detailed logging
});
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

// --- AUTH ---
async function registerAdmin(req, res) {
  const { username, password } = req.body;
  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) return res.status(400).json({ error: "Username exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.admin.create({ data: { username, password: hashedPassword } });
  res.status(201).json({ message: "Admin created" });
}

async function loginAdmin(req, res) {
  const { username, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !(await bcrypt.compare(password, admin.password)))
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
}

// --- DEPARTMENTS ---
async function getDepartments(req, res) {
    try {
      const departments = await prisma.department.findMany({
        include: { professors: true }  // Optional: Include related professors
      });
      res.json(departments);
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch departments" });
    }
  }
  
  async function getDepartmentById(req, res) {
    try {
      const department = await prisma.department.findUnique({
        where: { id: Number(req.params.id) },
        include: { professors: true } // Optional: Include related professors
      });
  
      if (!department) return res.status(404).json({ error: "Department not found" });
  
      res.json(department);
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch department" });
    }
  }
  
  async function createDepartment(req, res) {
    const { name, description, bannerImage, contactInfo } = req.body;
  
    try {
      const department = await prisma.department.create({
        data: {
          name,
          description,
          bannerImage,
          contactInfo
        }
      });
  
      res.status(201).json(department);
    } catch (err) {
      res.status(500).json({ error: "Unable to create department" });
    }
  }
  
  async function updateDepartment(req, res) {
    const { id } = req.params;
    const { name, description, bannerImage, contactInfo } = req.body;
    try {
      const updatedDepartment = await prisma.department.update({
        where: { id: Number(id) },
        data: { name, description, bannerImage, contactInfo },
      });
      res.json(updatedDepartment);
    } catch (err) {
      res.status(500).json({ error: "Unable to update department" });
    }
  }
  
  async function deleteDepartment(req, res) {
    const { id } = req.params;
    try {
      const department = await prisma.department.findUnique({
        where: { id: Number(id) },
      });
      if (!department) {
        return res.status(404).json({ error: "Department not found" });
      }
      await prisma.department.delete({
        where: { id: Number(id) },
      });
      res.json({ message: "Department deleted" });
    } catch (err) {
      console.error("Error deleting department:", err);
      res.status(500).json({ error: "Unable to delete department" });
    }
  }

// --- PROFESSORS ---
async function getProfessors(req, res) {
    try {
      const professors = await prisma.professor.findMany({
        include: { department: true }  // Optional: Include related department
      });
      res.json(professors);
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch professors" });
    }
  }
  
  async function getProfessorById(req, res) {
    try {
      const professor = await prisma.professor.findUnique({
        where: { id: Number(req.params.id) },
        include: { department: true }  // Optional: Include related department
      });
  
      if (!professor) return res.status(404).json({ error: "Professor not found" });
  
      res.json(professor);
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch professor" });
    }
  }
  
async function createProfessor(req, res) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    bio: Joi.string().allow("").optional(),
    profileImage: Joi.string().uri().allow("").optional(),
    departmentId: Joi.number().integer().allow(null).optional(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { name, email, bio, profileImage, departmentId } = value;
  if (departmentId) {
    const department = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!department) {
      return res.status(400).json({ error: "Department not found" });
    }
  }
  try {
    const professor = await prisma.professor.create({
      data: { name, email, bio, profileImage, departmentId },
    });
    res.status(201).json(professor);
  } catch (err) {
    res.status(500).json({ error: "Unable to create professor" });
  }
}
  
  async function updateProfessor(req, res) {
    const { id } = req.params;
    const { name, email, bio, profileImage, departmentId } = req.body;
  
    try {
      const updatedProfessor = await prisma.professor.update({
        where: { id: Number(id) },
        data: { name, email, bio, profileImage, departmentId }
      });
  
      res.json(updatedProfessor);
    } catch (err) {
      res.status(500).json({ error: "Unable to update professor" });
    }
  }
  
  async function deleteProfessor(req, res) {
    try {
      await prisma.professor.delete({
        where: { id: Number(req.params.id) }
      });
  
      res.json({ message: "Professor deleted" });
    } catch (err) {
      res.status(500).json({ error: "Unable to delete professor" });
    }
  }
  
module.exports = {
  registerAdmin,
  loginAdmin,
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getProfessors,
  getProfessorById,
  createProfessor,
  updateProfessor,
  deleteProfessor
};
