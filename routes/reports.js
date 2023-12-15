const express = require('express');
const router = express.Router();
const reports = require("../DAO/reports");


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

router.get('/getAccessData', async(req, res) => {
  // Lógica para cerrar sesión del usuario
  console.log(req.query)
  
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
