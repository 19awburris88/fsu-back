const express = require("express");
const router = express.Router();
const {
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
} = require("./controllers");

const authenticateToken = require("./authMiddleware");

// Auth routes
router.post("/auth/register", registerAdmin);
router.post("/auth/login", loginAdmin);

// Public routes
router.get("/departments", getDepartments);
router.get("/departments/:id", getDepartmentById);
router.get("/professors", getProfessors);
router.get("/professors/:id", getProfessorById);

// Admin-only routes
router.post("/departments", authenticateToken, createDepartment);
router.put("/departments/:id", authenticateToken, updateDepartment);
router.delete("/departments/:id", authenticateToken, deleteDepartment);
router.post("/professors", authenticateToken, createProfessor);
router.put("/professors/:id", authenticateToken, updateProfessor);
router.delete("/professors/:id", authenticateToken, deleteProfessor);

module.exports = router;
