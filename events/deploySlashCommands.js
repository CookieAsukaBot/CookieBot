const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = async (bot) => {
    const commands = [];
    const commandFiles = fs.readdirSync('./slash-commands').filter(file => file.endsWith('.js'));

    const clientId = bot.user.id;
    const guildId = process.env.GUILD_ID;
    if (!guildId) return console.log('[SLASH-COMMANDS] No se encontró GUILD_ID en la configuración.');

    for (const file of commandFiles) {
        const command = require(`../slash-commands/${file}`); // Agregar paths de plugins?
        commands.push(command.data.toJSON());
    };

    const rest = new REST({ version: '9' }).setToken(bot.token);

    try {
        console.log('[SLASH-COMMANDS] Cargando comandos...');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('[SLASH-COMMANDS] Se han cargado los comandos correctamente.');
    } catch (error) {
        console.error(error);
        console.log('[SLASH-COMMANDS] Ocurrió un error al cargar los comandos.');
    };
};
