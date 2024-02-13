const express = require('express');
const router = express.Router();
const reports = require("../DAO/reports");
const tools = require("../DAO/tools");
const path = require('path');


router.get('/', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  

  res.render('reports/index', {req });
});
router.get('/maintenance', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  let dataBySeeds = await tools.getMaintenancesBySedes();
  let dataByAgent = await tools.getMaintenancesByAgent();
  let sedesTotal = await tools.getMaintenancesBySedesTotal();
  let totalGeneral = 0;
  for(let i=0; i< sedesTotal.length; i++){
    totalGeneral += sedesTotal[i].cantidad_mantenimientos;
  }
  console.log(dataByAgent)
  console.log(dataBySeeds)
  res.render('reports/maintenance', {req, data :{
  sedes : dataBySeeds,
  technician : dataByAgent,
  sedesTotal : sedesTotal,
  totalGeneral : totalGeneral
  } });
});

router.get('/access', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

  res.render('reports/access', { title: 'Access Report', now : currentDate, req });
});

router.get('/getAccessLogs', async(req, res) => {
  
  let accessLogs = await reports.getAccessLogs(req.query.start, req.query.end);
  
  res.send(accessLogs)
  //render('reports/access', { title: 'Access Report', data: accessData, req });
});
router.get("/tools/general", async(req, res) => {
  try {
    const url = await tools.generateGeneralReport();

    // Enviar el archivo al cliente
    res.sendFile(url, (err) => {
      if (err) {
        console.error('Error al enviar el archivo:', err);
        res.status(500).send('Error interno del servidor');
      }
    });
  } catch (error) {
    console.error('Error al generar el informe general:', error);
    res.status(500).send('Error interno del servidor');
  }})

router.get('/getAccessData', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  //console.log(req.query)
  
  let accessData = await reports.getAccessData(req.query.start, req.query.end);
  // Crear un objeto para almacenar los contadores por día y las horas por día
  const result = {};
  
  // Procesar los datos
  accessData.forEach((row) => {
    const { id, user_id, timestamp, name } = row;
    const day = timestamp.toISOString().split('T')[0];
    const hour = timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Incrementar el contador por día
    if (!result[day]) {
      result[day] = {
        day,
        count: 1,
        hours: [hour],
      };
    } else {
      result[day].count += 1;
      result[day].hours.push(hour);
    }
  });
  
  // Crear el objeto JSON en el formato deseado
  const labels = Object.keys(result);
  const dataValues = labels.map((day) => result[day].count);
  
  
  
  res.send({
    data: dataValues,
    labels : labels
  })
  //render('reports/access', { title: 'Access Report', data: accessData, req });
});


router.get('/use', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  
  let useData = await reports.getUseData();
  
  
  res.render('reports/use', { title: 'Use Report', data: useData, req });
});


module.exports = router;
