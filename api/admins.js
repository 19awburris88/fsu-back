const jsonwebtoken = require('jsonwebtoken')
const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

router.get('/', async (req, res, next) => {
    try {
        const admins = await prisma.admin.findMany()
        res.json(admins)
    } catch (error) {
        next(error)
    }
})

// register
router.post('/', async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
})

// login
router.post('/:id', async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const id =+ req.params.id
        const deleteAdmin = await prisma.admin.delete({ where: { id }})
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const id =+ req.params.id
        const { email, password } = req.body

        const adminData = {}
        if (!email === undefined) adminData.email = email
        if (!password === undefined) adminData.password = password

        const updateAdmin = await prisma.admin.update({ where: { id }, data: adminData })
        res.json(updateAdmin)
    } catch (error) {
        next(error)
    }
})