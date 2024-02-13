const { exec } = require('child_process');

// Reemplaza con el mensaje y el título que desees mostrar
const mensaje = 'Este es un mensaje de notificacion';
const titulo = 'Titulo de la notificacion';

// Comando PowerShell para mostrar una notificación
const comando = `powershell -Command "New-BurntToastNotification -Text '${mensaje}' -AppLogo 'C:\\path\\to\\icon.png' -AppLogoHint 'App' -Audio 'Default' -Title '${titulo}'"`;

// Ejecuta el comando
exec(comando, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
