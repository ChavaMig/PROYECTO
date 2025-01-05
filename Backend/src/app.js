const express = require('express');
const cors = require('cors');
const knex = require('knex');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos SQLite
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: 'motos.db'
    },
    useNullAsDefault: true
});

// Crear la tabla 'motos' si no existe
db.schema.hasTable('motos').then(exists => {
    if (!exists) {
        return db.schema.createTable('motos', table => {
            table.increments('id').primary();
            table.string('modelo').unique().notNullable();
            table.string('marca').notNullable();
            table.integer('año').notNullable();
            table.string('tipo').notNullable();
        });
    }
});

// Función para insertar las motos
const insertarMotos = async () => {
    try {
        // Verifica si ya hay motos en la base de datos
        const count = await db('motos').count('id as total').first();
        if (count.total === 0) {
            // Si no hay motos, inserta las tres motos predeterminadas
            await db('motos').insert([
                { modelo: 'Yamaha R1', marca: 'Yamaha', año: 2020, tipo: 'Deportiva' },
                { modelo: 'Honda CB500', marca: 'Honda', año: 2019, tipo: 'Naked' },
                { modelo: 'Kawasaki Z900', marca: 'Kawasaki', año: 2021, tipo: 'Naked' }
            ]);
            console.log('Motos insertadas correctamente');
        }
    } catch (error) {
        console.error('Error al insertar las motos:', error.message);
    }
};

// Llamada a la función de inserción al iniciar el servidor
insertarMotos();

// Obtener todas las motos
app.get('/motos', async (req, res) => {
    try {
        const motos = await db('motos').select('*');
        res.json(motos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener una moto por modelo
app.get('/motos/:modelo', async (req, res) => {
    try {
        const moto = await db('motos').select('*').where({ modelo: req.params.modelo }).first();
        if (moto) {
            res.json(moto);
        } else {
            res.status(404).json({ message: 'Moto no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear una nueva moto
app.post('/motos', async (req, res) => {
    try {
        const { modelo, marca, año, tipo } = req.body;
        await db('motos').insert({
            modelo,
            marca,
            año,
            tipo,
        });
        res.status(201).json({ message: 'Moto creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar una moto existente
app.put('/motos/:modelo', async (req, res) => {
    try {
        const { modelo, marca, año, tipo } = req.body;
        const updated = await db('motos')
            .where({ modelo: req.params.modelo })
            .update({
                modelo,
                marca,
                año,
                tipo,
            });
        if (updated) {
            res.status(200).json({ message: 'Moto actualizada exitosamente' });
        } else {
            res.status(404).json({ message: 'Moto no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar una moto
app.delete('/motos/:modelo', async (req, res) => {
    try {
        const deleted = await db('motos')
            .where({ modelo: req.params.modelo })
            .del();
        if (deleted) {
            res.status(200).json({ message: 'Moto eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'Moto no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`El backend ha iniciado en el puerto ${PORT}`);
});
