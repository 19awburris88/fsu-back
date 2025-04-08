const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

// Import routes
const departmentsRoutes = require('./routes/departments');
const professorsRoutes = require('./routes/professors');
const adminsRoutes = require('./routes/admin'); // Corrected path

// Middleware
app.use(cors({ origin: /localhost/ }));
app.use(express.json());

// Use routes
app.use('/departments', departmentsRoutes);
app.use('/professors', professorsRoutes);
app.use('/admins', adminsRoutes);

app.get('/', (req, res) => {
    res.send('FSU API is running!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
