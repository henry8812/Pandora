// Data retrieved from https://www.ssb.no/energi-og-industri/olje-og-gass/statistikk/sal-av-petroleumsprodukt/artikler/auka-sal-av-petroleumsprodukt-til-vegtrafikk
Highcharts.chart('maintenance-by-month', {
    title: {
        text: '',
        align: 'left'
    },
    xAxis: {
        categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    },
    yAxis: {
        title: {
            text: 'Mantenimientos'
        }
    },
    legend: {
        itemStyle: {
            fontSize: '17px'  // Puedes ajustar el tamaño según tus necesidades
        }
    },
    tooltip: {
        valueSuffix: '',
        style: {
            fontSize: '17px'  // Ajusta el tamaño según tus necesidades
        }
    },
    plotOptions: {
        series: {
            borderRadius: '25%'
        }
    },
    series: [{
        type: 'column',
        name: 'Hardware',
        data: [80, 58, 36, 45]
    }, {
        type: 'column',
        name: 'Software',
        data: [90, 45, 78, 96]
    }, {
        type: 'column',
        name: 'Completo',
        data: [176, 103, 114, 141]
    }]
});
/**
Highcharts.chart('pending-by-month', {
    title: {
        text: null
    },
    yAxis: {
        title: {
            text: 'Mantenimientos pendientes'
        }
    },
    xAxis: {
        categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        accessibility: {
            rangeDescription: 'Range: 2010 to 2020'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'center',
        verticalAlign: 'bottom'
    },
    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            }
        }
    },
    series: [{
        name: 'Mantenimientos pendientes',
        data: [3500 - 176, 3500 - 276, 3500 - 315, 2800]
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },

        }]
    }
});
*/
/**
Highcharts.chart('trending-by-month', {

    title: {
        text: 'U.S Solar Employment Growth',
        align: 'left'
    },

    subtitle: {
        text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
        align: 'left'
    },

    yAxis: {
        title: {
            text: 'Number of Employees'
        }
    },

    xAxis: {
        accessibility: {
            rangeDescription: 'Range: 2010 to 2020'
        }
    },

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010
        }
    },

    series: [{
        name: 'Installation & Developers',
        data: [43934, 48656, 65165, 81827, 112143, 142383,
            171533, 165174, 155157, 161454, 154610]
    }, {
        name: 'Manufacturing',
        data: [24916, 37941, 29742, 29851, 32490, 30282,
            38121, 36885, 33726, 34243, 31050]
    }, {
        name: 'Sales & Distribution',
        data: [11744, 30000, 16005, 19771, 20185, 24377,
            32147, 30912, 29243, 29213, 25663]
    }, {
        name: 'Operations & Maintenance',
        data: [null, null, null, null, null, null, null,
            null, 11164, 11218, 10077]
    }, {
        name: 'Other',
        data: [21908, 5548, 8105, 11248, 8989, 11816, 18274,
            17300, 13053, 11906, 10073]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});


**/
// main.js

document.addEventListener("DOMContentLoaded", function () {
    // Obtener referencia al contenedor de la tabla
    const tableContainer = document.getElementById("table-container");

    // Definir la plantilla Handlebars
    const templateSource = `
    <style>
  table {
    table-layout: fixed;
    width: 100%;
  }

  .observation-column {
    max-width: 400px;
    white-space: pre-wrap;
    overflow: hidden;
  }
</style>
    <table class="table table-striped" id="myTable">
        <thead class="thead-dark">
            <tr>
                
                <th>Fecha</th>
                <th>SN Equipo</th>
                <th>Técnico de Mantenimiento</th>
                <th>Responsable (Dueño) del Equipo</th>
                <th>Observaciones</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {{#each this}}
                <tr>
                    
                    <td>{{date}}</td>
                    <td>{{equipmentSN}}</td>
                    <td>{{name}}</td>
                    <td>{{fullName}}</td>
                    <td class="observation-column" style="max-width: 400px !important;   word-wrap: break-word;">{{decodeHTML observation}}</td>
                    <td>
                    {{#if hasDocument}}
                    <a href="/files/GENERATED/MANTENIMIENTO_ID_{{id}}.pdf" download="acta_{{id}}.pdf">Descargar Acta</a>
                    {{/if}}
                    </td>
                </tr>
            {{/each}}
        </tbody>
    </table>
`;
function decodificarHTML(texto) {
    const elementoTemporal = document.createElement('div');
    elementoTemporal.innerHTML = texto;
    return elementoTemporal.textContent || elementoTemporal.innerText || '';
}

    Handlebars.registerHelper('decodeHTML', function(texto) {
        return decodificarHTML(texto);
    });
    const template = Handlebars.compile(templateSource);
    function formatDataForHighcharts(data) {
        const formattedData = {
            categories: Array.from({ length: 12 }, (_, index) => index + 1),  // Meses del 1 al 12
            series: [],
        };
    
        // Agrupa los datos por año
        const dataByYear = {};
        data.forEach(entry => {
            const year = entry.year;
            const month = entry.month;
            const count = entry.maintenanceCount;
    
            if (!dataByYear[year]) {
                dataByYear[year] = Array.from({ length: 12 }, () => null);  // Inicializa un arreglo de 12 elementos con valores nulos
            }
    
            dataByYear[year][month - 1] = count;  // Restamos 1 porque los meses en JavaScript van de 0 a 11
        });
    
        // Construye las series (datos por año)
        Object.entries(dataByYear).forEach(([year, counts]) => {
            formattedData.series.push({
                name: year,
                data: counts,
            });
        });
    
        return formattedData;
    }

    function getMonthName(month) {
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
    
        return monthNames[month - 1];  // Restamos 1 porque los meses en JavaScript van de 0 a 11
    }
    function createLineChart(data) {
    Highcharts.chart('pending-by-month', {
        chart: {
            type: 'line',
        },
        title: {
            text: 'Mantenimientos Pendientes Mes a Mes',
        },
        tooltip: {
            style: {
                fontSize: '16px'  // Ajusta el tamaño según tus necesidades
            }
        },
        xAxis: {
            categories: data.map(entry => entry.month),
            title: {
                text: 'Meses',
            },
        },
        yAxis: {
            title: {
                text: 'Mantenimientos Pendientes',
            },
        },
        series: [{
            name: 'Mantenimientos Pendientes',
            data: data.map(entry => entry.remaining),
        }],
    });
}




//

function createLineChart2(data) {
    Highcharts.chart('pending-by-month', {
        chart: {
            type: 'line',
        },
        title: {
            text: 'Mantenimientos Pendientes Mes a Mes',
        },
        xAxis: {
            categories: data.map(entry => entry.month),
            title: {
                text: 'Meses',
            },
        },
        tooltip: {
            style: {
                fontSize: '16px'  // Ajusta el tamaño según tus necesidades
            }
        },
        yAxis: {
            title: {
                text: 'Mantenimientos Pendientes',
            },
        },
        series: [{
            name: 'Mantenimientos Pendientes',
            data: data.map(entry => entry.remaining),
        }],
    });
}

    // Función para crear la gráfica de Highcharts
    function createLineChart(data) {
        Highcharts.chart('trending-by-month', {
            chart: {
                type: 'line',
            },
            title: {
                text: '',
            },
            tooltip: {
                style: {
                    fontSize: '16px'  // Ajusta el tamaño según tus necesidades
                }
            },
            xAxis: {
                categories: data.categories.map(month => getMonthName(month)),  // Utiliza una función para obtener el nombre del mes
                title: {
                    text: 'Meses',
                },
            },
            yAxis: {
                title: {
                    text: 'Cantidad de Mantenimientos',
                },
            },
            series: data.series,
        });
    }
    // Realizar la petición GET a la URL /maintenances/
    fetch('/tools/maintenances/')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Asegúrate de que la estructura de datos es correcta
            // Renderizar la tabla utilizando Handlebars
            for(let i=0; i< data.maintenances.length;i++){
                data.maintenances[i].date =data.maintenances[i].date.split("T")[0]
                /**
                if(data.maintenances[i].observation){
                    data.maintenances[i].observation =data.maintenances[i].observation.substr(0,50)
                }
                */
                
            }
            const html = template(data.maintenances);
            
            tableContainer.innerHTML = html;
            new DataTable("#myTable", {
                order: [[0, "desc"]],  // La columna 0 (primera columna) se ordena de forma descendente
                dom: 'Bfrtip', // Agregar los botones a la interfaz
                buttons: [
                    
                ]
            })
        })
        .catch(error => console.error('Error al obtener los datos:', error));

        fetch('/tools/maintenancesMonth/')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Asegúrate de que la estructura de datos es correcta
            // Renderizar la tabla utilizando Handlebars
            const chartData = formatDataForHighcharts(data.data);
            console.log(chartData)

            // Crea la gráfica de Highcharts
            createLineChart(chartData);
            
        })
        .catch(error => console.error('Error al obtener los datos:', error));

        fetch('/tools/maintenanceStats/')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Asegúrate de que la estructura de datos es correcta
            // Renderizar la tabla utilizando Handlebars
            let stats = data.data[0];
            document.querySelector("#softwareStat").innerHTML = stats.software;
            document.querySelector("#hardwareStat").innerHTML = stats.hardware;
            document.querySelector("#totalStat").innerHTML = stats.both_software_hardware;
            document.querySelector("#percentStat").innerHTML = parseInt(stats.completion_percentage) + "%";
            
            
        })
        .catch(error => console.error('Error al obtener los datos:', error));

        fetch('/tools/maintenanceRemaining/')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Asegúrate de que la estructura de datos es correcta
            // Renderizar la tabla utilizando Handlebars
            let resp = data.data;
            createLineChart2(resp);
            
            
            
        })
        .catch(error => console.error('Error al obtener los datos:', error));
        

          

});