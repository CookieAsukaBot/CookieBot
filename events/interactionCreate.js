const fs = require('node:fs');
const { Collection } = require("discord.js");

module.exports = async (bot) => {
    if (!process.env.GUILD_ID) return;
    bot.slashCommands = new Collection();

    const commandFiles = fs.readdirSync('./slash-commands')
        .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../slash-commands/${file}`);
        await bot.slashCommands.set(command.data.name, command);
    };

    bot.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = bot.slashCommands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "¡Ocurrió un error al usar el comando! Intenta de nuevo o reporta el error.",
                ephemeral: true
            });
        };
    });
};
