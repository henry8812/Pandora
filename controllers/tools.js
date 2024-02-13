const cheerio = require('cheerio');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const currentDirectory = __dirname;
const tools = require('../DAO/tools');

const SEDES = {
    1: "CAM",
    2: "BOULEVARD",
    3: "GUABITO",
    4: "COLON",
    5: "NAVARRO",
    6: "CALLE 13",
    8: "CAES",
    9: "FLORA",
    10: "DIESEL",
    11: "CODE",
    12: "CENTRO CONTROL MAESTRO",
    13: "SALOMIA",
    14: "PLANTA ALCANTARILLADO",
    15: "PUERTO MALLARINO",
    16: "PLANTA RIO CAUCA",
    17: "ALMAGRARIO",
    18: "TELECONTROL",
    19: "C.A. VERSALLES",
    20: "PLANTA RIO CALISAN FERNANDO",
    21: "SAN FERNANDO",
    22: "BOCATOMA RIO CAUCA",
    23: "BOCATOMA PUERTO MALLARINO",
    34: "ESTACION DE BOMBEO PASO DEL COMERCIO",
    35:	"CENTRO DE ATENCIÓN VALLE DEL LILI",
36	:"PLANTA RIO CAUCA",
37	:"ALMAGRARIO",
38	:"LIMONAR",
39	:"DIESEL",
40	:"CODE",
41	:"SAN LUIS",
42	:"PEÑON",
43	:"PLANTA LA RIVERA PANCE",
48 : "CALI 19",
49 : "PTAR"
}


async function generateRegisterDocument(data) {
    return new Promise(async (resolve) => {
        console.log(data)


        // Obtener la ruta del archivo actual

        const pdfPath = path.join(currentDirectory, '..', 'files', 'BASE_MANTENIMIENTO.pdf');
        const outputPath = path.join(currentDirectory, '..', 'files', 'GENERATED', `MANTENIMIENTO_ID_${data.maintenance}.pdf`);
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0]; // Obtiene la primera página del PDF

        const { width, height } = firstPage.getSize(); // Obtiene el tamaño de la página

        // Escribir texto en coordenadas específicas
        const fontSize = 6;
        const text = 'Texto agregado en coordenadas específicas';

        // Calcular el ancho del texto
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        //FECHA
        const x = width - 140; // Coordenada X
        const y = height - 40; // Coordenada Y
        let date = new Date()
        firstPage.drawText(date.toISOString().split("T")[0], {
            x: x,
            y: y,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });


        //HARDWARE
        console.log("data equipment", data.equipment)
        let _type = data.equipment.type;
        switch(_type){
            case 'Desktop':
                _type = 'PC ESCRITORIO';
                break;
            case 'Notebook':
                _type = 'PORTATIL';
                break;
            default:
                break;
        }
        firstPage.drawText(_type.toUpperCase(), {
            x: 150,
            y: height - 65,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });

        firstPage.drawText(data.equipment.brand.toUpperCase(), {
            x: 340,
            y: height - 65,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });

        firstPage.drawText(data.equipment.model.toUpperCase(), {
            x: 504,
            y: height - 65,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });
        firstPage.drawText(data.equipment.sn.toUpperCase(), {
            x: 690,
            y: height - 65,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });


        //USUARIO
        let sedeName = await tools.getSedeById(data.sede)
        console.log(sedeName)

        firstPage.drawText(sedeName.name, {
            x: 150,
            y: height - 85,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });


        firstPage.drawText(data.piso.toString().replace("-", "Sotano "), {
            x: 530,
            y: height - 84,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });
        firstPage.drawText(data.employee.management, {
            x: 150,
            y: height - 94,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });

        firstPage.drawText(data.employee.fullName.toUpperCase(), {
            x: 150,
            y: height - 104,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });
        
        firstPage.drawText(data.employee.register !== null ? data.employee.register.toString() : '', {
            x: 400,
            y: height - 104,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });

        firstPage.drawText(data.employee.department + '', {
            x: 525,
            y: height - 104,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });

        firstPage.drawText((data.employee.username + '@emcali.com.co').toUpperCase(), {
            x: 150,
            y: height - 114,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });

        firstPage.drawText(data.employee.area + '', {
            x: 525,
            y: height - 114,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });


        //ACTIVITIES

        for (let i = 0; i < data.activities.length; i++) {
            let coordinates = {
                x : 900, 
                y: 600
            }
            console.log(data.activities[i])
            switch (data.activities[i]) {
                case "1":
                    coordinates.x = 153;
                    coordinates.y = height - 153;
                    break;
                case "2":
                    coordinates.x = 153;
                    coordinates.y = height - 174;
                    break;
                case "3":
                    coordinates.x = 153;
                    coordinates.y = height - 189;
                    break;
                case "4":
                    coordinates.x = 153;
                    coordinates.y = height - 198;
                    break;
                case "5":
                    coordinates.x = 153;
                    coordinates.y = height - 210;
                    break;
                case "6":
                    coordinates.x = 153;
                    coordinates.y = height - 228;
                    break;
                case "7":
                    coordinates.x = 153;
                    coordinates.y = height - 242;
                    break;
                case "8":
                    coordinates.x = 153;
                    coordinates.y = height - 268;
                    break;
                case "9":
                    coordinates.x = 303;
                    coordinates.y = height - 155;
                    break;
                case "36":
                    coordinates.x = 303;
                    coordinates.y = height - 189;
                    break;
                case "10":
                    coordinates.x = 303;
                    coordinates.y = height - 175;
                    break;
                case "11":
                    coordinates.x = 303;
                    coordinates.y = height - 210;
                    break;
                case "12":
                    coordinates.x = 303;
                    coordinates.y = height - 226;
                    break;
                case "13":
                    coordinates.x = 303;
                    coordinates.y = height - 243;
                    break;
                case "14":
                    coordinates.x = 303;
                    coordinates.y = height - 268;
                    break;
                case "15":
                    coordinates.x = 451;
                    coordinates.y = height - 153;
                    break;
                case "16":
                    coordinates.x = 451;
                    coordinates.y = height - 173;
                    break;
                case "17":
                    coordinates.x = 451;
                    coordinates.y = height - 190;
                    break;
                case "18":
                    coordinates.x = 451;
                    coordinates.y = height - 198;
                    break;
                case "19":
                    coordinates.x = 451;
                    coordinates.y = height - 210;
                    break;
                case "20":
                    coordinates.x = 451;
                    coordinates.y = height - 226;
                    break;
                case "21":
                    coordinates.x = 451;
                    coordinates.y = height - 243;
                    break;
                case "22":
                    coordinates.x = 451;
                    coordinates.y = height - 268;
                    break;
                case "23":
                    coordinates.x = 607;
                    coordinates.y = height - 153;
                    break;
                case "24":
                    coordinates.x = 607;
                    coordinates.y = height - 173;
                    break;
                case "25":
                    coordinates.x = 607;
                    coordinates.y = height - 190;
                    break;
                case "26":
                    coordinates.x = 607;
                    coordinates.y = height - 198;
                    break;
                case "27":
                    coordinates.x = 607;
                    coordinates.y = height - 210;
                    break;
                case "28":
                    coordinates.x = 607;
                    coordinates.y = height - 226;
                    break;
                case "29":
                    coordinates.x = 607;
                    coordinates.y = height - 268;
                    break;
                case "30":
                    coordinates.x = 748;
                    coordinates.y = height - 153;
                    break;
                case "31":
                    coordinates.x = 748;
                    coordinates.y = height - 173;
                    break;
                case "32":
                    coordinates.x = 748;
                    coordinates.y = height - 190;
                    break;
                case "33":
                    coordinates.x = 748;
                    coordinates.y = height - 198;
                    break;
                case "34":
                    coordinates.x = 748;
                    coordinates.y = height - 210;
                    break;
                case "35":
                    coordinates.x = 748;
                    coordinates.y = height - 226;
                    break;
                case "36":
                    coordinates.x = 748;
                    coordinates.y = height - 268;
                    break;
                

            }

            firstPage.drawText('X', {
                x: coordinates.x,
                y: coordinates.y,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0), // Color del texto en formato RGB
            });

           



        }
         //ACTIVITIES 

         let types =[];
         console.log(data.types)
         for(let i=0; i<data.types.length;i++){
             types.push(data.types[i].CATEGORY)
         }

         console.log(types)
         console.log("start drawing");

         if(types.indexOf(2) >=0) {
             firstPage.drawText('X', {
                 x: 385,
                 y: 123,
                 size: fontSize,
                 font: font,
                 color: rgb(0, 0, 0), // Color del texto en formato RGB
             });
         } 
         if (types.indexOf(1) >= 0){
             firstPage.drawText('X', {
                 x: 730,
                 y: 123,
                 size: fontSize,
                 font: font,
                 color: rgb(0, 0, 0), // Color del texto en formato RGB
             });
        }

        //NOTES
        function parsearHTMLaTexto(htmlString) {
            const $ = cheerio.load(htmlString);
            return $('body').text();
        }

        firstPage.drawText(parsearHTMLaTexto(data.observations), {
            x: 68,
            y: 146,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });
        //FIRMAS
        const base64Data = data.agentSignature;
        const [, base64Image] = base64Data.split(';base64,'); // Extrae solo la parte de los datos de la imagen en base64
        const imageBuffer = Buffer.from(base64Image, 'base64'); // Convierte la cadena base64 decodificada a un buffer de imagen
        console.log("before embed");
        fs.writeFileSync('imagen.png', imageBuffer); // Guarda la imagen en un archivo

        const imageFile = fs.readFileSync('imagen.png'); // Lee la imagen desde el archivo
        console.log("after file creation")
        const embeddedImage = await pdfDoc.embedPng(imageFile); // Incorpora la imagen al PDF
        firstPage.drawImage(embeddedImage, {
            x: 185,
            y: 75,
            width: 90,
            height: 25,
        });
        const base64Data2 = data.clientSignature;
        const [, base64Image2] = base64Data2.split(';base64,'); // Extrae solo la parte de los datos de la imagen en base64
        const imageBuffer2 = Buffer.from(base64Image2, 'base64'); // Convierte la cadena base64 decodificada a un buffer de imagen
        console.log("before embed");
        fs.writeFileSync('imagen.png', imageBuffer2); // Guarda la imagen en un archivo

        const imageFile2 = fs.readFileSync('imagen.png'); // Lee la imagen desde el archivo
        console.log("after file creation")
        const embeddedImage2 = await pdfDoc.embedPng(imageFile2); // Incorpora la imagen al PDF
        firstPage.drawImage(embeddedImage2, {
            x: 505,
            y: 75,
            width: 90,
            height: 25,
        });
        console.log(data.agent)
        firstPage.drawText(data.agent.name.toUpperCase(), {
            x: 190,
            y: 102,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });
        firstPage.drawText(data.agent.document == null ? '' : data.agent.document, {
            x: 105,
            y: 93,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });

        firstPage.drawText(data.employee.fullName.toUpperCase(), {
            x: 550,
            y: 102,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });
        firstPage.drawText(data.employee.document.toString(), {
            x: 445,
            y: 93,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });
        firstPage.drawText(data.employee.register !== null ? data.employee.register.toString() : '', {
            x: 635,
            y: 93,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0), // Color del texto en formato RGB
        });
        





        const pdfBytes = await pdfDoc.save();

        fs.writeFileSync(outputPath, pdfBytes);
        console.log('¡PDF editado exitosamente!');
        resolve(outputPath);

    })


}

module.exports = {
    generateRegisterDocument
}