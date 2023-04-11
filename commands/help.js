const Discord = require('discord.js');

const prefix = process.env.BOT_PREFIX;

// Agregar comandos en la descripción del Embed
function addDescription (commands) {
    let fullDescription = "";

    let temporal = [];
    commands.forEach(command => {
        if (command.category) {
            if (!temporal.includes(command.category)) {
                temporal.push(command.category);
                fullDescription += `\n**${command.category}**\n`;
            }
            fullDescription += `**${prefix}${command.name}** - ${command.description}\n`;
        } else {
            fullDescription += `**${prefix}${command.name}** - ${command.description}\n`;
        }
    });

    return fullDescription;
}

module.exports = {
    name: 'help',
    category: 'General',
    description: 'Muestra todos los comandos e información.',
    aliases: ['commands', 'ayuda', 'comandos'],
    usage: '[nombre del comando]',
    execute (message, args) {
        // Obtener la Collection
        const { commands } = message.client;

        // Si no hay args
        if (!args.length) {
            // Embed
            let embed = new Discord.EmbedBuilder()
                .setColor(process.env.BOT_COLOR)
                .setTitle('📚 Lista de comandos')
                .setAuthor({
                    name: message.client.user.username,
                    iconURL: message.client.user.displayAvatarURL()
                })
                .setFooter({
                    text: `¡Puedes usar "${prefix}help [nombre del comando]" para obtener ayuda!`
                });

            // Agregar comandos al Embed
            embed.setDescription(addDescription(commands));

            // Responder
            return message.channel.send({
                embeds: [embed]
            });
        }

        // Buscar por comando
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        // Si no se encuentra
        if (!command) return message.channel.send({
            content: `¡**${message.author.username}**, no se encontró el comando \`${name}\`!`
        });

        let embed = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setTitle(`Comando ${command.name.charAt(0).toUpperCase() + command.name.slice(1)}`)
            .setAuthor({
                name: message.client.user.username,
                iconURL: message.client.user.displayAvatarURL()
            })
            .setFooter({
                text: `¡Puedes usar "${prefix}help" para obtener ayuda!`
            });

        // Comprobar campos del comando
        if (command.category) embed.addFields({ name: 'Categoría', value: command.category });
        if (command.roles) embed.addFields({ name: 'Permisos', value: command.roles.join(', ') });
        if (command.aliases) embed.addFields({ name: 'Alternativas', value: command.aliases.join(', ') });
        if (command.description) embed.addFields({ name: 'Descripción', value: command.description });
        if (command.usage) embed.addFields({ name: 'Ejemplo', value: `${prefix}${command.name} ${command.usage}` });

        // Responder
        message.channel.send({
            embeds: [embed]
        });
    }
}
