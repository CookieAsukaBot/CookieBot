const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = async (bot, commands) => {
    const clientId = bot.user.id;
    const guildId = process.env.GUILD_ID;
    if (!guildId) return console.log('[SLASH-COMMANDS] No se encontró GUILD_ID en la configuración.');

    const rest = new REST({ version: '9' }).setToken(bot.token);

    try {
        console.log('[SLASH-COMMANDS] Cargando comandos...');

        if (process.env.DEV_MODE == true) {
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );
        } else {
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );
        };

        console.log('[SLASH-COMMANDS] Se han cargado los comandos correctamente.');
    } catch (error) {
        console.error(error);
        console.log('[SLASH-COMMANDS] Ocurrió un error al cargar los comandos.');
    };
};
