require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

const prisma = require('./prisma')

const cors = require("cors");
app.use(cors({ origin: /localhost/ }));

app.use(express.json())
app.use(require('morgan')('dev'))

//////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/api/departments', async (req, res, next) => {
    try {
        const depts = await prisma.department.findMany();
        res.json(depts)
    } catch (error) {
        next(error)
    }
})

app.get('/api/departments/:id', async (req, res, next) => {
    try {
        const id =+ req.params.id
        const dept = await prisma.department.findUnique({ where: { id }})
        res.json(dept)
    } catch (error) {
        next(error)
    }
})

app.post('/api/departments', async (req, res, next) => {
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

app.delete('/api/departments/:id', async (req, res, next) => {
    try {
        const id =+ req.params.id
        const deleteDept = await prisma.department.delete({ where: { id }})
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

app.put('/api/departments/:id', async (req, res, next) => {
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

//////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/api/professors', async (req, res, next) => {
    try {
        const profs = await prisma.professor.findMany();
        res.json(profs)
    } catch (error) {
        next(error)
    }
})

app.get('/api/professors/:id', async (req, res, next) => {
    try {
        const id =+ req.params.id
        const prof = await prisma.professor.findUnique({ where: { id }})
        res.json(prof)
    } catch (error) {
        next(error)
    }
})

app.post('/api/professors', async (req, res, next) => {
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

app.delete('/api/professors/:id', async (req, res, next) => {
    try {
        const id =+ req.params.id
        const deleteDept = await prisma.professor.delete({ where: { id }})
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

app.put('/api/professors/:id', async (req, res, next) => {
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

//////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/api/admins', async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
})

//////////////////////////////////////////////////////////////////////////////////////////////////////
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status ?? 500;
    const message = err.message ?? 'Internal server error.';
    res.status(status).json({ message });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})