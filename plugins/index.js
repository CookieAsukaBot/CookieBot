const fs = require('fs');

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
        await require(`${__dirname}/${plugin}/index.js`).plugin(bot); // Se agrega .plugin() porque puede ejecutar cualquier cosa que haya dentro, pero queremos plugin. Y se agrega (bot) por las funcionalidades de la API de Discord
    });
};