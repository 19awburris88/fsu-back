const express = require('express');
const cors = require('cors');
require('dotenv').config();

const departmentRoutes = require('./routes/departments');
const professorRoutes = require('./routes/professors');
const adminRoutes = require('./routes/admins');

const app = express();

app.use(cors({ origin: /localhost/ }));
app.use(express.json());

app.use('/departments', departmentRoutes);
app.use('/professors', professorRoutes);
app.use('/admins', adminRoutes);

app.get('/', (req, res) => {
    res.send('Fullstack University Backend');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
