const bcrypt = require('bcrypt')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
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

// functions
const createAdmin = async ({ email, password }) => {
    const hashPassword = bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({ data: { id: uuid.v4(), email, password: hashPassword}})
    return newAdmin
}

const giveTokenToNewAdmin = async ({ email, password }) => {
    const admin = await createAdmin({ email, password })
    const token = await jwt.sign({ id: admin.id }, jwt)
    return [ token ];
}

// routing
router.post('/register', async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
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