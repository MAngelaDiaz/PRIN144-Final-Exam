const express = require('express');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// PostgreSQL connection pool
const pool = new Pool({
    user: 'Angela Diaz',
    host: 'localhost', // Ensure the correct host (not including the port here)
    database: 'vercel',
    password: 'diaz1234',
    port: 4000,  // Port number for PostgreSQL
});

// Serve Swagger documentation
const swaggerDocument = YAML.load('./swagger.yaml'); // Ensure swagger.yaml exists in your project root
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Index route
app.get('/', (req, res) => {
    res.send('PRIN144-Final-Exam: Angela Diaz');
});

// CRUD routes for car management

// Get All Cars
app.get('/api/cars', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cars');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get a Specific Car by ID
app.get('/api/cars/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Car not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Create a New Car
app.post('/api/cars', async (req, res) => {
    const { plate_number, body_type, color, first_name, last_name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO cars (plate_number, body_type, color, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [plate_number, body_type, color, first_name, last_name]
        );
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        res.status(400).json({ error: 'Bad Request or Duplicate Entry' });
    }
});

// Update an Existing Car
app.put('/api/cars/:id', async (req, res) => {
    const { id } = req.params;
    const { plate_number, body_type, color, first_name, last_name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE cars SET plate_number=$1, body_type=$2, color=$3, first_name=$4, last_name=$5 WHERE id=$6 RETURNING *',
            [plate_number, body_type, color, first_name, last_name, id]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Car not found' });
        }
    } catch (err) {
        res.status(400).json({ error: 'Bad Request' });
    }
});

// Delete a Car
app.delete('/api/cars/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM cars WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Car not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Server setup
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
