const baseURL = 'http://localhost:8080';
const motoURL = `${baseURL}/motos`;
const pilotoURL = `${baseURL}/pilotos`;

// Función para obtener y mostrar todos los pilotos
async function obtenerPilotos() {
    try {
        const response = await axios.get(pilotoURL);
        const pilotos = response.data;
        const tablaPilotos = document.getElementById('tablaPilotos').getElementsByTagName('tbody')[0];
        const selectPiloto = document.getElementById('piloto');
        tablaPilotos.innerHTML = ''; // Limpiar la tabla antes de agregar filas
        selectPiloto.innerHTML = ''; // Limpiar el select antes de agregar opciones

        pilotos.forEach(piloto => {
            const row = tablaPilotos.insertRow();
            row.insertCell(0).textContent = piloto.nombre;
            row.insertCell(1).textContent = piloto.edad;
            row.insertCell(2).textContent = piloto.nacionalidad;

            const accionesCell = row.insertCell(3);
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-warning btn-sm me-2';
            btnEditar.onclick = () => mostrarFormularioEdicionPiloto(piloto);

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.className = 'btn btn-danger btn-sm';
            btnEliminar.onclick = () => eliminarPiloto(piloto.id);

            accionesCell.appendChild(btnEditar);
            accionesCell.appendChild(btnEliminar);

            // Agregar opción al select de pilotos
            const option = document.createElement('option');
            option.value = piloto.id;
            option.textContent = piloto.nombre;
            selectPiloto.appendChild(option);
        });
    } catch (error) {
        console.error('Error al obtener los pilotos:', error);
    }
}

// Función para obtener y mostrar todas las motos
async function obtenerMotos() {
    try {
        const response = await axios.get(motoURL);
        const motos = response.data;
        const tablaMotos = document.getElementById('tablaMotos').getElementsByTagName('tbody')[0];
        tablaMotos.innerHTML = ''; // Limpiar la tabla antes de agregar filas

        // Obtener la lista de pilotos para mostrar sus nombres
        const pilotosResponse = await axios.get(pilotoURL);
        const pilotos = pilotosResponse.data;

        motos.forEach(moto => {
            const row = tablaMotos.insertRow();
            row.insertCell(0).textContent = moto.modelo;
            row.insertCell(1).textContent = moto.marca;
            row.insertCell(2).textContent = moto.año;
            row.insertCell(3).textContent = moto.tipo;

            // Mostrar el nombre del piloto o "Sin piloto"
            const piloto = pilotos.find(p => p.id === moto.piloto_id);
            row.insertCell(4).textContent = piloto ? piloto.nombre : 'Sin piloto';

            const accionesCell = row.insertCell(5);
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-warning btn-sm me-2';
            btnEditar.onclick = () => mostrarFormularioEdicionMoto(moto);

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.className = 'btn btn-danger btn-sm';
            btnEliminar.onclick = () => eliminarMoto(moto.id);

            accionesCell.appendChild(btnEditar);
            accionesCell.appendChild(btnEliminar);
        });
    } catch (error) {
        console.error('Error al obtener las motos:', error);
    }
}

// Función para agregar un nuevo piloto
async function agregarPiloto(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const edad = parseInt(document.getElementById('edad').value);
    const nacionalidad = document.getElementById('nacionalidad').value;

    try {
        await axios.post(pilotoURL, { nombre, edad, nacionalidad });
        obtenerPilotos(); // Actualizar la lista de pilotos
        document.getElementById('formPiloto').reset(); // Limpiar el formulario
    } catch (error) {
        console.error('Error al agregar el piloto:', error);
    }
}

// Función para mostrar el formulario de edición con los datos del piloto seleccionado
// Función para mostrar el formulario de edición con los datos del piloto seleccionado
function mostrarFormularioEdicionPiloto(piloto) {
    document.getElementById('nombre').value = piloto.nombre;
    document.getElementById('edad').value = piloto.edad;
    document.getElementById('nacionalidad').value = piloto.nacionalidad;

    document.getElementById('formPiloto').onsubmit = (event) => {
        event.preventDefault();
        editarPiloto(piloto.id);
    };
}

// Función para editar un piloto existente
async function editarPiloto(id) {
    const nombre = document.getElementById('nombre').value;
    const edad = parseInt(document.getElementById('edad').value);
    const nacionalidad = document.getElementById('nacionalidad').value;

    try {
        const response = await axios.put(`${pilotoURL}/${id}`, { nombre, edad, nacionalidad });
        console.log("Respuesta del servidor:", response.data);
        obtenerPilotos();
        document.getElementById('formPiloto').reset();
        document.getElementById('formPiloto').onsubmit = agregarPiloto;
    } catch (error) {
        console.error('Error al editar el piloto:', error.response ? error.response.data : error);
    }
}


// Llamar a la función para obtener pilotos y motos al cargar la página
window.onload = () => {
    obtenerPilotos();
    obtenerMotos();
};




// Función para eliminar un piloto
async function eliminarPiloto(id) {
    try {
        await axios.delete(`${pilotoURL}/${id}`);
        obtenerPilotos(); // Actualizar la lista de pilotos
        obtenerMotos(); // Actualizar la lista de motos
    } catch (error) {
        console.error('Error al eliminar el piloto:', error);
    }
}

// Función para agregar una nueva moto
async function agregarMoto(event) {
    event.preventDefault();
    const modelo = document.getElementById('modelo').value;
    const marca = document.getElementById('marca').value;
    const año = parseInt(document.getElementById('año').value);
    const tipo = document.getElementById('tipo').value;
    const piloto_id = parseInt(document.getElementById('piloto').value);

    try {
        await axios.post(motoURL, { modelo, marca, año, tipo, piloto_id });
        obtenerMotos(); // Actualizar la lista de motos
        document.getElementById('formMoto').reset(); // Limpiar el formulario
    } catch (error) {
        console.error('Error al agregar la moto:', error);
    }
}

// Función para mostrar el formulario de edición con los datos de la moto seleccionada
function mostrarFormularioEdicionMoto(moto) {
    document.getElementById('modelo').value = moto.modelo;
    document.getElementById('marca').value = moto.marca;
    document.getElementById('año').value = moto.año;
    document.getElementById('tipo').value = moto.tipo;
    document.getElementById('piloto').value = moto.piloto_id || '';
    document.getElementById('formMoto').onsubmit = (event) => editarMoto(event, moto.id);
}

// Función para editar una moto existente
async function editarMoto(event, id) {
    event.preventDefault();
    const modelo = document.getElementById('modelo').value;
    const marca = document.getElementById('marca').value;
    const año = parseInt(document.getElementById('año').value);
    const tipo = document.getElementById('tipo').value;
    const piloto_id = parseInt(document.getElementById('piloto').value);

    try {
        await axios.put(`${motoURL}/${id}`, { modelo, marca, año, tipo, piloto_id });
        obtenerMotos(); // Actualizar la lista de motos
        document.getElementById('formMoto').reset(); // Limpiar el formulario
        document.getElementById('formMoto').onsubmit = agregarMoto; // Restaurar la función original del formulario
    } catch (error) {
        console.error('Error al editar la moto:', error);
    }
}

// Función para eliminar una moto
async function eliminarMoto(id) {
    try {
        await axios.delete(`${motoURL}/${id}`);
        obtenerMotos(); // Actualizar la lista de motos
    } catch (error) {
        console.error('Error al eliminar la moto:', error);
    }
}

// Asignar eventos a los formularios
document.getElementById('formPiloto').onsubmit = agregarPiloto;
document.getElementById('formMoto').onsubmit = agregarMoto;

// Cargar los datos al iniciar la página
window.onload = () => {
    obtenerPilotos();
    obtenerMotos();
};