const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

const addPluginCommands = async (plugins) => {
    let commands = [];

    await plugins.forEach(async plugin => {
        let indexPath = `./plugins/${plugin}/index.js`;
        let slashPath = `./plugins/${plugin}/slash-commands`;
        if (!fs.existsSync(indexPath) && !fs.existsSync(slashPath)) return commands;

        try {
            let index = await require(`../plugins/${plugin}/index.js`);
            if (!index.plugin || index.enabled != undefined && index.enabled == false) return commands;

            let slashCommands = fs.readdirSync(slashPath).filter(file => file.endsWith('.js'));

            for (const file of slashCommands) {
                const command = require(`../plugins/${plugin}/slash-commands/${file}`);
                commands.push(command.data.toJSON());
            };
        } catch (error) {
            console.error(error);
            return commands;
        };
    });

    return commands;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deploy')
		.setDescription('Actualiza o carga la lista de comandos.'),
	async execute(interaction, bot) {
        let commands = [];
        let commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`${__dirname}/${file}`);
            commands.push(command.data.toJSON());
        };

        let plugins = fs.readdirSync('./plugins').filter(folder => !folder.endsWith('.js'));
        if (plugins.length > 0) (await addPluginCommands(plugins)).forEach(command => commands.push(command));

        await require('../events/deploySlashCommands')(bot, commands);

        return interaction.reply({
            content: '¡Se ha cargado la lista de comandos correctamente! uwu ✅☑',
            ephemeral: true
        });
	},
};
