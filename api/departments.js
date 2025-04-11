const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

router.get('/', async (req, res, next) => {
    try {
        const depts = await prisma.department.findMany();
        res.json(depts)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const id =+ req.params.id
        const dept = await prisma.department.findUnique({ where: { id }})
        res.json(dept)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { name, desc, img, email } = req.body
        const dept = await prisma.department.create({
            data: { name, desc, img, email }
        });
        res.json(dept)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const id =+ req.params.id
        const deleteDept = await prisma.department.delete({ where: { id }})
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const id =+ req.params.id
        const { name, desc, img, email } = req.body
        
        const deptData = {}
        if (name !== undefined) deptData.name = name
        if (desc !== undefined) deptData.desc = desc
        if (img !== undefined) deptData.img = img
        if (email !== undefined) deptData.email = email
        
        const updateDept = await prisma.department.update({ where: { id }, data: deptData})
        res.json(updateDept)
    } catch (error) {
        next(error)
    }
})