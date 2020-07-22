const { prefix } = require('../config.json').commands;

module.exports = {
    name: 'help',
    description: 'Muestra todos los comandos e información.',
    aliases: ['commands'],
    usage: '[nombre del comando]',
    execute (message, args) {
        // Información para enviar
        const data = [];

        // Obtener la Collection
        const { commands } = message.client;

        // Si no hay args
        if (!args.length) {
            // Agregar título
            data.push(`Lista de comandos`);
            // Agregar comandos
            data.push(commands.map(command => command.name).join(', '));
            // Agregar información
            data.push(`\nPuedes usar \`${prefix}help [nombre del comando]\` para obtener ayuda!`);

            // Responder
            return message.channel.send(data, { split: true });
        }

        // Buscar por comando
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        // Si no se encuentra
        if (!command) return message.reply(`no se encontró el comando \`${name}\`!`);

        // Comprobar campos del comando
        if (command.roles) data.push(`**Permisos:** ${command.roles.join(', ')}`);
        if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Descripción:** ${command.description}`);
        if (command.usage) data.push(`**Uso:** ${prefix}${command.name} ${command.usage}`);

        // Responder
        message.channel.send(data, { split: true });
    }
}