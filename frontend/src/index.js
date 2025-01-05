// URL base del backend
const baseURL = 'http://localhost:8080/motos';

// Función para obtener y mostrar todas las motos
async function obtenerMotos() {
    try {
        const response = await axios.get(baseURL);
        const motos = response.data;
        const listaMotos = document.getElementById('listaMotos');
        listaMotos.innerHTML = ''; // Limpiar la lista antes de agregar elementos
        motos.forEach(moto => {
            const li = document.createElement('li');
            li.textContent = `${moto.modelo} (${moto.marca}, ${moto.año}) - ${moto.tipo}`;
            // Botón para editar
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = () => mostrarFormularioEdicion(moto);
            // Botón para eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => eliminarMoto(moto.modelo);
            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
            listaMotos.appendChild(li);
        });
    } catch (error) {
        console.error('Error al obtener las motos:', error);
    }
}

// Función para agregar una nueva moto
async function agregarMoto(event) {
    event.preventDefault();
    const modelo = document.getElementById('modelo').value;
    const marca = document.getElementById('marca').value;
    const año = parseInt(document.getElementById('año').value);
    const tipo = document.getElementById('tipo').value;

    try {
        await axios.post(baseURL, { modelo, marca, año, tipo });
        obtenerMotos(); // Actualizar la lista de motos
        document.getElementById('formMoto').reset(); // Limpiar el formulario
    } catch (error) {
        console.error('Error al agregar la moto:', error);
    }
}

// Función para mostrar el formulario de edición con los datos de la moto seleccionada
function mostrarFormularioEdicion(moto) {
    document.getElementById('modelo').value = moto.modelo;
    document.getElementById('marca').value = moto.marca;
    document.getElementById('año').value = moto.año;
    document.getElementById('tipo').value = moto.tipo;
    document.getElementById('btnGuardar').onclick = (event) => editarMoto(event, moto.modelo);
}

// Función para editar una moto existente
async function editarMoto(event, modeloOriginal) {
    event.preventDefault();
    const modelo = document.getElementById('modelo').value;
    const marca = document.getElementById('marca').value;
    const año = parseInt(document.getElementById('año').value);
    const tipo = document.getElementById('tipo').value;

    try {
        await axios.put(`${baseURL}/${modeloOriginal}`, { modelo, marca, año, tipo });
        obtenerMotos(); // Actualizar la lista de motos
        document.getElementById('formMoto').reset(); // Limpiar el formulario
        document.getElementById('btnGuardar').onclick = agregarMoto; // Restaurar la función original del botón
    } catch (error) {
        console.error('Error al editar la moto:', error);
    }
}

// Función para eliminar una moto
async function eliminarMoto(modelo) {
    try {
        await axios.delete(`${baseURL}/${modelo}`);
        obtenerMotos(); // Actualizar la lista de motos
    } catch (error) {
        console.error('Error al eliminar la moto:', error);
    }
}

// Asignar la función de agregar moto al botón de guardar
document.getElementById('btnGuardar').onclick = agregarMoto;

// Cargar la lista de motos al cargar la página
window.onload = obtenerMotos;