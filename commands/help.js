const Discord = require('discord.js');

const prefix = process.env.BOT_PREFIX;

// Agregar comandos en la descripción del Embed
function addDescription(commands) {
    let desc = "";

    commands.forEach(c => {
        desc += `**${prefix}${c.name}** - ${c.description}\n`;
    });

    return desc;
};

module.exports = {
    name: 'help',
    description: 'Muestra todos los comandos e información.',
    aliases: ['commands'],
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
            return message.channel.send({ embed });
        }

        // Buscar por comando
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        // Si no se encuentra
        if (!command) return message.reply(`no se encontró el comando \`${name}\`!`);

        let embed = new Discord.MessageEmbed()
            .setColor(process.env.BOT_COLOR)
            .setTitle(command.name.charAt(0).toUpperCase() + command.name.slice(1))
            .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
            .setFooter(`¡Puedes usar "${prefix}help" para obtener ayuda!`);

        // Comprobar campos del comando
        if (command.roles) embed.addField('Permisos', command.roles.join(', '));
        if (command.aliases) embed.addField('Alternativas', command.aliases.join(', '));
        if (command.description) embed.addField('Descripción', command.description);
        if (command.usage) embed.addField('Ejemplo', `${prefix}${command.name} ${command.usage}`);

        // Responder
        message.channel.send({ embed });
    }
};