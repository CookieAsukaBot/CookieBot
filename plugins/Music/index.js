const path = require('path');
const fs = require('fs');

module.exports = {
    name: 'Music',
    version: '1.0.0',
    cookiebot: '1.0.0',
    description: '¡Plugin oficial de CookieBot para escuchar música!',
    dependencies: [],
    async plugin (bot) {
        // Cargar comandos
        const commandPath = path.join(__dirname, 'commands');
        require('../../events/commands')(bot, commandPath);
    }
};