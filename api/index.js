require('dotenv').config();
const { sql } = require('@vercel/postgres');
const express = require('express')
const app = express();

// const fs = require('fs')
// const swaggerUi = require('swagger-ui-express');
// const YAML = require('yaml')

// const file  =  fs.readFileSync(process.cwd() + '/swagger.yaml', 'utf8')
// const swaggerDocument = YAML.parse(file)
// const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
//  customCss:
//      '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
//  customCssUrl: CSS_URL,
// }));

app.use(express.json())

const PORT = 4000;

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

const cars = [{ id: 1, plateNumber: 'ABC 123', bodyType: 'SUV', Color: 'Black', firstName: 'Angela', lastName: 'Diaz', }];
let carsID = cars.length;

// app.get('/cars', async (req, res) => {
//     if (req.query) {
//         if (req.query.id) {
//             // http://localhost:4000/cars?id=1
//             const task = await sql`SELECT * FROM cars WHERE Id =
//     ${req.query.id};`;
//             if (task.rowCount > 0) {
//                 res.json(task.rows[0]);
//             } else {
//                 res.status(404).json();
//             }
//             return;
//         }
//     }
//     const cars = await sql`SELECT * FROM cars ORDER BY Id;`;
//     res.json(cars.rows);
// });


app.get('/Cars', (req, res) => {
    if (req.query) {
        if (req.query.id) {
            // http://localhost:4000/tasks?id=1
            const car = cars.find((car) => car.id === parseInt(req.query.id));
            if (car) {
                res.json(car);
            } else {
                res.status(404).json();
            }
            return;
        }
    }
    res.json(cars);
});
// http://localhost:4000/cars/1
app.get('/Cars/:id', async (req, res) => {
    const id = req.params.id;
    const car = await sql`SELECT * FROM Cars WHERE Id =
    ${id};`;
    if (car.rowCount > 0) {
        res.json(car.rows[0]);
    } else {
        res.status(404).json();
    }
});


// http://localhost:4000/cars - { "name": "New Task" }
app.post('/Cars', async (req, res) => {
    await sql`INSERT INTO Cars (Plate, Body, Color, FirstName, LastName) 
                  VALUES ${req.body.Plate}, ${req.body.Body}, ${req.body.Color}, ${req.body.FirstName}, ${req.body.LastName});`;
    res.status(201).json();
});


//http://localhost:4000/cars/1 - { "name": "Task 1 Updated", "isDone": true } | { "name": "Task 1 Updated" } | { "isDone":  true }
app.put('/Cars/:id', async (req, res) => {
    const id = req.params.id;
    const taskUpdate = await sql`UPDATE Cars SET Name = ${(req.body.name != undefined ? req.body.name : task.name)
        }, IsDone = ${(req.body.isDone != undefined ? req.body.isDone :
            task.isDone)
        } WHERE Id = ${id};`;
    if (taskUpdate.rowCount > 0) {
        const task = await sql`SELECT * FROM Cars WHERE Id =
    ${id};`;
        res.status(200).json(task.rows[0]);
    } else {
        res.status(404).json();
    }
});

// http://localhost:4000/cars/1
app.delete('/Cars/:id', async (req, res) => {
    const id = req.params.id;
    const task = await sql`DELETE FROM Cars WHERE Id = ${id};`;
    if (task.rowCount > 0) {
        res.status(204).json();
    } else {
        res.status(404).json();
    }
});

module.exports = app

/*
Id (1, 2, 3 ...)
Plate Number (ABC 123, XYZ 1010)
Body Type (Sub-Compact, Sedan, Crossover, MPV, SUV)
Color (White, Black, Blue, Red)
First Name (Juan, Pedro)
Last Name (Dela Cruz, Penduko)

NSERT INTO Cars (ID, Plate, Body, Color, FirstName, LastName) VALUES ('Task 1', false) */