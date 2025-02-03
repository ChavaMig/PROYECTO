const express = require('express');
const cors = require('cors');
const knex = require('knex');

const app = express();
app.use(cors());
app.use(express.json());

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: 'database.db'
    },
    useNullAsDefault: true
});

const createTables = async () => {
    await db.schema.hasTable('pilotos').then(exists => {
        if (!exists) {
            return db.schema.createTable('pilotos', table => {
                table.increments('id').primary();
                table.string('nombre').unique().notNullable();
                table.integer('edad').notNullable();
                table.string('nacionalidad').notNullable();
            });
        }
    });

    await db.schema.hasTable('motos').then(exists => {
        if (!exists) {
            return db.schema.createTable('motos', table => {
                table.increments('id').primary();
                table.string('modelo').unique().notNullable();
                table.string('marca').notNullable();
                table.integer('año').notNullable();
                table.string('tipo').notNullable();
                table.integer('piloto_id').unsigned().references('id').inTable('pilotos').onDelete('SET NULL');
            });
        }
    });

    console.log('Tablas creadas correctamente.');
};

const insertarDatos = async () => {
    try {
        await createTables();
        
        const existingPilotos = await db('pilotos').select('id');
        if (existingPilotos.length === 0) {
            const pilotos = await db('pilotos').insert([
                { nombre: 'Marc Márquez', edad: 28, nacionalidad: 'Española' },
                { nombre: 'Valentino Rossi', edad: 42, nacionalidad: 'Italiana' }
            ]).returning('id');

            await db('motos').insert([
                { modelo: 'Yamaha R1', marca: 'Yamaha', año: 2020, tipo: 'Deportiva', piloto_id: pilotos[0].id },
                { modelo: 'Honda CB500', marca: 'Honda', año: 2019, tipo: 'Naked', piloto_id: pilotos[1].id },
                { modelo: 'Kawasaki Z900', marca: 'Kawasaki', año: 2021, tipo: 'Naked', piloto_id: pilotos[1].id }
            ]);
        }

        console.log('Datos insertados correctamente.');
    } catch (error) {
        console.error('Error al insertar datos:', error.message);
    }
};

insertarDatos();

app.get('/pilotos', async (req, res) => {
    try {
        const pilotos = await db('pilotos').select('*');
        res.json(pilotos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/pilotos', async (req, res) => {
    try {
        const { nombre, edad, nacionalidad } = req.body;
        await db('pilotos').insert({ nombre, edad, nacionalidad });
        res.status(201).json({ message: 'Piloto creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/pilotos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, edad, nacionalidad } = req.body;
        const updated = await db('pilotos').where({ id }).update({ nombre, edad, nacionalidad });

        if (updated) {
            res.status(200).json({ message: 'Piloto actualizado exitosamente' });
        } else {
            res.status(404).json({ message: 'Piloto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/pilotos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await db('motos').where({ piloto_id: id }).update({ piloto_id: null });
        const deleted = await db('pilotos').where({ id }).del();

        if (deleted) {
            res.status(200).json({ message: 'Piloto eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Piloto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/motos', async (req, res) => {
    try {
        const motos = await db('motos').select('*');
        res.json(motos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/motos', async (req, res) => {
    try {
        const { modelo, marca, año, tipo, piloto_id } = req.body;
        await db('motos').insert({ modelo, marca, año, tipo, piloto_id });
        res.status(201).json({ message: 'Moto creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/motos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { modelo, marca, año, tipo, piloto_id } = req.body;
        const updated = await db('motos').where({ id }).update({ modelo, marca, año, tipo, piloto_id });

        if (updated) {
            res.status(200).json({ message: 'Moto actualizada exitosamente' });
        } else {
            res.status(404).json({ message: 'Moto no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/motos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await db('motos').where({ id }).del();

        if (deleted) {
            res.status(200).json({ message: 'Moto eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'Moto no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`El backend ha iniciado en el puerto ${PORT}`);
});
