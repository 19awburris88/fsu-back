const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

router.get('/', async (req, res, next) => {
    try {
        const profs = await prisma.professor.findMany();
        res.json(profs)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const id =+ req.params.id
        const prof = await prisma.professor.findUnique({ where: { id }})
        res.json(prof)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { name, bio, img, email, departmentId } = req.body
        const prof = await prisma.professor.create({
            data: { name, bio, img, email, departmentId }
        })
        res.json(prof)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const id =+ req.params.id
        const deleteDept = await prisma.professor.delete({ where: { id }})
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const id =+ req.params.id
        const { name, bio, img, email } = req.body
        
        const profData = {}
        if (name !== undefined) profData.name = name
        if (bio !== undefined) profData.bio = bio
        if (img !== undefined) profData.img = img
        if (email !== undefined) profData.email = email
        
        const updateProf = await prisma.professor.update({ where: { id }, data: profData})
        res.json(updateProf)
    } catch (error) {
        next(error)
    }
})