const db = require('./db');
const path = require('path');
const fs = require("fs");


const createEmployee = async (data) => {
  console.log(data)
  const {
    username,
    fullName,
    document,
    email,
    ext,
    mobile,
    managementId,
    managementID,
    departmentId,
    areaId,
    register
  } = data;

  try {
    const query = `
      INSERT INTO employees
      (username, fullName, document, email, ext, mobile, managementId, departmentId, areaId, register)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.query(query, [
      username,
      fullName,
      document,
      email,
      ext == '' ? null : ext,
      mobile,
      managementId == null ? managementID : managementId,
      departmentId,
      areaId,
      register
    ]);

    return result;
  } catch (error) {
    throw error;
  }
};

const updateEmployee = async (data) => {
  const {
    id,
    username,
    fullName,
    document,
    email,
    ext,
    mobile,
    managementId,
    departmentId,
    areaId,
    register
  } = data;

  if (!id) {
    throw new Error('Se requiere un ID para actualizar el registro.');
  }

  const validFields = {
    username,
    fullName,
    document,
    email,
    ext,
    mobile,
    managementId,
    departmentId,
    areaId,
    register
  };

  const updateData = {};
  const updateValues = [];

  // Construir la consulta de actualización
  Object.entries(validFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      updateData[key] = value == '' ? null : value;
      updateValues.push(`${key} = ?`);
    }
  });

  const updateSet = updateValues.join(', ');

  try {
    const query = `
      UPDATE employees
      SET ${updateSet}
      WHERE id = ?
    `;


    const result = await db.query(query, [...Object.values(updateData), id]);

    return result;
  } catch (error) {
    throw error;
  }
};
const updateName = async(sn, newName) => {
  try {
    const query = `
    UPDATE COMPUTERSET
    SET NAME = ?
    where SN = ?`

    const result = await db.query(query, [newName, sn])
    return result;
  } catch (error) {
    throw error;
  }

}

const getEmployee = async (username, register, document) => {
  try {
    console.log(username, register, document)
    username = username == 'xx' ? null : username;
    register = register == 'xx' ? null : register;
    document = document == 'xx' ? null : document;
    // Verifica si al menos un parámetro está presente
    if (!username && !register && !document) {
      return [];  // O puedes devolver un valor nulo, dependiendo de tus necesidades
    }

    let query = `
      SELECT e.id, e.username AS username, e.fullName, e.register, e.document, e.mobile, e.ext, e.email,
        s.name AS sede,
        m.name AS management,
        m.id as managementID,
        a.name AS area,
        a.id AS areaId,
        d.id AS departmentId,
        d.name AS department
      FROM employees e
        LEFT JOIN sedes s ON e.sedeId = s.id
        LEFT JOIN managements m ON e.managementId = m.id
        LEFT JOIN areas a ON e.areaId = a.id
        LEFT JOIN departments d ON e.departmentId = d.id
      WHERE 1`;

    const params = [];

    if (username) {
      query += ' AND e.username = ?';
      params.push(username);
    }

    if (document) {
      query += ' AND e.document = ?';
      params.push(document);
    }

    if (register) {
      query += ' AND e.register = ?';
      params.push(register);
    }

    query += ' LIMIT 1;';
    console.log(query)
    const result = await db.query(query, params);
    return result;
  } catch (error) {
    throw error;
  }
};

const getSedeByName = async (name) => {
  try {
    const result = await db.query('SELECT * FROM sedes WHERE name = ?', [name]);
    return result;
  } catch (error) {
    throw error;
  }

}
const getSedeById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM sedes WHERE id = ?', [id]);
    return result[0];
  } catch (error) {
    throw error;
  }

}

const getUserByEmail = async (email) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
    throw error;
  }


  // Agrega otros métodos de acceso a datos relacionados con los usuarios según sea necesario
}

const getActivitiesByCategory = async () => {
  try {
    const query = `
      SELECT activity.id, activity.short_description, activity.category, activity_type.name AS category_name
      FROM activity
      INNER JOIN activity_type ON activity.category = activity_type.id
    `;
    const result = await db.query(query);

    if (Array.isArray(result) && result.length > 0) {
      return result;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};


const getManagements = async () => {
  try {
    const query = `
      SELECT id, name from pandora.managements order by name asc
    `;
    const result = await db.query(query);
    return result;

  } catch (error) {
    throw error;
  }
};

const getSedes = async () => {
  try {
    const query = `
      SELECT id, name from pandora.sedes order by name asc
    `;
    const result = await db.query(query);
    console.log(result)
    return result;

  } catch (error) {
    throw error;
  }
};
const getBrands = async () => {
  try {
    const query = `
      SELECT id, name from pandora.brand order by name asc
    `;
    const result = await db.query(query);
    console.log(result)
    return result;

  } catch (error) {
    throw error;
  }
};
const getBrand = async (id) => {
  try {
    const query = `
      SELECT id, name from pandora.brand where id = ?
    `;
    const result = await db.query(query, [id]);
    console.log(result[0].name)
    return result[0].name;

  } catch (error) {
    throw error;
  }
};


const getTypes = async () => {
  try {
    const query = `
      SELECT id, name from pandora.computertype order by name asc
    `;
    const result = await db.query(query);
    console.log(result)
    return result;

  } catch (error) {
    throw error;
  }
};


const getAreas = async () => {
  try {
    const query = `
      SELECT id, name from pandora.areas order by name asc
    `;
    const result = await db.query(query);
    return result;

  } catch (error) {
    throw error;
  }
};


const getDepartments = async () => {
  try {
    const query = `
      SELECT id, name from pandora.departments order by name asc
    `;
    const result = await db.query(query);

    return result;
  } catch (error) {
    throw error;
  }
};


const getEquipment = async (serialNumber) => {
  try {
    const query = `
      SELECT 
        computerset.id AS computer_id, 
        computerset.brandId AS computer_brand,
        computerset.hardDrive AS HD,
        computerset.ram AS RAM,
        computerset.SN as SN,
        computerset.Name as computer_name,
        computerset.model as model,
        periphericaltype.name AS peripheircal_type,
        peripherical.id AS peripherical_id,
        peripherical.serialNumber AS peripherical_sn,
        peripherical.model AS peripherical_model,
        peripherical.brandId AS peripherical_brand
      FROM 
        computerset 
      LEFT JOIN 
        peripherical ON computerSetId = computerset.id  
      LEFT JOIN 
        periphericaltype ON periphericaltype.id = peripherical.typeId
      WHERE computerset.SN = ?
    `;
    const result = await db.query(query, serialNumber);

    // Transformar el resultado en el formato deseado
    const formattedResult = {};

    result.forEach((row) => {
      const {
        computer_id,
        computer_brand,
        HD,
        RAM,
        SN,
        model,
        computer_name,
        peripheircal_type,
        peripherical_id,
        peripherical_sn,
        peripherical_model,
        peripherical_brand,
      } = row;

      if (!formattedResult.id) {
        formattedResult.id = parseInt(computer_id);
        formattedResult.sn = peripherical_sn;
        formattedResult.ram = RAM;
        formattedResult.hd = HD;
        formattedResult.sn = SN;
        formattedResult.name = computer_name;
        formattedResult.model = model;
        formattedResult.brand = computer_brand;
        formattedResult.type = 'Desktop';
        formattedResult.peripherical = {};
      }

      switch (peripheircal_type) {
        case 'MONITOR':
          formattedResult.peripherical.display = {
            sn: peripherical_sn,
            model: peripherical_model,
            brand: peripherical_brand,
          };
          break;
        case 'MOUSE':
          formattedResult.peripherical.mouse = {
            sn: peripherical_sn,
            model: peripherical_model,
            brand: peripherical_brand,
          };
          break;
        case 'TECLADO':
          formattedResult.peripherical.keyboard = {
            sn: peripherical_sn,
            model: peripherical_model,
            brand: peripherical_brand,
          };
          break;
        default:
          break;
      }
    });
    if (result.length == 0) {
      return null
    }

    return formattedResult;
  } catch (error) {
    throw error;
  }
};

const getEquipmentById = async (id) => {
  try {
    const query = `
      SELECT 
        computerset.id AS computer_id, 
        computerset.brandId AS computer_brand,
        computerset.hardDrive AS HD,
        computerset.ram AS RAM,
        computerset.SN as SN,
        computerset.Name as computer_name,
        periphericaltype.name AS peripheircal_type,
        peripherical.id AS peripherical_id,
        peripherical.serialNumber AS peripherical_sn,
        peripherical.model AS peripherical_model,
        peripherical.brandId AS peripherical_brand
      FROM 
        computerset 
      JOIN 
        peripherical ON computerSetId = computerset.id  
      JOIN 
        periphericaltype ON periphericaltype.id = peripherical.typeId
      WHERE computerset.id = ?
    `;
    const result = await db.query(query, id);

    // Transformar el resultado en el formato deseado
    const formattedResult = {};

    result.forEach((row) => {
      const {
        computer_id,
        computer_brand,
        HD,
        RAM,
        SN,
        computer_name,
        peripheircal_type,
        peripherical_id,
        peripherical_sn,
        peripherical_model,
        peripherical_brand,
      } = row;

      if (!formattedResult.id) {
        formattedResult.id = parseInt(computer_id);
        formattedResult.sn = peripherical_sn;
        formattedResult.ram = RAM;
        formattedResult.hd = HD;
        formattedResult.sn = SN;
        formattedResult.name = computer_name;
        formattedResult.model = peripherical_model;
        formattedResult.brand = peripherical_brand;
        formattedResult.type = 'Desktop';
        formattedResult.peripherical = {};
      }

      switch (peripheircal_type) {
        case 'MONITOR':
          formattedResult.peripherical.display = {
            sn: peripherical_sn,
            model: peripherical_model,
            brand: peripherical_brand,
          };
          break;
        case 'MOUSE':
          formattedResult.peripherical.mouse = {
            sn: peripherical_sn,
            model: peripherical_model,
            brand: peripherical_brand,
          };
          break;
        case 'TECLADO':
          formattedResult.peripherical.keyboard = {
            sn: peripherical_sn,
            model: peripherical_model,
            brand: peripherical_brand,
          };
          break;
        default:
          break;
      }
    });

    return formattedResult;
  } catch (error) {
    throw error;
  }
};

const getAssignedEquipments = async (employeeId) => {
  ////console.log(employeeId)
  try {
    const query = ` SELECT * FROM computerassignation where employeeId = ?
    `;
    const result = await db.query(query, [employeeId]);

    return result;
  } catch (error) {
    throw error;
  }
};
function getCurrentDateTime() {
  const now = new Date();

  // Obtén los componentes de la fecha y hora
  const year = now.getFullYear();
  const month = padZero(now.getMonth() + 1); // Meses en JavaScript van de 0 a 11
  const day = padZero(now.getDate());
  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());

  // Formatea la fecha y hora en el formato de MySQL
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

// Función auxiliar para asegurarse de que los números tengan dos dígitos (agrega un cero al principio si es necesario)
function padZero(num) {
  return num.toString().padStart(2, '0');
}
const registerMaintenance = async (data) => {

  try {
    let date = new Date()
    const query = ` INSERT INTO maintenance
    ( 
      agentId, 
      equipmentSN, 
      date, 
      observation, 
      employeeId, 
      sedeId, 
      piso,
      previousName,
      currentName,
      hasDocument
    )   VALUES   (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    console.log(data.date)
    const result = await db.query(query, [
      data.agent.id,
      data.equipment.sn.toUpperCase(),
      data.date,
      data.observations,
      data.employee.id,
      data.sede,
      parseInt(data.piso.replace("S", '-1')),
      data.previousName||data.equipment.name,
      data.currentname||data.equipment.name,
      1
    ]);

    return result;
  } catch (error) {
    throw error;
  }
};

const registerActivity = async (maintenance, activity) => {

  try {
    let date = new Date()
    const query = ` INSERT INTO maintenancedetails
    ( 
      activityId, 
      maintenanceId
    )   VALUES   (?, ?);
    `;
    const result = await db.query(query, [activity, maintenance]);

    return result;
  } catch (error) {
    throw error;
  }
};

const getActivityTypes = async (activities) => {
  try {

    const query = `SELECT distinct CATEGORY FROM ACTIVITY WHERE ID IN (?) `;
    const result = await db.query(query, [activities]);
    console.log(result)

    return result;
  } catch (error) {
    throw error;

  }
}

const getMaintenancesBySedes = async () => {
  try {

    const query = ` SELECT
        sedes.name AS nombre_sede,
        COUNT(maintenance.id) AS cantidad_mantenimientos
    FROM
        sedes
    LEFT JOIN
        maintenance ON sedes.id = maintenance.sedeId
    WHERE
        MONTH(maintenance.date) = MONTH(CURRENT_DATE())
        AND YEAR(maintenance.date) = YEAR(CURRENT_DATE())
    GROUP BY
        sedes.id, sedes.name;`;
    const result = await db.query(query);
    console.log(result)

    return result;
  } catch (error) {
    throw error;

  }
}
const getMaintenancesBySedesTotal = async () => {
  try {

    const query = ` SELECT
        sedes.name AS nombre_sede,
        COUNT(maintenance.id) AS cantidad_mantenimientos
    FROM
        sedes
    LEFT JOIN
        maintenance ON sedes.id = maintenance.sedeId
    WHERE
        maintenance.id IS NOT NULL
         
    GROUP BY
        sedes.id, sedes.name
    order by cantidad_mantenimientos desc  `;
    const result = await db.query(query);
    console.log(result)

    return result;
  } catch (error) {
    throw error;

  }
}

const getMaintenancesByAgent = async () => {
  try {

    const query = `SELECT
        users.name AS nombre_tecnico,
        COUNT(maintenance.id) AS cantidad_mantenimientos
    FROM
        users
    LEFT JOIN
        maintenance ON users.id = maintenance.agentId
    WHERE
        MONTH(maintenance.date) = MONTH(CURRENT_DATE())
        AND YEAR(maintenance.date) = YEAR(CURRENT_DATE())
    GROUP BY
        users.id, users.name;`;
    const result = await db.query(query);
    console.log(result)

    return result;
  } catch (error) {
    throw error;

  }
}


const getMaintenances = async () => {
  try {

    const query = `SELECT maintenance.id, equipmentSN, date, users.name, employees.fullName, observation, hasDocument  FROM pandora.maintenance left join users on users.id = maintenance.agentId left join employees on employees.id = maintenance.employeeId order by id desc`;
    const result = await db.query(query);
    console.log(result)

    return result;
  } catch (error) {
    throw error;

  }
}

const createSede = async (sede) => {

  try {
    let date = new Date()
    const query = ` INSERT INTO sedes
    ( 
      name    )   VALUES   (?);
    `;
    const result = await db.query(query, [sede.name]);

    return result;
  } catch (error) {
    throw error;
  }
};
const getMonthlyMaintenanceDataForChart = async () => {
  try {
    const query = `
      SELECT 
        DATE_FORMAT(date, '%Y') AS year,
        DATE_FORMAT(date, '%m') AS month,
        COUNT(id) AS maintenanceCount
      FROM maintenance
      GROUP BY year, month
      ORDER BY year, month;
    `;

    const result = await db.query(query);
    return result;
  } catch (error) {
    throw error;
  }
};

const getMaintenanceStats = async () => {
  try {
    const query = `
    SELECT
        COUNT(DISTINCT m.id) AS total,
        COUNT(DISTINCT CASE WHEN at.name = 'SOFTWARE' OR at.name IS NULL THEN m.id END) AS software,
        COUNT(DISTINCT CASE WHEN at.name = 'HARDWARE' OR at.name IS NULL THEN m.id END) AS hardware,
        COUNT(DISTINCT m.id) AS both_software_hardware,
        COALESCE((COUNT(DISTINCT m.id) / NULLIF((SELECT value FROM configuration WHERE configuration.key = 'GOAL'), 0)), 0) * 100 AS completion_percentage,
        (SELECT value FROM configuration WHERE configuration.key = 'GOAL') AS goal_value
    FROM
        maintenance AS m
    LEFT JOIN
        maintenancedetails AS d ON m.id = d.maintenanceId
    LEFT JOIN
        pandora.activity AS a ON a.id = d.activityId
    LEFT JOIN
        pandora.activity_type AS at ON a.category = at.id
    LEFT JOIN
        configuration AS start_config ON start_config.key = 'START_DATE'
    LEFT JOIN
        configuration AS end_config ON end_config.key = 'END_DATE'
    WHERE
        start_config.value IS NOT NULL AND end_config.value IS NOT NULL
        AND (m.date BETWEEN start_config.value AND end_config.value OR at.name IS NULL)`;
    const result = await db.query(query);
    return result;

  } catch (err) {
    throw error;
  }
}

const getBurndown = async () => {

  try {
    const query = `
    SELECT
        month,
        total,
        (SELECT value FROM configuration WHERE configuration.key = 'GOAL') AS goal_value,
        (SELECT value FROM configuration WHERE configuration.key = 'GOAL') - total AS remaining
    FROM (
        SELECT
            DATE_FORMAT(MAX(m.date), '%Y-%m') AS month,
            (SELECT COUNT(DISTINCT m_inner.id)
            FROM maintenance AS m_inner
            WHERE DATE_FORMAT(m_inner.date, '%Y-%m') <= DATE_FORMAT(MAX(m.date), '%Y-%m')) AS total
        FROM
            maintenance AS m
        LEFT JOIN
            configuration AS start_config ON start_config.key = 'START_DATE'
        LEFT JOIN
            configuration AS end_config ON end_config.key = 'END_DATE'
        WHERE
            start_config.value IS NOT NULL AND end_config.value IS NOT NULL
            AND m.date BETWEEN start_config.value AND end_config.value
        GROUP BY
            DATE_FORMAT(m.date, '%Y-%m')
        ORDER BY
            month
    ) AS t;
    `
    const result = db.query(query);
    return result;
  } catch (error) {
    throw error;
  }

}

const getAgentCountByMonth = (year, month) => {
  try {
    const query = `SELECT
  users.id AS agent_id,
  users.name AS agent_name,
  COALESCE(maintenance_data.maintenance_count, 0) AS maintenance_count,
  COALESCE(all_months_data.average_maintenance_count, 0) AS average_maintenance_count
FROM
  users
LEFT JOIN
  (
      SELECT
          agentId,
          COUNT(maintenance.id) AS maintenance_count
      FROM
          maintenance
      WHERE
          YEAR(maintenance.date) = ? AND MONTH(maintenance.date) = ?
      GROUP BY
          agentId
  ) AS maintenance_data ON maintenance_data.agentId = users.id
LEFT JOIN
  (
      SELECT
          agentId,
          AVG(maintenance_count) AS average_maintenance_count
      FROM
          (
              SELECT
                  agentId,
                  COUNT(maintenance.id) AS maintenance_count
              FROM
                  maintenance

              GROUP BY
                  agentId, EXTRACT(YEAR_MONTH FROM maintenance.date)
          ) AS monthly_counts
      WHERE agentId IS NOT NULL  -- Añadido para excluir registros nulos
      GROUP BY
          agentId
  ) AS all_months_data ON all_months_data.agentId = users.id
WHERE
  maintenance_data.agentId IS NOT NULL;  -- Excluir usuarios sin registros en maintenance
`;
    const result = db.query(query, [year, month])
    return result;

  } catch (error) {
    throw error;
  }
}
const createComputer = (aranda_data)=> {
  return new Promise(async (resolve) => {
   
    console.log(aranda_data)

      // Insertar los datos del usuario junto con los IDs en la tabla employees
      const query = `
      INSERT INTO computerset 
      (typeId,  SN, model, brandId,  ram,    hardDrive,  Name, statusId)
       
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      console.log("DATA QUE SE INSERTARA:",aranda_data)
      const values = [aranda_data.type, aranda_data.serial.toUpperCase(), aranda_data.model, aranda_data.brand, aranda_data.ram, aranda_data.hd, aranda_data.name.toUpperCase(), 1];
      console.log(values);

    
    


      equipment = await db.query(query, values);

      console.log(equipment)


      equipment = await getEquipmentById(equipment.insertId);

      resolve(equipment);

  })


  // Eliminar el encabezado si es necesario (si la primera fila son nombres de columna)

  //console.log('Users data loaded successfully');
}

const generateGeneralReport = async (req, res) => {
  return new Promise(async resolve => {
    const query = `
    SELECT 
    UPPER(e.username) as "USUARIO DIRECTORIO ACTIVO",
    UPPER(e.fullName) AS "NOMBRES Y APELLIDOS",
      UPPER(e.email) AS "CORREO FUNCIONARIO", 
      UPPER(e.register) AS REGISTRO,
      e.document as CEDULA,
      e.mobile as "NUMERO DE CONTACTO",
      UPPER(ma.name) AS GERENCIA,
    UPPER(dp.name) AS DEPARTAMENTO,
      UPPER(ar.name) AS AREA,
      UPPER(m.equipmentSN) AS SERIAL,
      UPPER(ct.name) as "CLASE DE EQUIPO",
      IFNULL(e.mobile, e.ext) AS "NUMERO DE CONTACTO",
      UPPER(cs.name) as "NOMBRE NUEVO",
      substr((
          CASE 
              WHEN LENGTH(ma.name) - LENGTH(REPLACE(ma.name, ' ', '')) < 3 
                  THEN ma.name -- Si hay 3 o menos palabras, mantener la gerencia original
              ELSE
                  CONCAT(
                      SUBSTRING(sd.name, 1, 3),
                      LPAD(SUBSTRING(REPLACE(IFNULL(m.piso, ''), '-', 'S'), 1, 2), 2, '0'),
                      UPPER(LEFT(ma.memotecnia, 3)), -- Tomar las primeras 3 letras del campo 'mnemonic' de 'managements'
                      UPPER(e.username)
                  )
          END
      ),1,15) AS "NOMBRE ACTUAL",
      UPPER(brand.name) as "MARCA",
      UPPER(cs.model) as "MODELO",
      UPPER(cs.ram) as "MEMORIA RAM",
      UPPER(cs.hardDrive) as "DISCO DURO",
      UPPER(sd.name) AS SEDE,
      UPPER(LPAD(SUBSTRING(REPLACE(IFNULL(m.piso, ''), '-', 'S'), 1, 2), 2, '0')) AS PISO,
      UPPER(u.name) AS "TECNICO QUE REALIZA EL MANTENIMIENTO",
      DATE_FORMAT(m.date, '%d-%m-%Y') AS "FECHA DEL MANTENIMIENTO"
  FROM 
      maintenance m
  LEFT JOIN 
      computerSet cs ON m.equipmentSN = cs.sn
  LEFT JOIN 
      employees e ON m.employeeId = e.id
  LEFT JOIN 
      users u ON m.agentId = u.id
  LEFT JOIN 
      managements ma ON ma.id = e.managementId
  LEFT JOIN 
      areas ar ON ar.id = e.areaId
  LEFT JOIN 
      departments dp ON dp.id = e.departmentId
  LEFT JOIN 
      sedes sd ON sd.id = m.sedeId
  LEFT JOIN	
    computertype ct ON ct.id = cs.typeId
  LEFT JOIN
    brand	brand on brand.id = cs.brandId
  ORDER BY 
      m.date ASC;
  
    `;

    let results = await db.query(query)

    let csvContent = Object.keys(results[0]).join(';') + '\n'; // Encabezados
    results.forEach(result => {
      csvContent += Object.values(result).map(value => `"${value}"`).join(';') + '\n';
    });

    const currentDirectory = __dirname;
    const formattedDateTime = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/[-/:,]/g, '');

    const csvPath = path.join(currentDirectory, '..', 'files', 'GENERATED', 'ReporteMantenimientoGeneral'+formattedDateTime+".csv");

    fs.writeFile(csvPath, csvContent, 'utf8', (err) => {
      if (err) {
        console.error('Error al generar el archivo CSV:', err);
      } else {
        console.log(`Archivo CSV generado: ${csvPath}`);
      }

      resolve(csvPath);
    })
  })
}

module.exports = {
  getEmployee,
  getActivitiesByCategory,
  getManagements,
  getAreas,
  getDepartments,
  getEquipment,
  getAssignedEquipments,
  getEquipmentById,
  getSedes,
  registerMaintenance,
  registerActivity,
  getActivityTypes,
  createEmployee,
  updateEmployee,
  getMaintenancesBySedes,
  getMaintenances,
  createSede,
  getSedeByName,
  getMonthlyMaintenanceDataForChart,
  getMaintenanceStats,
  getBurndown,
  getAgentCountByMonth,
  getBrands,
  getTypes,
  createComputer,
  getBrand,
  updateName,
  getSedeById,
  getMaintenancesByAgent,
  getMaintenancesBySedesTotal,
  generateGeneralReport

}
