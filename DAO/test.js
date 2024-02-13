const sql = require('mssql');

// Configuración de la conexión a la base de datos
const config = {
  user: 'sa',
  password: 'vDBH8fKHcBEc*D.D',
  server: 'ARANDA_BD', // Puede ser 'localhost\\nombre_instancia' para una instancia local
  database: 'ADM',
  options: {    
    encrypt: false, // Deshabilitar el cifrado SSL/TLS
    trustServerCertificate: true // Usar certificados autofirmados (solo para pruebas)
  
  }
};

// Función para realizar una consulta a la base de datos
async function consultarBaseDeDatos() {
  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Realizar una consulta
    const result = await sql.query`
    SELECT * FROM AAM_DEVICE where Name = 'RCL01ACUJULFGIR'
     
    `;

    // Imprimir los resultados
    console.dir(result);

    // Cerrar la conexión
    await sql.close();
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
  }
}

// Llamar a la función para realizar la consulta
consultarBaseDeDatos();