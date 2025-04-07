const pool = require('../config/database');
const bcrypt = require('bcrypt');

async function seedDatabase() {
    try {
        // Clear existing data
        await pool.query('DELETE FROM professors');
        await pool.query('DELETE FROM departments');
        await pool.query('DELETE FROM admins');

        // Seed departments
        const departments = [
            ['Computer Science', 'Study of computation and systems', 'cs_image.jpg', 'cs@university.com'],
            ['Mathematics', 'Study of numbers and patterns', 'math_image.jpg', 'math@university.com'],
        ];
        for (const dept of departments) {
            await pool.query(
                'INSERT INTO departments (name, description, image_url, contact_info) VALUES ($1, $2, $3, $4)',
                dept
            );
        }

        // Seed professors
        const professors = [
            ['Dr. Alice Smith', 'Expert in AI', 'alice.jpg', 'alice@university.com', 1],
            ['Dr. Bob Jones', 'Number theory specialist', 'bob.jpg', 'bob@university.com', 2],
        ];
        for (const prof of professors) {
            await pool.query(
                'INSERT INTO professors (name, bio, profile_image_url, email, department_id) VALUES ($1, $2, $3, $4, $5)',
                prof
            );
        }

        // Seed admins
        const hashedPassword = await bcrypt.hash('password123', 10);
        await pool.query(
            'INSERT INTO admins (username, password, email) VALUES ($1, $2, $3)',
            ['admin1', hashedPassword, 'admin1@university.com']
        );

        console.log('Database seeded successfully');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        pool.end();
    }
}

seedDatabase();
