const sql = require('mssql');

// Configuración de la conexión a la base de datos
const config = {
    user: 'sa',
    password: 'vDBH8fKHcBEc*D.D',
    server: 'ARANDA_BD', // Puede ser 'localhost\\nombre_instancia' para una instancia local
    database: 'ADM',
    options: {
        encrypt: false, // Deshabilitar el cifrado SSL/TLS
        trustServerCertificate: true // Usar certificados autofirmados (solo para pruebas)

    }
};

async function getDevice(serialNumber) {
    try {
        // Conectar a la base de datos
        await sql.connect(config);

        // Realizar una consulta
        const result = await sql.query(`
        WITH [Temp_Monitor_Min_max] 
        AS

        (

        Select [ADDP].[DEVICE_ID], Min([ADDP].[display_id]) [DisplayId1], Max([ADDP].[display_id]) [DisplayId2]

        From [AAM_DEVICE_DISPLAY] [ADDP]

        Group By [ADDP].[DEVICE_ID]

        ),

        

        [Temp_Monitores]

        AS

        (

        Select [MMM].[device_id]

            ,[ADP1].[name] [MODELO_MONITOR1], [ADDP1].[serial] [SERIAL_MONITOR1]

            ,[ADP2].[name] [MODELO_MONITOR2], [ADDP2].[serial] [SERIAL_MONITOR2]

        From [Temp_Monitor_Min_max]          [MMM]

            Left  Join [AAM_DEVICE_DISPLAY] [ADDP1] On [ADDP1].[device_id]      =  [MMM].[device_id]

                                                        And [ADDP1].[display_id] =  [MMM].[DisplayId1]

            Left  Join [AAM_DEVICE_DISPLAY] [ADDP2] On [ADDP2].[device_id]      =  [MMM].[device_id]

                                                        And [ADDP2].[display_id] =  [MMM].[DisplayId2]

                                                        And [MMM].[DisplayId2]   <> [MMM].[DisplayId1]

            Left  Join [AAM_DISPLAY]        [ADP1]  On [ADP1].[id]              =  [MMM].[DisplayId1]

            Left  Join [AAM_DISPLAY]        [ADP2]  On [ADP2].[id]              =  [MMM].[DisplayId2]

                                                        And [MMM].[DisplayId2]   <> [MMM].[DisplayId1]

        ),

        

        [Temp_Disco_Min_max]

        AS

        (

        Select [ADD].[device_id], Min([ADD].[serial]) [Serial1], Max([ADD].[serial]) [Serial2]

        From [AAM_DEVICE_DISK] [ADD]

        Where [ADD].[serial] Is Not Null

        Group By [ADD].[device_id]

        ),

        

        [Temp_Discos]

        AS

        (

        Select [DMM].[device_id]

            ,[ADD1].[serial] [SERIAL_DISCO1], [ADK1].[model] [MODELO_DISCO1]

            ,[ADD2].[serial] [SERIAL_DISCO2], [ADK2].[model] [MODELO_DISCO2]

            ,Floor(Round( ([ADD1].[size] / 1024.0 / 1024.0 / 1024.0)

                        ,0)

                    ) [CAPACIDAD_DISCO1]

            ,Floor(Round( ([ADD2].[size] / 1024.0 / 1024.0 / 1024.0)

                        ,0)

                    ) [CAPACIDAD_DISCO2]

        From [Temp_Disco_Min_max]         [DMM]

            Left  Join [AAM_DEVICE_DISK] [ADD1] On [ADD1].[device_id]   =  [DMM].[device_id]

                                                    And [ADD1].[serial] =  [DMM].[Serial1]

            Left  Join [AAM_DEVICE_DISK] [ADD2] On [ADD2].[device_id]   =  [DMM].[device_id]

                                                    And [ADD2].[serial] =  [DMM].[Serial2]

                                                    And [DMM].[Serial2] <> [DMM].[Serial1]

            Left  Join [AAM_DISK]        [ADK1] On [ADK1].[id]          =  [ADD1].[disk_id]

            Left  Join [AAM_DISK]        [ADK2] On [ADK2].[id]          =  [ADD2].[disk_id]

                                                    And [DMM].[Serial2] <> [DMM].[Serial1]

        ),

        

        [Temp_Red]

        AS

        (

        Select [ADN].[device_id], Max([ADN].[dhcp_address]) [IP]

        From [AAM_DEVICE_NETWORKADAPTER] [ADN]

        Group By [ADN].[device_id]

        )

        

        SELECT

            [AD].[NAME]                            [NOMBRE_MAQUINA]

            ,[ADS].[SYSTEM_SERIAL]                  [SERIAL_EQUIPO]

            ,[AD].[DESCRIPTION]                     [DESCRIPCION]

            ,[R].[IP]                               [DIRECCION_IP]

            ,[ADS].[CHASSIS_SERIAL]                 [MARCA_EQUIPO]

            ,[ADS].[SYSTEM_PRODUCT]                 [MODELO_EQUIPO]

            ,[M].[SERIAL_MONITOR1]                  [SERIAL_MONITOR1]

            ,[M].[MODELO_MONITOR1]                  [MODELO_MONITOR1]

            ,[M].[SERIAL_MONITOR2]                  [SERIAL_MONITOR2]

            ,[M].[MODELO_MONITOR2]                  [MODELO_MONITOR2]

            ,[ADS].[chassis_type]                   [CLASE_EQUIPO]

            ,[ADC].[AGENT_VERSION]                  [VERSION_AGENTE]

            ,Floor(Round( ([ADM].[physical] / 1024.0 / 1024.0 / 1024.0)

                        ,0)

                )                                 [TAMAÑO_MEMORIA_RAM]

            ,[ADM].[slot_count]                     [CANTIDAD_RANURAS_MEMORIA]

            ,(Select count([ADMS].[memory_id]) Cant

            From [AAM_DEVICE_MEMORYSLOT] [ADMS]

            Where [ADMS].[memory_id] Is Not Null

                And [ADMS].[device_id] = [AD].[id]

            )                                      [RANURAS_RAM_UTILIZADAS]

            ,(Select min([ADMS].[type]) TipoMem

            From [AAM_DEVICE_MEMORYSLOT] [ADMS]

            Where [ADMS].[memory_id] Is Not Null

                And [ADMS].[device_id] = [AD].[id]

            )                                      [TIPO_RAM]

            ,[D].[SERIAL_DISCO1]                    [SERIAL_DISCO1]

            ,[D].[MODELO_DISCO1]                    [MODELO_DISCO1]

            ,[D].[CAPACIDAD_DISCO1]                 [CAPACIDAD_DISCO1]

            ,[D].[SERIAL_DISCO2]                    [SERIAL_DISCO2]

            ,[D].[MODELO_DISCO2]                    [MODELO_DISCO2]

            ,[D].[CAPACIDAD_DISCO2]                 [CAPACIDAD_DISCO2]

            ,(Select Top 1 [ASP].[name]

            From AAM_DEVICE_SOFTWARE             [ADW]

                    Inner Join AAM_SOFTWARE_VERSION [ASV] On [ASV].[id] = [ADW].[software_id]

                    Inner Join AAM_SOFTWARE_PRODUCT [ASP] On [ASP].[id] = [ASV].[product_id]

            Where [ADW].[device_id] = [AD].[id]

                And [ASP].[type] = 0

            )                                      [SISTEMA_OPERATIVO]

            ,(Select Top 1 [ADO].[architecture]

            From AAM_DEVICE_SOFTWARE             [ADW]

                    Inner Join AAM_SOFTWARE_VERSION [ASV] On [ASV].[id] = [ADW].[software_id]

                    Inner Join AAM_SOFTWARE_PRODUCT [ASP] On [ASP].[id] = [ASV].[product_id]

                    Inner Join AAM_DEVICE_OS        [ADO] On [ADO].[id] = [ADW].[id]

            Where [ADW].[device_id] = [AD].[id]

                And [ASP].[type]      = 0

            )                                      [ARQUITECTURA_SO]

            ,(Select Top 1 [ADV].[chipset]

            From [AAM_DEVICE_VIDEOCARD] [ADV]

            Where [ADV].[device_id] = [AD].[id]

            Order by [ADV].[chipset] Desc

            )                                      [TARJETA_VIDEO]

            ,(Select Top 1 [ADV].[version]

            From [AAM_DEVICE_VIDEOCARD] [ADV]

            Where [ADV].[device_id] = [AD].[id]

            Order by [ADV].[chipset] Desc

            )                                      [VERSION_TARJETA_VIDEO]

        FROM [AAM_DEVICE]                         [AD]

            LEFT JOIN [Temp_Monitores]           [M]    ON [M].[device_id]   = [AD].[ID]

            LEFT JOIN [Temp_Discos]              [D]    ON [D].[device_id]   = [AD].[ID]

            LEFT JOIN [Temp_Red]                 [R]    ON [R].[device_id]   = [AD].[ID]

            LEFT JOIN [AAM_DEVICE_SETUP]         [ADS]  ON [ADS].DEVICE_ID   = [AD].[ID]

            LEFT JOIN [AAM_DEVICE_CONFIGURATION] [ADC]  ON [ADC].DEVICE_ID   = [AD].[ID]

            LEFT JOIN [AAM_DEVICE_MEMORY]        [ADM]  ON [ADM].[device_id] = [AD].[ID]

        WHERE [AD].[ALIAS] IS NOT NULL
        AND SYSTEM_SERIAL = '${serialNumber}'

        ORDER BY 1, 2 ASC

        

                
        `);

        // Imprimir los resultados
        //console.dir(result);
        return result.recordset;

        // Cerrar la conexión
        await sql.close();
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        return -1;
    }
}

module.exports = {
    getDevice
}