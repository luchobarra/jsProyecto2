let transacciones = [];

function agregarTransaccion(tipo, monto, descripcion) {
    const transaccion = {
        tipo: tipo,
        monto: parseFloat(monto),
        descripcion: descripcion,
        fecha: new Date().toLocaleDateString()
    };

    transacciones.push(transaccion);
    guardarTransacciones();
    mostrarBalance();
    mostrarHistorial();
}

function mostrarBalance() {
    let ingresos = 0;
    let gastos = 0;

    for (let transaccion of transacciones) {
        if (transaccion.tipo === 'ingreso') {
            ingresos += transaccion.monto;
        } else if (transaccion.tipo === 'gasto') {
            gastos += transaccion.monto;
        }
    }

    const balance = ingresos - gastos;
    document.getElementById('resultado').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('total-ingresos').textContent = `$${ingresos.toFixed(2)}`;
    document.getElementById('total-gastos').textContent = `$${gastos.toFixed(2)}`;
}

function mostrarHistorial() {
    const historial = document.getElementById('lista-historial');
    historial.innerHTML = '';

    transacciones.forEach((transaccion, index) => {
        const item = document.createElement('li');
        item.innerHTML = `
            ${transaccion.tipo.toUpperCase()}: $${transaccion.monto.toFixed(2)} - ${transaccion.descripcion} (${transaccion.fecha})
            <button onclick="eliminarTransaccion(${index})">Eliminar</button>
        `;
        historial.appendChild(item);
    });
}

function eliminarTransaccion(index) {
    transacciones.splice(index, 1);
    guardarTransacciones();
    mostrarBalance();
    mostrarHistorial();
}

function guardarTransacciones() {
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
}

function cargarTransacciones() {
    const datosGuardados = localStorage.getItem('transacciones');
    if (datosGuardados) {
        transacciones = JSON.parse(datosGuardados);
    }
    mostrarBalance();
    mostrarHistorial();
}

document.getElementById('transaccionForm').onsubmit = function(e) {
    e.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const monto = document.getElementById('monto').value;
    const descripcion = document.getElementById('descripcion').value;

    if (monto === '' || descripcion === '') {
        alert('Por favor, complete todos los campos.');
        return;
    }

    agregarTransaccion(tipo, monto, descripcion);
    e.target.reset();
};

document.addEventListener('DOMContentLoaded', cargarTransacciones);
