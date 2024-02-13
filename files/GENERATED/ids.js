const fs = require('fs');
const path = require('path');

const directorio = './'; // Ruta del directorio
const patron = /^MANTENIMIENTO_ID_(\d+)\.pdf$/;

const obtenerIDs = (directorio) => {
    try {
        const archivos = fs.readdirSync(directorio);

        const ids = archivos
            .filter((archivo) => patron.test(archivo))
            .map((archivo) => archivo.match(patron)[1]);

        return ids;
    } catch (error) {
        console.error('Error al leer el directorio:', error.message);
        return [];
    }
};

const idsDeArchivos = obtenerIDs(directorio);

if (idsDeArchivos.length > 0) {
    const listaIDs = idsDeArchivos.join(', '); // IDs separados por comas

    // Consulta SQL para actualizar registros
    const consultaSQL = `UPDATE maintenance SET hasDocument = 0 WHERE id NOT IN (${listaIDs});`;

    console.log('Consulta SQL generada:', consultaSQL);
} else {
    console.log('No se encontraron archivos con el formato esperado.');
}
