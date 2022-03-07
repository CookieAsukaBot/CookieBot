const path = require('node:path');
const fs = require('node:fs');

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
        };
    });
};
