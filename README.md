
# Documentación de Pandora

## Introducción
Pandora es un sistema desarrollado a medida para la gestión de conocimientos y servicios de soporte técnico. Inicialmente concebido como una base de conocimiento, evolucionó para incluir características como la gestión de manuales, procedimientos, recursos y seguimiento de mantenimientos de equipos de cómputo.

El proyecto Pandora está disponible bajo la licencia Apache 2.0, lo que significa que los usuarios tienen la libertad de copiar, modificar y distribuir el software según sus necesidades.

Para obtener más información y contribuir al proyecto, visita el repositorio en [GitHub](https://github.com/tuusuario/pandora).

## Instalación

### Requisitos Previos
Antes de instalar Pandora, asegúrate de tener los siguientes requisitos en tu sistema:

- Node.js y npm instalados (versión recomendada: X.X.X)
- MySQL Server instalado y en funcionamiento
- Gestor de procesos Node.js PM2 instalado (opcional pero recomendado para entornos de producción)

### Pasos de Instalación en Windows y Linux con PM2 como Servicio

1. Clona el repositorio de Pandora desde GitHub:
   ```
   git clone https://github.com/tuusuario/pandora.git
   ```

2. Navega hasta el directorio de Pandora:
   ```
   cd pandora
   ```

3. Instala las dependencias del proyecto utilizando npm:
   ```
   npm install
   ```

4. Configura el archivo `config.js` con los detalles de conexión a tu base de datos MySQL.

5. Instala PM2 como servicio globalmente (solo se requiere una vez):
   ```
   npm install pm2@latest -g
   ```

6. Genera el archivo de configuración de PM2:
   ```
   pm2 ecosystem
   ```

7. Edita el archivo `ecosystem.config.js` generado y agrega la siguiente configuración:

   ```javascript
   module.exports = {
     apps: [{
       name: 'pandora',
       script: 'app.js',
       watch: true,
       error_file: 'logs/error.log',
       out_file: 'logs/out.log',
       merge_logs: true,
       log_date_format: 'YYYY-MM-DD HH:mm:ss',
       autorestart: true,
       max_restarts: 10,
       min_uptime: 10000, // 10 seconds
       max_memory_restart: '100M',
       instances: 1
     }]
   };
   ```

   Asegúrate de ajustar las opciones según tus necesidades específicas.

8. Inicia Pandora como servicio utilizando PM2:
   ```
   pm2 start ecosystem.config.js
   ```

9. Configura PM2 para que inicie Pandora como servicio en el arranque del sistema:
   ```
   pm2 startup
   ```
   
   Sigue las instrucciones que te proporcionará PM2 según tu sistema operativo.

Una vez completados estos pasos, Pandora se iniciará automáticamente como un servicio en el arranque del sistema. Además, PM2 gestionará los errores y reinicios automáticamente según la configuración proporcionada en `ecosystem.config.js`, lo que garantiza un funcionamiento más robusto y fiable del servidor.

## Descripción de Funcionalidades
- **Gestión de manuales:** Permite almacenar y consultar manuales de procedimientos.
- **Gestión de procedimientos:** Facilita la creación y seguimiento de procedimientos.
- **Gestión de recursos:** Permite almacenar recursos útiles para el equipo técnico.
- **Seguimiento de mantenimientos de equipos de cómputo:** Registra y monitoriza los mantenimientos realizados en los equipos.

## Roles y Funcionalidades
Pandora gestiona diferentes roles de usuario, cada uno con diferentes niveles de acceso y funcionalidades:

- **Administrador:** Tiene acceso completo a todas las funcionalidades del sistema.
- **Coordinador:** Puede crear manuales, procedimientos, recursos y noticias. También puede gestionar usuarios y asignar roles.
- **Agente:** Tiene acceso a las funcionalidades de consulta y gestión de datos, pero no puede crear nuevos contenidos ni gestionar usuarios.
- **GTI (Grupo de Tecnologías de la Información):** Tiene acceso directo al panel de control de mantenimientos para la gestión eficiente de los equipos de cómputo.

## Contribución y Desarrollo
Pandora es un software libre distribuido bajo la licencia Apache 2.0. Los usuarios tienen la libertad de copiar, modificar y distribuir el software según los términos de la licencia.

Si deseas contribuir al desarrollo de Pandora, sigue estos pasos:
- Clona el repositorio desde [GitHub](https://github.com/tuusuario/pandora).
- Realiza tus cambios y mejoras.
- Envía tus cambios mediante pull requests para su revisión e integración.


## Listado de rutas de Pandora

```
/
|   .env
|   .gitignore
|   authMiddleware.js
|   createAdmin.js
|   export.sql
|   export_datos.sql
|   filters.js
|   imagen.png
|   main.js
|   package-lock.json
|   package.json
|   server.js
+---assets
|   |   dump.sql
|   |   
|   +---images
|   |   |   article.jpg
|   |   |   banner.jpg
|   |   |   banner.png
|   |   |   comsistelco.png
|   |   |   comsistelcodark.png
|   |   |   emcali.png
|   |   |   hero.jpg
|   |   |   manual.jpg
|   |   |   profile.png
|   |   |   resource.jpg
|   |   |          
|   +---js
|   |       maintenance.js
|   |       maintenanceReports.js
|   |       
|   \---styles
|           base.css
|           form.css
|           style.css
|           styleReport.css
|           
+---config
|       passport.js
|       
+---controllers
|       mainController.js
|       tools.js
|       
+---DAO
|       alert.js
|       ananda.js
|       areas.csv
|       articles.js
|       auth.js
|       comments.js
|       creation.js
|       db.js
|       departments.csv
|       empleados copy.csv
|       empleados.csv
|       employees.js
|       equipos.csv
|       equipos2.csv
|       guides.js
|       mantenimientos.csv
|       mantenimientos2.csv
|       mantenimientos3.csv
|       mantenimientos4.csv
|       mantenimientos5.csv
|       mantenimientos6.csv
|       mantenimientos7.csv
|       mantenimientos8.csv
|       news.js
|       recover.js
|       reports.js
|       resources.js
|       roles.csv
|       search.js
|       test.js
|       tools.js
|       userDAO.js
|       users.js
|       xapi.js
|     
+---models
|       mainModel.js
|       User.js
|           
+---routes
|       admin.js
|       articles.js
|       auth.js
|       comments.js
|       dashboard.js
|       files.js
|       front.js
|       guides.js
|       index.js
|       news.js
|       ops.js
|       premium.js
|       reports.js
|       resources.js
|       search.js
|       tools.js
|       users.js
|       
\---views
    |   401.njk
    |   admin.njk
    |   index.njk
    |   index.pug
    |   layout.njk
    |   layout_articles.njk
    |   layout_auth.njk
    |   
    +---admin
    |       index.njk
    |       
    +---agent
    |       index.njk
    |       
    +---articles
    |       article.njk
    |       index.njk
    |       new.njk
    |       
    +---auth
    |       change-password.njk
    |       login.njk
    |       
    +---coordinator
    |       index.njk
    |       
    +---dashboard
    |       admin.njk
    |       agent.njk
    |       auditor.njk
    |       
    +---editor
    |   +---articles
    |   |       new.njk
    |   |       
    |   +---guides
    |   \---resources
    +---guides
    |       guide.njk
    |       index.njk
    |       new.njk
    |       
    +---news
    |       index.njk
    |       new.njk
    |       news.njk
    |       
    +---partials
    |       footer.njk
    |       header.njk
    |       header_auth.njk
    |       
    +---reports
    |       access.njk
    |       index.njk
    |       maintenance.njk
    |       use.njk
    |       
    +---resources
    |       index.njk
    |       new.njk
    |       
    +---search
    |       index.njk
    |       
    \---tools
            form.njk
```

## SCRIPTS FUNCIONALES

### `creation.js`:

- **Crear Usuario con Contraseña Aleatoria:**
  - **Descripción:** Crea un nuevo usuario en la base de datos con una contraseña aleatoria y envía un correo electrónico al usuario con la contraseña generada.
  - **Invocación desde la Shell (desde la raíz del proyecto):**
    ```bash
    node DAO/creation.js
    ```

### `recover.js`:

- **Restaurar Contraseña de Usuario:**
  - **Descripción:** Cambia la contraseña de un usuario en la base de datos utilizando su ID de usuario y la nueva contraseña proporcionada.
  - **Invocación desde la Shell (desde la raíz del proyecto):**
    ```bash
    node DAO/recover.js
  
