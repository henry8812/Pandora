let employee = null;
let equipment = null;
let activities = [];
let observations = null;
let maintenance = null;
let previousName = null;
let getComment = function () {

  let comment = tinymce.get("comment").getContent();
  return comment;
}

$(".nav-link").click(function () {
  // Remover la clase 'active' de todos los tabs y contentTabs
  $(".nav-link").removeClass("active");
  $(".contentTab").removeClass("active");

  // Obtener el ID del tab haciendo clic
  var id = $(this).data("id");

  // Agregar la clase 'active' al tab seleccionado y su contenido correspondiente
  $(this).addClass("active");
  $("#tab-" + id).addClass("active");
});


$(document).ready(function () {
  // Cuando se hace clic en un botón de encabezado de acordeón
  $(".card-header button").click(function () {
    var $collapse = $(this).closest('.card-header').next('.collapse');

    // Si el acordeón está abierto
    if ($collapse.hasClass('show')) {
      // Oculta el acordeón
      $collapse.collapse('hide');
    } else {
      // Oculta otros acordeones abiertos
      $(".collapse.show").collapse('hide');
      // Muestra el acordeón clicado
      $collapse.collapse('show');
    }
  });
});



function getAssignedEquipment(sn) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    const endpointURL = `/tools/computer/${sn}`;

    xhr.open('GET', endpointURL, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          ////console.log(data)
          
          if(data.status == 'failed'  ) {
            resolve(null);
            
          } else {
            resolve(data.data)
          }
          

          //populateForm(data);

        } else {
          console.error('Hubo un problema con la solicitud:', xhr.statusText);
        }
      }
    };

    xhr.send();

  })


}

function getEmployee(username, register, documento) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const endpointURL = `/tools/employee/${username || 'xx'}/${register || 'xx'}/${documento || 'xx'}`;

    xhr.open('GET', endpointURL, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          ////console.log(data)
          if (data.status == "sucess") {
            employee = data.employee[0];
            ////console.log(data.employee)
            $("[name=management]").val(employee.managementID);
            $("[name=department]").val(employee.departmentId);
            $("[name=area]").val(employee.areaId);
            $("[name=fullName]").val(employee.fullName);
            $("[name=register]").val(employee.register);
            $("[name=username]").val(employee.username);
            $("[name=document]").val(employee.document);
            $("[name=ext]").val(employee.ext);
            $("[name=mobile]").val(employee.mobile);
            $("[name=email]").val(employee.email);
            
            resolve(employee)
          } else if (data.employee.length > 1) {
            alert("La consulta ha obtenido mas de 1 resultado, vuelve a intentarlo")
            resolve(null)
          } else {
            alert("El nombre de usuario no tiene resultados")
            resolve(null)
          }


        } else {
          console.error('Hubo un problema con la solicitud:', xhr.statusText);
        }
      }
    };

    xhr.send();

  })

}


function createAccordionTemplate(equipo, index) {
  return `
    <div class="card">
      <div class="card-header" id="heading${index + 1}">
        <h2 class="mb-0">
          <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${index + 1}"
            aria-expanded="false" aria-controls="collapse${index + 1}">
            ${equipo.type} - ${equipo.sn} - ${equipo.name}
          </button>
        </h2>
      </div>
      <div id="collapse${index + 1}" class="collapse" aria-labelledby="heading${index + 1}"
        
        <div class="row " id="INFO">
          <div class="row">
              <div class="col-md-10 mx-auto mt-2">
                <div class="card mb-4 rounded-3 shadow-sm">
                  <div class="card-header py-3">
                    <h4 class="my-0 fw-normal">CPU</h4>
                  </div>
                  <div class="card-body">
                    <form id="cpu-info" class="pt-4">
                      <div class="row">
                        <div class="input-group input-group-sm mb-3 col">
                          <span class="input-group-text" id="inputGroup-sizing-sm">CPU SN</span>
                          <input type="text" class="form-control" aria-label="CPU Serial Number"
                            aria-describedby="inputGroup-sizing-sm" value="${equipo.sn}">
                        </div>

                      </div>
                      <div class="row">
                        <div class="input-group input-group-sm mb-3 col">
                       
                            <span class="input-group-text" id="inputGroup-sizing-sm">NOMBRE ACTUAL</span>
                            <input type="text" class="form-control" aria-label="CPU NAME" id="computerName" value="${equipo.name}"
                              aria-describedby="inputGroup-sizing-sm">
                       
                        </div>

                      </div>
                      <div class="row">
                        <div class="input-group input-group-sm mb-3 col">
                       
                            <span class="input-group-text" id="inputGroup-sizing-sm">NOMBRE NUEVO</span>
                            <input type="text" class="form-control" style="text-transform: uppercase;" aria-label="CPU NAME" id="newName" value="${equipo.name}"
                              aria-describedby="inputGroup-sizing-sm">
                       
                        </div>

                      </div>
                      


                      <div class="row">
                        <div class="input-group input-group-sm mb-3 col">
                          <span class="input-group-text" id="inputGroup-sizing-sm">Modelo</span>
                          <input type="text" class="form-control" aria-label="CPU Name" value="${equipo.model.toUpperCase()}"
                            aria-describedby="inputGroup-sizing-sm">
                        </div>
                      

                      </div>
                      <div class="row">
                      
                      <div class="input-group input-group-sm mb-3 col">
                        <span class="input-group-text" id="inputGroup-sizing-sm">Marca</span>
                        <input type="text" class="form-control" aria-label="CPU Name" value="${equipo.brand.toUpperCase()}"
                          aria-describedby="inputGroup-sizing-sm">
                      </div>

                    </div>
                      <div class="row">

                        <div class="input-group input-group-sm mb-3 col">
                          <span class="input-group-text" id="inputGroup-sizing-sm">RAM</span>
                          <input type="text" class="form-control" aria-label="CPU Serial Number" value="${equipo.ram}"
                            aria-describedby="inputGroup-sizing-sm">
                        </div>

                        <div class="input-group input-group-sm mb-3 col">
                          <span class="input-group-text" id="inputGroup-sizing-sm">Disco</span>
                          <input type="text" class="form-control" aria-label="CPU Name" value="${equipo.hd}"
                            aria-describedby="inputGroup-sizing-sm">
                        </div>

                      </div>



                    </form>
                    <!--<button type="button" class="w-50 btn btn-sm btn-success">ACTUALIZAR</button>-->
                  </div>
                </div>

              </div>
              
              <div class="col-md-10 mx-auto">
                <div class="card mb-4 rounded-3 shadow-sm">
                  <div class="card-header py-3">
                    <h4 class="my-0 fw-normal">PERIFERICOS</h4>
                  </div>
                  <div class="card-body">
                    <h1 class="card-title pricing-card-title">MONITOR</small>
                    </h1>
                    <div class="row">
                      <div class="input-group input-group-sm mb-3 col">
                        <span class="input-group-text" id="inputGroup-sizing-sm">SN</span>
                        <input type="text" class="form-control" aria-label="DISPLAY SN" value="${null !== equipo.peripherical.display && equipo.peripherical.display !== undefined ? equipo.peripherical.display.sn : ''}"
                          aria-describedby="inputGroup-sizing-sm">
                      </div>


                      <div class="input-group input-group-sm mb-3 col">
                        <span class="input-group-text" id="inputGroup-sizing-sm">MODELO</span>
                        <input type="text" class="form-control" aria-label="DISPLAY MODEL" value="${null !== equipo.peripherical.display && equipo.peripherical.display !== undefined ? equipo.peripherical.display.model : ''}"
                          aria-describedby="inputGroup-sizing-sm">
                      </div>
                      <div class="input-group input-group-sm mb-3 col">
                        <span class="input-group-text" id="inputGroup-sizing-sm">MARCA</span>
                        <input type="text" class="form-control" aria-label="DISPLAY BRAND" value="${null !== equipo.peripherical.display && equipo.peripherical.display !== undefined ? equipo.peripherical.display.brand : ''}"
                          aria-describedby="inputGroup-sizing-sm">
                      </div>


                    </div>
                    <h1 class="card-title pricing-card-title">TECLADO</small>
                    </h1>
                    <div class="row">
                      <div class="input-group input-group-sm mb-3 col">
                        <span class="input-group-text" id="inputGroup-sizing-sm">SN</span>
                        <input type="text" class="form-control" aria-label="KEYBOARD SN" value="${null !== equipo.peripherical.keyboard && equipo.peripherical.keyboard !== undefined ? equipo.peripherical.keyboard.sn : ''}"
                          aria-describedby="inputGroup-sizing-sm">
                      </div>


                      <div class="input-group input-group-sm mb-3 col">
                        <span class="input-group-text" id="inputGroup-sizing-sm">MODELO</span>
                        <input type="text" class="form-control" aria-label="KEYBOARD MODEL" value="${null !== equipo.peripherical.keyboard && equipo.peripherical.keyboard !== undefined ? equipo.peripherical.keyboard.model : ''}"
                          aria-describedby="inputGroup-sizing-sm">
                      </div>
                      <div class="input-group input-group-sm mb-3 col">
                        <span class="input-group-text" id="inputGroup-sizing-sm">MARCA</span>
                        <input type="text" class="form-control" aria-label="KEYBOARD BRAND" value="${null !== equipo.peripherical.keyboard && equipo.peripherical.keyboard !== undefined ? equipo.peripherical.keyboard.brand : ''}"
                          aria-describedby="inputGroup-sizing-sm">
                      </div>


                    </div>
                    <h1 class="card-title pricing-card-title">MOUSE</small>
                    </h1>
                    <div class="row">
                      <div class="input-group input-group-sm mb-3 col">
                        <span class="input-group-text" id="inputGroup-sizing-sm">SN</span>
                        <input type="text" class="form-control" aria-label="MOUSE SN" value="${null !== equipo.peripherical.mouse && equipo.peripherical.mouse !== undefined ? equipo.peripherical.mouse.sn : ''}"
                          aria-describedby="inputGroup-sizing-sm">
                      </div>


                      <div class="input-group input-group-sm mb-3 col">
                        <span class="input-group-text" id="inputGroup-sizing-sm">MODELO</span>
                        <input type="text" class="form-control" aria-label="MOUSE MODEL"  value="${null !== equipo.peripherical.mouse && equipo.peripherical.mouse !== undefined ? equipo.peripherical.mouse.model : ''}"
                          aria-describedby="inputGroup-sizing-sm">
                      </div>
                      <div class="input-group input-group-sm mb-3 col">
                        <span class="input-group-text" id="inputGroup-sizing-sm">MARCA</span>
                        <input type="text" class="form-control" aria-label="MOUSE BRAND"  value="${null !== equipo.peripherical.mouse && equipo.peripherical.mouse !== undefined ? equipo.peripherical.mouse.brand : ''}"
                          aria-describedby="inputGroup-sizing-sm">
                      </div>


                    </div>


                    <!--<button type="button" class="w-50 btn btn-sm btn-success">ACTUALIZAR</button>-->
                  </div>
                </div>
              </div>
              </div>

              <div id="activities" class="accordion"></div>
              <div class="comment-form col-11 mx-auto mt-4">
                  <textarea id="comment" placeholder="Escribe las obseraciones"></textarea>
              </div>
              <hr>
              <!-- Sección de Firma del Técnico -->
<div class="row">
  <div class="container" style="display:block">
    <h3 style="text-align: center;">Firma del Técnico</h3>
    <br/>
    <canvas id="tecnico"></canvas>
    <br/>
    <button class="btn btn-danger" id="limpiarFirmaTecnico">LIMPIAR</button>
  </div>
</div>

<!-- Sección de Firma del Funcionario -->
<div class="row">
<div class="container" style="display:block">
    <h3 style="text-align: center;">Firma del Funcionario</h3>
    <br/>
    <canvas id="funcionario"></canvas>
    <br/>
    <button class="btn btn-danger" id="limpiarFirmaFuncionario">LIMPIAR</button>
  </div>
</div>

<!-- Botón de Registro -->
<button class="btn btn-success" id="registerAction" data-id="${equipo.id}">REGISTRAR</button>
<button class="d-none" id="descargarBtn">Descargar Archivo</button>

<hr>

      </div>
    </div>
  `;
}

async function createActivityAccordions(equipoId) {

  let activities = await getActivities();
  // Plantilla de un checkbox de actividad
  function createActivityCheckbox(activity) {
    return `
      <div class="form-check col-md-6 col-sm-4 col-lg-6">
        <input class="form-check-input activityCheck" type="checkbox" value="${activity.id}" data-id="${activity.id}" name="activityInput">
        <label class="form-check-label" for="${activity.id}">
          ${activity.short_description}
        </label>
      </div>
    `;
  }

  // Plantilla de un acordeón de actividades
  function createAccordion(category, activities) {
    ////console.log(activities)
    const activityCheckboxes = activities.map(activity => createActivityCheckbox(activity)).join('');
    ////console.log(activityCheckboxes)
    return `
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading${category}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${category}" aria-expanded="true" aria-controls="collapse${category}">
            ${category}
          </button>
        </h2>
        <div id="collapse${category}" class="accordion-collapse collapse" aria-labelledby="heading${category}">
          <div class="accordion-body content">
            <div class="row">
            ${activityCheckboxes}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const softwareAccordion = createAccordion('Software', activities["SOFTWARE"]);
  const hardwareAccordion = createAccordion('Hardware', activities["HARDWARE"]);

  // Reemplazar [[ACTIVITIES]] con los acordeones generados

  ////console.log(softwareAccordion)



  const templateWithActivities = (softwareAccordion + hardwareAccordion);

  return templateWithActivities;
}


function populateForm(data) {
  ////console.log(data)
  const equipos = data.equipment;
  const setsContainer = document.getElementById('SETS');
  setsContainer.innerHTML = ''


  equipos.forEach(async (equipo, index) => {
    ////console.log(equipo)   
    document.querySelector("#nombre-equipo2").value = equipo.name
    const accordionHTML = createAccordionTemplate(equipo, index);
    ////console.log(equipo.peripherical.display)
    setsContainer.insertAdjacentHTML('beforeend', accordionHTML);
    let resp = await createActivityAccordions(equipo.id);
    ////console.log(resp)
    const container = document.getElementById('activities');
    container.insertAdjacentHTML('beforeend', resp);
    let activities = $("#activities")


  });

  $(".card-header button").click(function () {
    var $collapse = $(this).closest('.card-header').next('.collapse');

    // Si el acordeón está abierto
    if ($collapse.hasClass('show')) {
      // Oculta el acordeón
      $collapse.collapse('hide');
    } else {
      // Oculta otros acordeones abiertos
      $(".collapse.show").collapse('hide');
      // Muestra el acordeón clicado
      $collapse.collapse('show');
    }
  });
  const tecnicoCanvas = document.querySelector('#tecnico');
  const funcionarioCanvas = document.querySelector('#funcionario');

  const tecnicoSignaturePad = new SignaturePad(tecnicoCanvas);
  const funcionarioSignaturePad = new SignaturePad(funcionarioCanvas)





}

async function getActivities() {
  return new Promise((resolve) => {
    fetch('/tools/activities')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()

      })
      .then(data => {
        // Aquí puedes manejar los datos obtenidos
        ////console.log('Actividades obtenidas:', data);

        // Lógica para poblar los acordeones de actividades en cada equipo
        // por ejemplo:
        // populateAccordions(data);
        resolve(data)
      })
      .catch(error => {
        console.error('Hubo un problema con la solicitud:', error);
      });

  })

}

async function updateEmployee(employeeData) {
  console.log(employeeData);
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const endpointURL = `/tools/employees`;
        

    xhr.open('PUT', endpointURL, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          ////console.log(data)
          resolve(data.data)

          //populateForm(data);

        } else {
          console.error('Hubo un problema con la solicitud:', xhr.statusText);
        }
      }
    };
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(employeeData));
  })
}



async function createEmployee(employeeData) {
  console.log(employeeData);
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const endpointURL = `/tools/employees`;
        

    xhr.open('POST', endpointURL, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          ////console.log(data)
          Swal.fire({
            title: "Usuario Creado",
            text: "El usuario se ha creado con exito",
            icon: "success"
          });
          resolve(data.data)

          //populateForm(data);

        } else {
          console.error('Hubo un problema con la solicitud:', xhr.statusText);
        }
      }
    };
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(employeeData));
  })
}




async function addSedeFn(data) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const endpointURL = `/tools/sedes`;
    
    xhr.open('POST', endpointURL, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          ////console.log(data)
          resolve(data.data)

          //populateForm(data);

        } else {
          console.error('Hubo un problema con la solicitud:', xhr.statusText);
        }
      }
    };
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));
  })

}
async function registerMaintenance(data) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const endpointURL = `/tools/maintenance`;
    var image = new Image();

    

    xhr.open('POST', endpointURL, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          ////console.log(data)
          resolve(data.data)

          //populateForm(data);

        } else {
          console.error('Hubo un problema con la solicitud:', xhr.statusText);
        }
      }
    };
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));
  })
}



document.addEventListener('DOMContentLoaded', function () {

  const button = document.querySelector('#consultar');

  button.addEventListener('click', async function () {
    // Obtener el valor de username del input en tu formulario

    const usernameValue = document.querySelector('#username').value;
    const register = document.querySelector("[name=register]").value
    const documento = document.querySelector("[name=document]").value
    employee = await getEmployee(usernameValue, register, documento);
    ////console.log(employee)
    // Llamar a la función para obtener los equipos asignados al username
    //getAssignedEquipment(usernameValue);
  });
});


document.addEventListener('DOMContentLoaded', function () {

  const button2 = document.querySelector('#crearEquipo');

  button2.addEventListener("click", async () => {
    // WARNING: For POST requests, body is set to null by browsers.
    equipo = await getAssignedEquipment(document.querySelector('#serial-number').value);
    console.log("EQUIPO:", equipo);
    if(equipo !== null) {
      let data = {}
      data.equipment = [equipo]
      equipment = equipo
      previousName = equipment.name;
      ////console.log(data);
      //populateForm(data);

      
      
    } else {

      let dataEquiment = {
        serial: document.querySelector('#serial-number').value.toUpperCase(),
        name: document.querySelector('#nombre-equipo2').value.toUpperCase(),
        model: document.querySelector('#modelo-equipo2').value,
        brand: document.querySelector('#marca-equipo2').value,
        ram: document.querySelector('#ram-equipo2').value,
        hd: document.querySelector('#hd-equipo2').value,
        type: document.querySelector('#tipo-equipo2').value
       
      }
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      alert("Espera unos segundos mientras se carga el equipo en la base de datos")
      xhr.addEventListener("readystatechange",async function() {
        if(this.readyState === 4) {
          console.log(this.responseText);
          equipo = await getAssignedEquipment(document.querySelector('#serial-number').value);
          console.log("EQUIPO:", equipo);
          if(equipo !== null) {
            let data = {}
            data.equipment = [equipo]
            equipment = equipo
            ////console.log(data);
            //populateForm(data);
            const button = document.querySelector('#consultarEquipo');
            button.click();
          }
        }
      });
      xhr.open("POST", "/tools/equipment");
      xhr.setRequestHeader("Content-Type", "application/json");
      // WARNING: Cookies will be stripped away by the browser before sending the request.
      
      xhr.send(JSON.stringify(dataEquiment));
    }
    
  })
  const button = document.querySelector('#consultarEquipo');

  button.addEventListener('click', async function () {
    // Obtener el valor de username del input en tu formulario
    equipment = null;

    const serialNumber = document.querySelector('#serial-number').value;






    //employee = await getEmployee(usernameValue);

    // Llamar a la función para obtener los equipos asignados al username
    equipo = await getAssignedEquipment(serialNumber);
    console.log(equipo)
    let data = {}
    data.equipment = [equipo]
    equipment = equipo
    ////console.log(data);
    populateForm(data);
    const button2 = document.querySelector('#registerAction');

    button2.addEventListener('click', async function () {
      // Obtener el valor de username del input en tu formulario
      /**
      previousName : previousName,
      currentName : document.querySelector('#nombre-equipo2').value.toUpperCase(),
      */
      console.log(employee)
      console.log(equipment)
      activities = []
      //software activities
      let maintenanceActivities = $("[name=activityInput]");
      for (let i = 0; i < maintenanceActivities.length; i++) {
        if (maintenanceActivities[i].checked) {
          activities.push(maintenanceActivities[i].dataset.id)
        }
      }


      observations = getComment();
      let sede = document.querySelector("#sede").value;
      let piso = document.querySelector("#piso").value;
      let date = document.querySelector("#maintenanceDate").value;
      let data = {
        employee: employee,
        equipment: equipment,
        activities: activities,
        observations: observations,
        sede: sede,
        piso: piso,
        date : date,
        previousName : equipment.name,
        currentName : document.querySelector('#newName').value.toUpperCase()
      }
      if (activities.length == 0) {
        Swal.fire({
          title: "Aun te falta",
          text: "Recuerda marcar las actividades de mantenimiento que ejecutaste",
          icon: "error"
        });
      } else if (sede == null || sede == '') {
        Swal.fire({
          title: "Aun te falta",
          text: "Recuerda seleccionar la sede donde estas ejecutando el mantenimiento",
          icon: "error"
        });
      } else if (piso == null || piso == '') {
        Swal.fire({
          title: "Aun te falta",
          text: "Recuerda seleccionar la piso donde estas ejecutando el mantenimiento",
          icon: "error"
        });

      } else if (employee == null) {
        Swal.fire({
          title: "Aun te falta",
          text: "El usuario ingresado no existe o debe ser creado antes de continuar",
          icon: "error"
        });

      } else {
        data.agentSignature = document.querySelector("#tecnico").toDataURL("image/png");
        data.clientSignature = document.querySelector("#funcionario").toDataURL("image/png");
        let register_response = await registerMaintenance(data)
        maintenance = register_response.maintenance;
        try {
          // Ruta del archivo a descargar
          const fileUrl = `/files/GENERATED/MANTENIMIENTO_ID_${register_response.maintenance}.pdf`;

          // Nombre del archivo al descargar
          const fileName = `MANTENIMIENTO_${register_response.maintenance}.pdf`;

          // Descargar el archivo usando fetch y blob
          const response = await fetch(fileUrl);
          const blob = await response.blob();

          // Crear un enlace temporal
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;

          // Simular clic en el enlace para iniciar la descarga
          link.click();

          // Limpiar el enlace creado
          window.URL.revokeObjectURL(link.href);
          link.remove();
        } catch (error) {
          console.error('Error al descargar el archivo:', error);
        }
      }
      //hardware activities
    });
    const limpiarFuncionario = document.querySelector("#limpiarFirmaFuncionario");
    const limpiarTecnico = document.querySelector("#limpiarFirmaTecnico");
    limpiarFuncionario.addEventListener("click", async () => {
      let canvas = document.querySelector("#funcionario");
      var contexto = canvas.getContext("2d");

      // Limpia el contenido del canvas
      contexto.clearRect(0, 0, canvas.width, canvas.height);
    })

    limpiarTecnico.addEventListener("click", async () => {
      let canvas = document.querySelector("#tecnico");
      var contexto = canvas.getContext("2d");

      // Limpia el contenido del canvas
      contexto.clearRect(0, 0, canvas.width, canvas.height);
    })





    tinymce.init({
      selector: '#comment',
      plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak',
      toolbar_mode: 'floating',
      height: '200',
      content_style: 'body { font-family: Arial,sans-serif; font-size: 14px; }',
    });

  });
});


document.addEventListener('DOMContentLoaded', function () {

  const button = document.querySelector('#limpiar-usuario');

  button.addEventListener('click', async function () {
    // Obtener el valor de username del input en tu formulario

    $("[name=management]").val('');
    $("[name=department]").val('');
    $("[name=area]").val('');
    $("[name=fullName]").val('');
    $("[name=register]").val('');
    $("[name=username]").val('');
    $("[name=document]").val('');
    $("[name=ext]").val('');
    $("[name=mobile]").val('');
    $("[name=email]").val('');
    
    

    employee = null;
  });
  
  const button2 = document.querySelector("#actualizar-usuario");
  button2.addEventListener('click', async function () {
    // Obtener el valor de username del input en tu formulario
    let data = {
      managementID : document.querySelector("#management").value,
      departmentId : document.querySelector("#department").value,
      areaId : document.querySelector("#area").value,
      username : document.querySelector("#username").value,
      email : document.querySelector("#email").value,
      document : document.querySelector("#document").value,
      ext : document.querySelector("#ext").value,
      mobile : document.querySelector("#mobile").value,
      managementID : document.querySelector("#management").value,
      fullName :  document.querySelector("#fullName").value,
      register :  document.querySelector("[name=register]").value
      
    }
    if(data.username == '' || data.email == '' || (data.document == '') || (data.ext == '' && data.mobile == '') || data.fullName == ''){
      Swal.fire({
        title: "Campos faltantes",
        text: "Antes de continuar debes validar los datos minimos para poder identificar y contactar al funcionario usuario, email, documento, gerencia, area y departamento",
        icon: "error"
      });
    }else if(employee !== null){
      let data1 = {...employee, ...data};
      await updateEmployee(data1);
    } else {
      await createEmployee(data);

    }
    /**
    $("[name=management]").val('');
    $("[name=department]").val('');
    $("[name=area]").val('');
    $("[name=fullName]").val('');
    $("[name=register]").val('');
    $("[name=username]").val('');
    $("[name=document]").val('');
    $("[name=ext]").val('');
    $("[name=mobile]").val('');
    

    employee = null;
    */
  });
});

let addSede = document.querySelector("#addSede");
addSede.addEventListener("click", async () => {
  let name = document.querySelector("#newSede").value.trim().toUpperCase();
  
  // Obtener el select y todas las opciones (nombres)
  let sedeSelect = document.querySelector("#sede");
  let optionNames = Array.from(sedeSelect.options).map(option => option.text.toUpperCase());

  // Validar si el nombre de la sede ya existe en el select
  if (name === "") {
    Swal.fire({
      title: "Te falta algo!",
      text: "El nombre de la sede no puede estar en blanco",
      icon: "error"
    });
  } else if (optionNames.includes(name)) {
    Swal.fire({
      title: "Sede existente",
      text: "El nombre de la sede ya existe en la lista",
      icon: "error"
    });
  } else {
    // Si no existe, proceder con la lógica para agregar la sede
    let response = await addSedeFn({
      name: name
    });

    let timerInterval;
    Swal.fire({
      title: "Espere mientras se crea la nueva sede",
      html: "Esta ventana se cerrará en <b></b> milisegundos.",
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("La sede se ha creado correctamente");
        location.reload();
      }
    });
  }
});


document.addEventListener('DOMContentLoaded', function() {

  var inputFecha = document.getElementById('maintenanceDate');

// Obtener la fecha actual en formato YYYY-MM-DD
var fechaActual = new Date().toISOString().split('T')[0];
// Establecer el valor por defecto en el input de fecha
inputFecha.value = fechaActual;
})
