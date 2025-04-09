const router = require('express').Router();
module.exports = router;

const prisma = require('../prisma');

router.get('/', async (req, res, next) => {
    try {
        const departments = await prisma.findMany();
        res.json(departments)
    } catch (error) {
        next(error)
    }
})