const bcrypt = require('bcrypt');
const db = require('./db');
const dotenv = require('dotenv');
const fs = require("fs");
dotenv.config();
const tools = require('./tools');
const users = require('./users');


const tools2 = require('./ananda');
let areas = fs.readFileSync("./areas.csv").toString().split("\n");
let roles = fs.readFileSync("./roles.csv").toString().split("\n");
const csv = require('csv-parser');
const { getEquipment } = require('./tools');




let aux = []
/**
for(let i=0; i< departments.length; i++){
    let data = departments[i].split(";");
    aux.push({
        id : data[0],
        name : data[1]
    })
}
departments = aux;
aux=[];
for(let i=0; i< areas.length; i++){
    let data = areas[i].split(";");
    aux.push({
        id : data[0],
        name : data[1]
    })
}
areas = aux;

aux=[];
*/
for (let i = 0; i < roles.length; i++) {
    let data = roles[i].split(";");
    aux.push({
        id: data[0],
        name: data[1]
    })
}
roles = aux;


//


// Función para obtener ID basado en el nombre de la tabla
async function getIdFromName(tableName, name) {
    //console.log("#####");
    //console.log(tableName, name);

    // Calcula el próximo ID antes de cada inserción
    const getMaxIdQuery = `SELECT MAX(id) AS maxId FROM ${tableName}`;
    const maxIdResult = await db.query(getMaxIdQuery);
    const currentMaxId = maxIdResult[0]?.maxId || 0;
    const nextId = currentMaxId + 1;

    const columnName = tableName === 'customerRole' ? 'rolename' : 'name';
    let query = `SELECT id FROM ${tableName} WHERE ${columnName} = ?`;
    let result = await db.query(query, [name]);
    let id = result[0]?.id || null;

    if (!id) {
        // Si no se encuentra, insertar el nuevo elemento con el ID calculado
        query = `INSERT INTO ${tableName} (id, ${columnName}) VALUES (${nextId}, ?)`;
        //console.log(query);
        await db.query(query, [name]);

        // Volver a buscar el ID después de la inserción
        result = await db.query(`SELECT id FROM ${tableName} WHERE ${columnName} = ?`, [name]);
        id = result[0]?.id || null;
    }
    //console.log(id);

    return id;
}


// Función para cargar usuarios desde el archivo CSV

//

// Función para obtener ID basado en el nombre de la tabla

// Función para cargar usuarios desde el archivo CSV
async function loadUsers() {
    const usersData = [];

    // Leer el archivo CSV de manera síncrona
    const fileData = fs.readFileSync('./empleados.csv', 'utf8');
    const rows = fileData.split('\n').map(row => row.split(';'));

    // Eliminar el encabezado si es necesario (si la primera fila son nombres de columna)
    const headers = rows[0]; // Ajusta esto según tu archivo CSV
    const dataRows = rows.slice(1); // O ajusta este índice si no tienes encabezados
    let counter = 2;
    for (const row of dataRows) {
        const [
            registro,
            documento,
            fullname,
            email,
            cargo,
            gerencia,
            departamento,
            area,
        ] = row;

        // Obtener los IDs correspondientes
        //console.log(123)
        const departmentId = await getIdFromName('departments', departamento);
        //console.log(departmentId)
        //console.log(456)
        const managementId = await getIdFromName('managements', gerencia);
        const areaId = await getIdFromName('areas', area);
        const customerRoleId = await getIdFromName('customerRole', cargo.trim());

        // Insertar los datos del usuario junto con los IDs en la tabla employees
        const query = `
      INSERT INTO employees 
      (id, username, fullName, document, email, managementId, departmentId, areaId, customerRoleId, register) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const values = [
            counter, email.split("@")[0], fullname, documento, email, managementId, departmentId, areaId, customerRoleId, registro
            // Aquí deberías proporcionar los valores adecuados para cada columna en la tabla employees
            // Usando los datos del archivo CSV y los IDs encontrados
        ];

        // Ejecutar la consulta con los valores correspondientes
        await db.query(query, values);
        counter = counter + 1;
    }

    //console.log('Users data loaded successfully');
}

async function createEmployee(element) {
    return new Promise(async resolve => {
        console.log(element)

        // Obtener los IDs correspondientes
        //console.log(123)
        const departmentId = await getIdFromName('departments', element["DEPARTAMENTO"]);
        //console.log(departmentId)
        //console.log(456)
        const managementId = await getIdFromName('managements', element["GERENCIA"]);
        const areaId = await getIdFromName('areas', element["AREA"]);
        //const customerRoleId = await getIdFromName('customerRole', cargo.trim());

        // Insertar los datos del usuario junto con los IDs en la tabla employees
        const query = `
        INSERT INTO employees 
        ( username, fullName, document, email, managementId, departmentId, areaId, customerRoleId, register) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )
        `;
        let data = {
            username: element["USUARIO DIRECTORIO ACTIVO"].toLowerCase(),
            fullname: element["NOMBRES Y APELLIDOS"],
            documento: element["CEDULA"],
            email: element["CORREO"].toLowerCase(),
            registro: element["REGISTRO"]
        }

        const values = [
            data.username, data.fullname, data.documento, data.email, managementId, departmentId, areaId, null, data.registro == "N/A" ? 0 : data.registro
            // Aquí deberías proporcionar los valores adecuados para cada columna en la tabla employees
            // Usando los datos del archivo CSV y los IDs encontrados
        ];

        // Ejecutar la consulta con los valores correspondientes
        let response = await db.query(query, values);
        //counter = counter + 1;

        resolve(response)
        //console.log('Users data loaded successfully');

    })

}

async function createComputer(aranda_data) {
    return new Promise(async (resolve) => {
        let equipment = null;
        let equipments_loaded = {}
        console.log(aranda_data)
        console.log("VA A CREAR EL EQUIPO ______________")

        //console.log("aranda");
        //console.log(aranda_data);
        COMPUTER_STATUS = {
            "EN USO": 1,
            "DAR DE BAJA": 2,
            "DESCONECTADO": 3,
            "NO USO": 4
        }
        // Obtener los IDs correspondientes
        //console.log(123)

        const typeId = aranda_data === undefined ? 1 : (aranda_data["CLASE DE EQUIPO"] == undefined ? (aranda_data['CLASE_EQUIPO'].indexOf("Desktop") !== -1 ? 1 : 2) : 1);
        //console.log(456)
        const brandId = aranda_data !== undefined ? await getIdFromName('brand', aranda_data["MARCA_EQUIPO"] !== undefined ? aranda_data["MARCA_EQUIPO"] : aranda_data["MARCA"]) : null;
        let serial = aranda_data["SERIAL"] == undefined ? aranda_data["SERIAL_EQUIPO"] : aranda_data["SERIAL"];

        // Insertar los datos del usuario junto con los IDs en la tabla employees
        const query = `
        INSERT INTO computerset 
        (typeId,  SN, model, brandId,  ram,    hardDrive,  Name, statusId)
         
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        console.log(aranda_data)
        const values = [
            typeId, serial, aranda_data['MODELO_EQUIPO'] !== undefined ? aranda_data["MODELO_EQUIPO"] : aranda_data["MODELO"], brandId, aranda_data['TAMAÑO_MEMORIA_RAM'] !== undefined ? aranda_data["TAMAÑO_MEMORIA_RAM"] : aranda_data["MEMORIA RAM"], aranda_data['CAPACIDAD_DISCO1'] !== undefined ? aranda_data["CAPACIDAD_DISCO1"] : aranda_data["DISCO DURO"], aranda_data['NOMBRE_MAQUINA'] !== undefined ? aranda_data["NOMBRE_MAQUINA"] : aranda_data["NOMBRE_NUEVO"], 1
        ];
        defaultSerial = "N/A";
        EXCLUSIONES = [
            "NO LEGIBLE",
            "SIN SERIE",
            "N/A",
            "SIN MOUSE",
            "SIN MONITOR"
        ]

        const perifericos = [{

            type: 1,
            serial: aranda_data['SERIAL_MONITOR1'],
            hasPeripherical: EXCLUSIONES.indexOf(aranda_data['SERIAL_MONITOR']) == -1
        }]
        //console.log(EXCLUSIONES)
        //console.log("serial monitor:", SERIAL_MONITOR)
        //console.log("serial mouse:", SERIAL_MOUSE)
        //console.log(perifericos)



        // Ejecutar la consulta con los valores correspondientes


        equipment = await db.query(query, values);

        console.log(equipment)


        equipment = await tools.getEquipmentById(equipment.insertId);

        resolve(equipment);

    })


    // Eliminar el encabezado si es necesario (si la primera fila son nombres de columna)

    //console.log('Users data loaded successfully');
}


async function loadComputers() {
    const usersData = [];

    // Leer el archivo CSV de manera síncrona
    const fileData = fs.readFileSync('./equipos.csv', 'utf8');
    const rows = fileData.split('\n').map(row => row.split(';'));

    // Eliminar el encabezado si es necesario (si la primera fila son nombres de columna)
    const headers = rows[0]; // Ajusta esto según tu archivo CSV
    const dataRows = rows.slice(1); // O ajusta este índice si no tienes encabezados
    let counter = 1238;
    let equipments_loaded = {}
    for (const row of dataRows) {
        const [
            TIPO_EQUIPO,
            ESTADO_EQUIPO,
            MARCA,
            MODELO,
            SERIAL_EQUIPO,
            RAM,
            HD,
            SERIAL_MONITOR,
            SERIAL_MOUSE,
            NOMBRE_EQUIPO,
            NUEVO
        ] = row;

        COMPUTER_STATUS = {
            "EN USO": 1,
            "DAR DE BAJA": 2,
            "DESCONECTADO": 3,
            "NO USO": 4
        }
        // Obtener los IDs correspondientes
        //console.log(123)
        const typeId = TIPO_EQUIPO == "PC ESCRITORIO" ? 1 : 2;
        //console.log(456)
        const brandId = await getIdFromName('brand', MARCA);

        // Insertar los datos del usuario junto con los IDs en la tabla employees
        const query = `
        INSERT INTO computerset 
        (id,  typeId,  SN, model, brandId,  ram,    hardDrive,  Name, statusId)
         
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

        const values = [
            counter, typeId, SERIAL_EQUIPO.toUpperCase(), MODELO, brandId, RAM, HD, NOMBRE_EQUIPO, COMPUTER_STATUS[ESTADO_EQUIPO]
            // Aquí deberías proporcionar los valores adecuados para cada columna en la tabla employees
            // Usando los datos del archivo CSV y los IDs encontrados
        ];
        defaultSerial = "N/A";
        EXCLUSIONES = [
            "NO LEGIBLE",
            "SIN SERIE",
            "N/A",
            "SIN MOUSE",
            "SIN MONITOR"
        ]

        const perifericos = [{

            type: 1,
            serial: SERIAL_MONITOR,
            hasPeripherical: EXCLUSIONES.indexOf(SERIAL_MONITOR) == -1
        },

        {
            serial: SERIAL_MOUSE,
            type: 3,
            hasPeripherical: EXCLUSIONES.indexOf(SERIAL_MOUSE) == -1
        }

        ]
        //console.log(EXCLUSIONES)
        //console.log("serial monitor:", SERIAL_MONITOR)
        //console.log("serial mouse:", SERIAL_MOUSE)
        //console.log(perifericos)



        // Ejecutar la consulta con los valores correspondientes
        if (equipments_loaded[SERIAL_EQUIPO] === undefined) {
            await db.query(query, values);
            equipments_loaded[SERIAL_EQUIPO.toUpperCase()] = true
            for (let i = 0; i < perifericos.length; i++) {
                let query2 = `
                    INSERT INTO peripherical 
                    (serialNumber, model, typeId, computerSetId)
                    
                    VALUES (?, ?, ?, ?)
                `;


                let values2 = [perifericos[i].serial.toUpperCase(), 'N/A', perifericos[i].type, counter];
                //console.log(query2)
                //console.log(values2)
                if (perifericos[i].hasPeripherical) {
                    await db.query(query2, values2);
                }




            }
            counter = counter + 1;

        }

    }

    //console.log('Users data loaded successfully');
}



//

async function load() {
    return new Promise(async (resolve, reject) => {
        try {
            /**
            //console.log("start departments load")
            for(let i=0;i<departments.length;i++){
        
                const query = 'insert into departments (id, name) values(?,?)';
                const values = [aux[i].id, aux[i].name];
                let response = await db.query(query, values);
            }
            //console.log("deparments loaded")

            //console.log("start areas load")
            for(let i=0;i<areas.length;i++){
        
                const query = 'insert into areas (id, name) values(?,?)';
                const values = [aux[i].id, aux[i].name];
                let response = await db.query(query, values);
            }
            //console.log("areas loaded")
            
            //console.log("start roles load")
            for(let i=0;i<areas.length;i++){
        
                const query = 'insert into customerrole (id, rolename) values(?,?)';
                const values = [aux[i].id, aux[i].name];
                let response = await db.query(query, values);
            }
            //console.log("roles loaded")
            */




            resolve({
                message: 'Password changed for user with ID:' + userId,
                result: response,
                status: 'success'
            })

        } catch (error) {
            console.error('Error changing password:', error);
            //throw error;
            return {
                message: 'Error changing password:' + error,
                result: error,
                status: 'failed'
            }
        }

    })

}
let getDevice = (serial, data1) => {
    return new Promise(async (resolve) => {
        console.log(serial)
        console.log(data1)
        let skip = true;
        let data = null;
        let computerset = await tools2.getDevice(serial);
        console.log(serial)
        let computerset2 = await tools.getEquipment(serial);
        console.log("##########################")
        console.log(computerset)
        console.log(computerset2)
        if (computerset2 == null && computerset.length == 0) {
            console.log("debe cerear")
            console.log(computerset)
            console.log(serial)
            let r = await createComputer(data1);
            console.log(r)
            console.log("asdasdasd")
            computerset2 = await tools.getEquipment(serial);
            console.log(computerset2)
        } else if (computerset2 == null && computerset.length > 0) {
            console.log(data1)
            let r = await createComputer(data1);
            computerset2 = await tools.getEquipment(serial);

        } else {
            console.log("NO VA A CREAR")
            console.log(computerset, computerset2)
        }


        console.log("computerset")
        console.log(computerset2)

        let ram = (
            computerset.length > 0 &&
            computerset[0].TAMAÑO_MEMORIA_RAM !== undefined
        )
            ? computerset[0].TAMAÑO_MEMORIA_RAM
            : (
                computerset.length > 0 && computerset[0]["MEMORIA RAM"] !== undefined
                    ? computerset[0]["MEMORIA RAM"]
                    : (
                        computerset2 && computerset2.ram !== undefined
                            ? computerset2.ram
                            : "4GB"
                    )
            );

        let hd = (
            computerset.length > 0 &&
            computerset[0].CAPACIDAD_DISCO1 !== undefined
        )
            ? computerset[0].CAPACIDAD_DISCO1
            : (
                computerset2 && computerset2.hd !== undefined
                    ? computerset2.hd
                    : "4GB" // Cambia "4GB" según tu requerimiento
            );

        let name = (
            computerset.length > 0 &&
            computerset[0].NOMBRE_EQUIPO !== undefined
        )
            ? computerset[0].NOMBRE_EQUIPO
            : (
                computerset2 && computerset2.name !== undefined
                    ? computerset2.name
                    : (data1 && data1['NOMBRE NUEVO'] !== undefined ? data1['NOMBRE NUEVO'] : "ValorPredeterminado")
            );

        let model = (
            computerset.length > 0 &&
            computerset[0].MODELO_EQUIPO !== undefined
        )
            ? computerset[0].MODELO_EQUIPO
            : (
                computerset2 && computerset2.model !== undefined
                    ? computerset2.model
                    : (data1 && data1['MODELO'] !== undefined ? data1['MODELO'] : "ValorPredeterminado")
            );
        let brand = (
            computerset.length > 0 &&
            computerset[0].MARCA_EQUIPO !== undefined
        )
            ? computerset[0].MARCA_EQUIPO
            : (
                computerset2 && computerset2.brand !== undefined
                    ? computerset2.brand
                    : (data1 && data1['MARCA'] !== undefined ? data1['MARCA'] : "ValorPredeterminado")
            );
        computerset2 = await tools.getEquipment(serial);
        console.log("&/&&&&&&&&&&&&&&&&&&&&")
        computerset = await tools2.getDevice(serial);
        console.log(serial)
        computerset2 = await tools.getEquipment(serial);
        console.log(computerset, computerset2)

        console.log("###############################")
        data = {
            "id": computerset2.computer_id,
            "sn": serial,
            "ram": ram,
            "hd": hd,
            "name": name,
            "model": model,
            "brand": brand,
            "type": computerset2 == null ? computerset[0].CLASE_EQUIPO : computerset2.type,
            "peripherical": {

            }
        }







        resolve(data);
    })

}


const loadMaintenances = async () => {
    try {
        const maintenances = [];
        const keys = ['USUARIO DIRECTORIO ACTIVO', 'NOMBRES Y APELLIDOS', 'CORREO', 'REGISTRO', 'CEDULA', 'No. CONTACTO',
            'GERENCIA', 'DEPARTAMENTO', 'AREA', 'CARGO', 'SERIAL', 'ANTIGUEDAD', 'CLASE DE EQUIPO',
            'NOMBRE ACTUAL', 'NOMBRE NUEVO', 'MARCA', 'MODELO', 'SERIAL MOUSE', 'MEMORIA RAM', 'DISCO DURO',
            'SEDE', 'PISO', 'ARANDA INVENTARIO', 'ANTIVIRUS KASPERSKY', 'CAMBIO DE CONTRASENA ADM',
            'NORMALIZACION USUARIOS', 'ESTADO', 'TECNICO QUE REALIZO EL MANTENIMIENTO',
            'FECHA DEL MANTENIMIENTO', 'REPORTE EN ARANDA', 'REPORTE EN KASPERSKY', 'ESTATUD ARANDA',
            'TIPO DE MANTENIMIENTO'];

        // Utilizar csv-parser para leer y parsear el archivo CSV
        await new Promise((resolve, reject) => {
            fs.createReadStream('./mantenimientos8.csv')
                .pipe(csv({ separator: ';' }))  // Configurar el separador aquí

                .on('data', (row) => {
                    maintenances.push(row);
                })
                .on('end', async () => {
                    // Imprimir el resultado en la consola
                    console.log('Número de mantenimientos:', maintenances.length);

                    // Procesar cada mantenimiento de forma lineal
                    for (var i = 0; i < maintenances.length; i++) {

                        let element = maintenances[i];
                        console.log(element)
                        let employee = await tools.getEmployee(element['USUARIO DIRECTORIO ACTIVO']);
                        let computer = await getDevice(element['SERIAL'], maintenances[i]);
                        console.log(element['TECNICO QUE REALIZO EL MANTENIMIENTO'])
                        let agent = await users.getUserByName(element['TECNICO QUE REALIZO EL MANTENIMIENTO']);
                        console.log("empleado:", element['USUARIO DIRECTORIO ACTIVO'])
                        if (employee.length == 0) {
                            await createEmployee(element);
                            employee = await tools.getEmployee(element['USUARIO DIRECTORIO ACTIVO'].toLowerCase());

                        }
                        console.log(element['FECHA DEL MANTENIMIENTO']);
                        console.log(employee)
                        let date = new Date(element['FECHA DEL MANTENIMIENTO']);
                        console.log(element['FECHA DEL MANTENIMIENTO'])
                        console.log(date)
                        let piso = element["PISO"];
                        let sede = await tools.getSedeByName(element["SEDE"]);
                        console.log("raw:", element["SEDE"])
                        console.log("sede:", sede)
                        console.log("piso:", piso)
                        console.log("date:", date)
                        let data = {
                            agent: agent,
                            equipment: computer,
                            date: parseDateFromString(element['FECHA DEL MANTENIMIENTO']),
                            observations: null,
                            employee: employee[0],
                            sede: sede[0]["id"],
                            piso: piso,
                            previousName : element["NOMBRE ACTUAL"],
                            currentName : element["NOMBRE NUEVO"]
                        };
                        
                        console.log(data)
                        let register = await tools.registerMaintenance(data);
                        console.log(register);

                    }

                    resolve();
                })
                .on('error', reject);
        });

        console.log('Proceso completo');

    } catch (error) {
        console.error('Error al cargar las mantenimientos:', error);
    }
};
function parseDateFromString(dateString) {
    const parts = dateString.split('/');
    // Asegúrate de que haya tres partes (día, mes, año)
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            // Obtén la fecha actual para obtener la hora actual
            const now = new Date();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            return formattedDate;
        }
    }

    // Devuelve null si la fecha no se puede parsear correctamente
    return null;
}





loadMaintenances().then(response => { console.log(11) })

