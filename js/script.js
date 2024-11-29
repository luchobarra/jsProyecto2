// Array para almacenar las transacciones
let transacciones = [];

// Función para agregar una transacción
function agregarTransaccion(tipo, monto, descripcion) {
    const transaccion = {
        tipo: tipo,
        monto: parseFloat(monto), // Convertir el monto a número
        descripcion: descripcion,
        fecha: new Date().toLocaleDateString() // Fecha actual
    };
    
    transacciones.push(transaccion); // Guardamos la transacción en el array
    mostrarBalance(); // Actualizamos el balance
    mostrarHistorial(); // Actualizamos el historial
}

// Función para calcular el balance actual
function mostrarBalance() {
    let ingresos = 0;
    let gastos = 0;

    // Recorremos el array para calcular los ingresos y gastos
    for (let transaccion of transacciones) {
        if (transaccion.tipo === 'ingreso') {
            ingresos += transaccion.monto;
        } else if (transaccion.tipo === 'gasto') {
            gastos += transaccion.monto;
        }
    }

    // Calculamos el balance
    const balance = ingresos - gastos;
    document.getElementById('resultado').textContent = `Balance actual: $${balance.toFixed(2)}`;
}

// Función para mostrar el historial de transacciones
function mostrarHistorial() {
    const historial = document.getElementById('historial');
    historial.innerHTML = ''; // Limpiar el historial antes de actualizar

    // Recorrer el array y mostrar las transacciones
    transacciones.forEach((transaccion, index) => {
        const item = document.createElement('li');
        item.textContent = `${transaccion.tipo.toUpperCase()}: $${transaccion.monto.toFixed(2)} - ${transaccion.descripcion} (${transaccion.fecha})`;

        // Botón para eliminar la transacción
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarTransaccion(index);
        item.appendChild(botonEliminar);

        historial.appendChild(item);
    });
}

// Función para eliminar una transacción
function eliminarTransaccion(index) {
    transacciones.splice(index, 1); // Eliminar la transacción del array
    mostrarBalance(); // Actualizar el balance
    mostrarHistorial(); // Actualizar el historial
}

// Captura del formulario y validación de entrada
document.getElementById('transaccionForm').onsubmit = function(e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const tipo = document.getElementById('tipo').value;
    const monto = document.getElementById('monto').value;
    const descripcion = document.getElementById('descripcion').value;

    // Verificar que los campos no estén vacíos
    if (monto === '' || descripcion === '') {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Agregar la nueva transacción
    agregarTransaccion(tipo, monto, descripcion);
    
    // Limpiar el formulario
    e.target.reset();
};