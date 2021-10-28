const fs = require('fs');
const { execSync } = require('child_process');

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
                return console.log(`[PLUGINS] [${name.toUpperCase()}] La dependencia ${dependencie.toUpperCase()} ya está instalada.`);
            } else {
                // Instalar
                const status = await installDependencie(dependencie, name);
                if (status == false) return console.log(`[PLUGINS] [${name.toUpperCase()}] Ocurrió un error al intentar comprobar/instalar [${dependencie.toUpperCase()}].`);
                return console.log(`[PLUGINS] [${name.toUpperCase()}] Se instaló de la dependencia [${dependencie.toUpperCase()}]. Se requiere de reiniciar el BOT para funcionar.`);
            };
        });
    } catch (err) {
        console.log(`[PLUGINS] [${name.toUpperCase()}] Ocurrió un error al intentar comprobar/instalar dependencias.`);
    };

    // Se devuélve la lista de plugins ya instalados
    return installed;
};

function installDependencie (dependencie, name) {
    try {
        console.log(`[PLUGINS] [${name.toUpperCase()}] Instalando ${dependencie.toUpperCase()}...`);
        execSync(`yarn add ${dependencie}`);
        return true;
    } catch (error) {        
        console.log(`[PLUGINS] [${name.toUpperCase()}] Ocurrió un error al intentar instalar la dependencia ${dependencie.toUpperCase()}.`);
        console.error(error);
        return false;
    };
};

module.exports = (bot) => {
    // Obtener plugins
    const plugins = fs.readdirSync(__dirname)
        .filter(folder => !folder.endsWith('.js')); // Solo toma si no termina con .js

    // Comprobar si hay plugins
    if (plugins.length <= 0) return console.log('[PLUGINS] No hay ningún plugin instalado.');
    console.log(`Plugins: ${plugins}`);

    // // Obtener información
    // Por cada plugin
    plugins.forEach(async plugin => {
        // const getFiles = fs.readdirSync(`${__dirname}/${plugin}`)
        //     .filter(file => file.startsWith('index'));
        // console.log({ getFiles });

        // Correr index.js
        try {
            // Ruta del index
            const indexPath = `${__dirname}/${plugin}/index.js`;

            // Comprobar si el index existe
            if (!fs.existsSync(indexPath)) return console.log(`[PLUGINS] [${plugin.toUpperCase()}] No se encontró el index.js`);

            // Cargar index
            let index = await require(indexPath); // .plugin(bot); // Se agrega .plugin() porque puede ejecutar cualquier cosa que haya dentro, pero queremos plugin. Y se agrega (bot) por las funcionalidades de la API de Discord

            // Comprobar si el index existe
            if (!index.plugin) return console.log(`[PLUGINS] [${plugin.toUpperCase()}] El index.js no tiene "plugin()".`);
            if (index.enabled != undefined && index.enabled == false) return console.log(`[PLUGINS] [${plugin.toUpperCase()}] El plugin está deshabilitado.`);

            let dependencies = index.dependencies;

            // debug can delete:
            // console.log({ plugin_name: index.name, plugin_dependencies: dependencies });

            // Comprobar si hay dependencias
            if (dependencies.length >= 1) {
                // Obtener la cantidad de dependencias instaladas (e instalar)
                let installed = await installModules(index);

                // Comprobar si ya están instaladas
                if (installed.length == dependencies.length) {
                    // Iniciar plugin
                    await index.plugin(bot);                    
                } else {
                    console.log(`[PLUGINS] [${plugin.toUpperCase()}] Se requiere de instalar dependencias.`);
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
