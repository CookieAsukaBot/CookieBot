const fs = require('fs');
const { exec } = require('child_process');

// Funciones
function moduleIsAvailable (dependencie) {
    try {
        require.resolve(dependencie);
        return true;
    } catch (e) {
        return false;
    };
};

async function installModules (plugin) {
    // Obtener datos
    let name = plugin.name;
    let modules = plugin.dependencies;

    // Crear datos
    let installed = [];

    try {
        await modules.forEach(async dependencie => {
            // Comprobar si está instalada
            if (moduleIsAvailable(dependencie)) {
                // Agregar localmente
                installed.push(dependencie);
                return console.log(dependencie + ' ya está instalado!');
            } else {
                // Instalar
                console.log(`[PLUGIN] [${name}] Instalando ${dependencie}....`);

                /**
                 * 
                 * 
                 * 
                 * 
                 * 
                 */

                return console.log(`[PLUGIN] [${name.toUpperCase()}] [${dependencie.toUpperCase()}] Se han instalado dependencias. Se requiere de reiniciar el BOT.`);
            };
        });
    } catch (err) {
        console.log(`[PLUGIN] [${name}] Ocurrió un error al intentar comprobar/instalar dependencias.`);
    };

    return installed;
};

async function installModule (dependencie) {
    try {

    } catch (err) {

    }
};

module.exports = (bot) => {
    // Obtener plugins
    const plugins = fs.readdirSync(__dirname)
        .filter(folder => !folder.endsWith('.js')); // Solo toma si no termina con .js

    console.log(`Plugins: ${plugins}`);

    // // Obtener información
    // Por cada plugin
    plugins.forEach(async plugin => {
        // const getFiles = fs.readdirSync(`${__dirname}/${plugin}`)
        //     .filter(file => file.startsWith('index'));
        // console.log({ getFiles });

        // Correr index.js
        try {
            // Index
            let index = await require(`${__dirname}/${plugin}/index.js`); // .plugin(bot); // Se agrega .plugin() porque puede ejecutar cualquier cosa que haya dentro, pero queremos plugin. Y se agrega (bot) por las funcionalidades de la API de Discord
            let dependencies = index.dependencies;

            console.log({ plugin_name: index.name, plugin_dependencies: dependencies });

            // Comprobar si hay dependencias
            if (dependencies.length >= 1) {
                // Obtener la cantidad de dependencias instaladas (e instalar)
                let installed = await installModules(index);

                // Comprobar si ya están instaladas
                if (installed.length == dependencies.length) {
                    // Iniciar plugin
                    await index.plugin(bot);                    
                } else{
                    console.log("Se requiere de instalar dependencias");
                };
            } else {
                // Iniciar plugin
                await index.plugin(bot);
            };
        } catch (err) {
            console.log(`[PLUGIN] [${plugin.toUpperCase()}] Ocurrió un error.`);
            console.error(err);
        };
    });
};