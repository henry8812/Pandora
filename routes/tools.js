const express = require('express');
const router = express.Router();
const articles = require("../DAO/articles");
const resources = require("../DAO/resources")
const guides = require('../DAO/guides')
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');
const { Console } = require('console');
const users = require('../DAO/users'); // Importa el módulo users
const tools = require('../DAO/tools');
const tools2 = require('../DAO/ananda');
const toolsController = require('../controllers/tools');
const path = require('path');



router.get('/activities', async (req, res) => {
  try {
    const activitiesByCategory = await tools.getActivitiesByCategory();
    
    // Objeto para almacenar actividades por categoría
    const activitiesGroupedByCategory = {};
    //console.log(activitiesByCategory)

    // Organizar actividades por categoría
    activitiesByCategory.forEach(activity => {
      const { category_name, short_description } = activity;
      if (!activitiesGroupedByCategory[category_name]) {
        activitiesGroupedByCategory[category_name] = [];
      }
      activitiesGroupedByCategory[category_name].push(activity);
    });

    res.json(activitiesGroupedByCategory);
  } catch (error) {
    //console.log(error)
    res.status(500).json({ error: 'Error al obtener actividades por categoría' });
  }
});


  router.get('/guides', async(req, res) => {
    // Lógica para cerrar sesión del usuario
    //console.log("guides")
    let items = await guides.listToolsGuides();
    //console.log(items)
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let author = email;
    let user = await users.getUserByEmail(email);
    res.render('guides/index', { title: 'Articles', guides: items, user:user, req });
  });

  router.get('/form', async(req, res) => {
    // Lógica para cerrar sesión del usuario
    //TODO: consultar la informacion necesaria para las consultas de base de datos.
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let author = email;
    let user = await users.getUserByEmail(email);
    let date = new Date();
    let managements = await tools.getManagements();
    let areas = await tools.getAreas();
    let departments = await tools.getDepartments();
    let sedes = await tools.getSedes();
    let brands = await tools.getBrands();
    let types = await tools.getTypes();
    res.render('tools/form', { title: 'Maintenance', user:user, date :date.toLocaleDateString(), data : {
      areas : areas,
      departments : departments,
      managements : managements,
      sedes : sedes,
      brands : brands,
      types : types
    }, req  });
  });

  router.get('/query/:username', async(req,res) => {
    let employee = await tools.getEmployee(req.params.username);
    
    let equipments = []
    
    res.send({
      status: 'success',
      employee : employee,
      equipment : equipments
    });
  })


  router.get('/employee/:username/:register/:document', async(req,res) => {
    
    let employee = await tools.getEmployee(req.params.username,req.params.register, req.params.document)
    
    //console.log(employee)
    res.send({
      status : employee.length == 1 ? "sucess" : "failed",
      employee  : employee
    });
  })

  
  router.get('/computer2/:sn', async(req,res) => {
    let computerset = await tools.getEquipment(req.params.sn)
    if(computerset== null){
      let data = tool2.getDevice(req.params.sn);
    } 
    //console.log(computerset)
    res.send({
      status : "success",
      data : computerset
    });
  })
  router.post("/employees", async(req, res) => {
    let employee = req.body;
    let response = await tools.createEmployee(employee);
    res.send(response);
  })
  router.post("/equipment", async(req, res) => {
    let equipment = req.body;
    console.log("ESTO LLEGA:",equipment)
    let response = await tools.createComputer(equipment);
    res.send(response);
  })
  
  router.put("/employees", async(req, res) => {
    let employee = req.body;
    let response = await tools.updateEmployee(employee);
    res.send(response);
  })
  

  router.post('/maintenance', async(req, res) => {

    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let author = email;
    let user = await users.getUserByEmail(email);
    let data = req.body
    data.agent = user
    let maintenance = await tools.registerMaintenance(data);
    if(data.previousName !== data.currentName){
      await tools.updateName(data.equipment.sn, data.currentName);
    }
    

    console.log(maintenance)
    for(let i=0; i<data.activities.length;i++){
      let activity =data.activities[i];
      let detail = await tools.registerActivity(maintenance.insertId, activity);
      console.log(detail)
    }
    data.maintenance = maintenance.insertId
    let types = await tools.getActivityTypes(data.activities);
    data.types = types;
    data.agent = user;
    console.log(data.equipment)
    

    let document = await toolsController.generateRegisterDocument(data);
    
    res.send({
      status : "success",
      data : data,
      maintenance : maintenance.insertId,
      document : document
    })

  })

  router.get('/computer/:sn', async(req,res) => {
    let computerset = await tools2.getDevice(req.params.sn)
    let computerset2 = await tools.getEquipment(req.params.sn)
    console.log(computerset)
    console.log(computerset2)
    
    let data = null;
    if (computerset.length > 0) {
      data = {
      
        "sn": req.params.sn,
        "ram":computerset2 == null ? computerset[0].TAMAÑO_MEMORIA_RAM : computerset2.ram,
        "hd":computerset2 == null ? computerset[0].CAPACIDAD_DISCO1 : computerset2.hd,
        "name":computerset[0].NOMBRE_EQUIPO || computerset2 == null ? '' : computerset2.name ,
        "model":computerset[0].MODELO_EQUIPO,
        "brand":computerset[0].MARCA_EQUIPO,
        "type": computerset2 == null ? computerset[0].CLASE_EQUIPO  : computerset2.type,
        "peripherical":{
          "display":{
            "sn":computerset[0].SERIAL_MONITOR1,
            "model":computerset[0].MODELO_MONITOR1,
            "brand": computerset2 == null ? null : (computerset2.peripherical.display == undefined ? computerset[0].MARCA_EQUIPO :  computerset2.peripherical.display.brand)
          },
          "mouse": computerset2 == null ? null :  computerset2.peripherical.mouse,
          "keyboard": computerset2 == null ? null : computerset2.peripherical.keyboard
          
        }
      }
      response = {
        status : "success",
        data : data
      }
      res.send(response)

    } else if(computerset2 !== null ) {
      console.log("DATA QUE RECUPERA:", computerset2)
      computerset2.brand = await tools.getBrand(computerset2.brand)
      data = {
      
        "sn": req.params.sn,
        "ram":computerset2.ram,
        "hd":computerset2.hd,
        "name":computerset2.name,
        "model":computerset2.model || "",
        "brand":computerset2.brand,
        "type": computerset2.type,
        "peripherical":{
          
        }
      }
      response ={
        status : "success",
        data : data
      }
      res.send(response)
  
    } else {
      data = {}
      response = {
        status : "failed",
        message : "No hay resultados, pero puedes solicitar que se cree el equipo enviando NOMBRE EQUIPO, SERIAL, MARCA, MODELO, RAM, TAMAÑO DISCO, TIPO DE EQUIPO al ws 3104155557"
      };
      res.send(response)
    }
    
    console.log(data)

    /**
     * 1. CREAR FUNCION PARA CREAR COMPUTERSET DENTRO DE DAO/TOOLS
     * 2. CREAR FUNCION PARA CREAR PERIFERIFCOS PARA UN COMPUTERSET DENTRO DE DAO/TOOLS
     * 3. LLAMAR LA FUNCION PARA CREAR EL COMPUTERSET EN CASO DE NO EXISITR EN BASE DE DATOS
     * 4. CREAR FUNCION PARA ACTUALIZAR O REMOVER PERIFERICOS DE UN EQUIPO
     * 5. CREAR FUNCION PARA ACTUALIZAR UN EQUIPO
     * 6. CREAR FUNCION PARA GUARDAR REGISTRO DE MANTENIMIENTO
     **/

  })
  router.get("/maintenances", async(req, res) => {
    let maintenances = await tools.getMaintenances();
    res.send({
      status : "success",
      maintenances : maintenances
    })
  })

  router.get("/maintenancesMonth", async(req, res) => {
    let maintenances = await tools.getMonthlyMaintenanceDataForChart();
    res.send({
      status : "success",
      data : maintenances
    })
  })

  router.get("/maintenanceStats", async(req, res) => {
    let stats = await tools.getMaintenanceStats();
    res.send({
      status : "success",
      data : stats
    })
  })
  router.get("/maintenanceRemaining", async(req, res) => {
    let data = await tools.getBurndown();
    res.send({
      status : "success",
      data : data
    })
  })
  
  

  
  router.get("/maintenances/sedes", async(req, res) => {
    let maintenances = await tools.getMaintenancesBySedes();
    res.send({
      status : "success",
      maintenances : maintenances
    })
  })

  router.post('/load-pdf/:idMantenimiento', async (req, res) => {
    try {
        const idMantenimiento = req.params.idMantenimiento;
        const archivoPDF = req.files.archivoPDF; // Asegúrate de enviar el archivo PDF en la solicitud con el nombre 'archivoPDF'

        // Verificar si se recibió el archivo
        if (!archivoPDF) {
            return res.status(400).json({ status: 'error', message: 'Por favor, carga un archivo PDF.' });
        }

        // Definir la ruta donde se guardará el archivo
        const rutaGuardado = path.join(__dirname, '..', 'archivos', `MANTENIMIENTO_ID_${idMantenimiento}.pdf`);

        // Guardar el archivo en el sistema de archivos
        archivoPDF.mv(rutaGuardado, async (err) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Error al guardar el archivo PDF.' });
            }

            // Lógica para procesar el archivo PDF y asociarlo al registro de mantenimiento
            const resultado = await toolsController.procesarYGuardarPDF(idMantenimiento, rutaGuardado);

            res.json({ status: 'success', message: 'Archivo PDF cargado y asociado al registro de mantenimiento exitosamente' });
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al cargar y asociar el archivo PDF al registro de mantenimiento' });
    }
});
router.post("/sedes", async(req, res) => {
  let data = req.body;
  let response = await tools.createSede(data)
  res.send(response);
})
  
router.get("/agentByMonth", async(req, res) => {
  let {year, month} = req.params;
  let response = await tools.getAgentCountByMonth(year, month);
  res.send(response)
})

  module.exports = router;
