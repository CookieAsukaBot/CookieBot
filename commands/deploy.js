const fs = require('node:fs');

const addPluginCommands = async (plugins) => {
    let commands = [];

    await plugins.forEach(async plugin => {
        let indexPath = `./plugins/${plugin}/index.js`;
        let slashPath = `./plugins/${plugin}/slash-commands`;
        if (!fs.existsSync(indexPath) || !fs.existsSync(slashPath)) return;

        try {
            let index = await require(`../plugins/${plugin}/index.js`);
            if (!index.plugin || index.enabled != undefined && index.enabled == false) return;

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
	name: 'deploy',
    description: 'Actualiza o carga la lista de comandos slash.',
    roles: ["admin"], // Lo ideal es que requiera de un user id para funcionar, ya que, en cualquier servidor pueden spamearlo.
	async execute(message, args, bot) {
        let commands = [];
        let commandFiles = fs.readdirSync('./slash-commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../slash-commands/${file}`);
            commands.push(command.data.toJSON());
        };

        let plugins = fs.readdirSync('./plugins').filter(folder => !folder.endsWith('.js'));
        if (plugins.length > 0) (await addPluginCommands(plugins)).forEach(command => commands.push(command));

        await require('../events/deploySlashCommands')(bot, commands);

        message.reply({
            content: 'se cargó la lista de comandos correctamente! ✅',
        });
	},
};
