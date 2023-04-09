const fs = require('node:fs');
const Discord = require('discord.js');

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
            }
        } catch (error) {
            console.error(error);
            return commands;
        }
    });

    return commands;
}

module.exports = {
	name: 'deploy',
    category: 'General',
    description: 'Actualiza o carga la lista de comandos slash.',
    roles: ["admin"],
    cooldown: 10,
	async execute(message, args, bot) {
        if (process.env.OWNER_ID !== message.author.id) return;

        let commands = [];
        let commandFiles = fs.readdirSync('./slash-commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../slash-commands/${file}`);
            commands.push(command.data.toJSON());
        }

        let plugins = fs.readdirSync('./plugins').filter(folder => !folder.endsWith('.js'));
        if (plugins.length > 0) (await addPluginCommands(plugins)).forEach(command => commands.push(command));

        await require('../events/deploySlashCommands')(bot, commands);

        let embed = new Discord.MessageEmbed()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({
                name: 'Comandos Slash',
                iconURL: bot.user.displayAvatarURL({ dynamic: true, size: 256 })
            })
            .setDescription("Se cargó la lista de **/comandos** correctamente. ✅");

        message.channel.send({
            embeds: [embed]
        });
	},
}
