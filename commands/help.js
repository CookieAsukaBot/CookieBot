const Discord = require('discord.js');

const prefix = process.env.BOT_PREFIX;

// Agregar comandos en la descripción del Embed
function addDescription (commands) {
    let desc = "";

    let temporal = [];
    commands.forEach(command => {
        if (command.category) {
            if (!temporal.includes(command.category)) {
                temporal.push(command.category);
                desc += `\n**${command.category}**\n`;
            }
            desc += `**${prefix}${command.name}** - ${command.description}\n`;
        } else {
            desc += `**${prefix}${command.name}** - ${command.description}\n`;
        };
    });

    return desc;
};

module.exports = {
    name: 'help',
    description: 'Muestra todos los comandos e información.',
    aliases: ['commands', 'ayuda', 'comandos'],
    usage: '[nombre del comando]',
    execute (message, args) {
        // Obtener la Collection
        const { commands } = message.client;

        // Si no hay args
        if (!args.length) {
            // Embed
            let embed = new Discord.MessageEmbed()
                .setColor(process.env.BOT_COLOR)
                .setTitle('Lista de comandos')
                .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
                .setFooter(`¡Puedes usar "${prefix}help [nombre del comando]" para obtener ayuda!`);

            // Agregar comandos al Embed
            embed.setDescription(addDescription(commands));

            // Responder
            return message.reply({ embeds: [embed] });
        };

        // Buscar por comando
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        // Si no se encuentra
        if (!command) return message.reply({ content: `No se encontró el comando \`${name}\`!` });

        let embed = new Discord.MessageEmbed()
            .setColor(process.env.BOT_COLOR)
            .setTitle(`Comando ${command.name.charAt(0).toUpperCase() + command.name.slice(1)}`)
            .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
            .setFooter(`¡Puedes usar "${prefix}help" para obtener ayuda!`);

        // Comprobar campos del comando
        if (command.category) embed.addField('Categoría', command.category);
        if (command.roles) embed.addField('Permisos', command.roles.join(', '));
        if (command.aliases) embed.addField('Alternativas', command.aliases.join(', '));
        if (command.description) embed.addField('Descripción', command.description);
        if (command.usage) embed.addField('Ejemplo', `${prefix}${command.name} ${command.usage}`);

        // Responder
        message.reply({ embeds: [embed] });
    }
};
