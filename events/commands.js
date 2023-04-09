const path = require('node:path');
const fs = require('node:fs');

/**
 * @param {Client} bot cliente del bot
 * @param {String} commandPath ruta de comandos
 * @param {Boolean} slashCommands comprueba si son comandos Slash.
 */
module.exports = (bot, commandPath, slashCommands) => {
    const commandFiles = fs.readdirSync(commandPath)
        .filter(file => file.endsWith('.js'));

    // Por cada comando
    commandFiles.forEach(async file => {
        const command = require(path.join(commandPath, file));

        // Agrega el comando a la Collection
        if (slashCommands) {
            await bot.slashCommands.set(command.data.name, command);
        } else {
            await bot.commands.set(command.name, command);
        }
    });
}
