let transacciones = []; // Array para almacenar las transacciones

// Cargar transacciones desde el almacenamiento local o desde el archivo JSON
function cargarHistorial() {
    let transacciones = JSON.parse(localStorage.getItem('transacciones'));

    if (!transacciones || transacciones.length === 0) {
        // Si no hay transacciones en el Local Storage, cargar desde el archivo JSON.
        fetch('transacciones.json')
            .then(response => response.json())
            .then(data => {
                transacciones = data.transacciones;
                localStorage.setItem('transacciones', JSON.stringify(transacciones));
                mostrarHistorial(transacciones);
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
            });
    } else {
        mostrarHistorial(transacciones);
    }
}

// Mostrar el historial en el DOM
function mostrarHistorial(transacciones) {
    const listaHistorial = document.getElementById('lista-historial');
    listaHistorial.innerHTML = ''; // Limpiar la lista antes de agregar las transacciones

    const fragmento = document.createDocumentFragment(); // Usamos un fragmento para optimizar el DOM

    transacciones.forEach((transaccion, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${transaccion.tipo.charAt(0).toUpperCase() + transaccion.tipo.slice(1)} - $${transaccion.monto}</span>
            <span>${transaccion.descripcion}</span>
            <button onclick="eliminarTransaccion(${transaccion.id})">Eliminar</button>
        `;
        fragmento.appendChild(li);
    });

    listaHistorial.appendChild(fragmento);
}

// Función para agregar una transacción
function agregarTransaccion(tipo, monto, descripcion) {
    const transaccion = {
        id: Date.now(),  // Usamos el timestamp como ID único
        tipo,
        monto: parseFloat(monto),
        descripcion,
        fecha: new Date().toLocaleDateString(),
    };
    transacciones.push(transaccion);

    // Guardar en localStorage
    localStorage.setItem('transacciones', JSON.stringify(transacciones));

    // Actualizar la vista
    actualizarVista();
}

// Función para eliminar una transacción por id
function eliminarTransaccion(id) {
    transacciones = transacciones.filter(transaccion => transaccion.id !== id);
    
    // Actualizar en localStorage
    localStorage.setItem('transacciones', JSON.stringify(transacciones));

    // Actualizar la vista
    mostrarHistorial(transacciones);
}

// Función para actualizar el balance y el historial en la interfaz
function actualizarVista() {
    const ingresos = transacciones
        .filter((t) => t.tipo === 'ingreso')
        .reduce((acc, t) => acc + t.monto, 0);

    const gastos = transacciones
        .filter((t) => t.tipo === 'gasto')
        .reduce((acc, t) => acc + t.monto, 0);

    const balance = ingresos - gastos;

    // Actualizar la interfaz del balance
    document.getElementById('resultado').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('total-ingresos').textContent = `$${ingresos.toFixed(2)}`;
    document.getElementById('total-gastos').textContent = `$${gastos.toFixed(2)}`;

    // Actualizar historial de transacciones
    mostrarHistorial(transacciones);
}

// Evento para el formulario de transacciones
document.getElementById('transaccionForm').onsubmit = function (e) {
    e.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const monto = document.getElementById('monto').value;
    const descripcion = document.getElementById('descripcion').value;

    if (!monto || !descripcion) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    agregarTransaccion(tipo, monto, descripcion);
    e.target.reset();
};

// Cargar el historial de transacciones cuando la página cargue
document.addEventListener('DOMContentLoaded', cargarHistorial);