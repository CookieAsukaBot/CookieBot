const path = require('path');
const fs = require('fs');

module.exports = (bot, commandPath) => {
    // Obtener comandos
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

    // Por cada comando
    commandFiles.forEach(file => {
        const command = require(path.join(commandPath, file));

        // Agrega el comando a la Collection
        bot.commands.set(command.name, command);
    });
};
