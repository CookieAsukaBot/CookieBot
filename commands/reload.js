module.exports = {
	name: 'reload',
    description: 'Recarga un comando.',
    roles: ['admin', 'mod'],
    usage: '<comando>',
    cooldown: 3,
	execute (message, args) {
        // Si no hay args
        if (!args[0]) return message.channel.send({
            content: `**${message.author.username}**, no has mencionado qué comando recargar!`
        });

        // Buscar comando
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName || message.client.find(c => c.alises && c.aliases.includes(commandName)));

        // Si el comando no existe
        if (!command) return message.channel.send({
            content: `**${message.author.username}**, no se encontró el comando \`${command.name}\``
        });

        // Cargar comando
        try {
            // Eliminar caché
            delete require.cache[require.resolve(`./${command.name}.js`)];
            // Buscar
            const newCommand = require(`./${commandName}.js`);
            // Agregar al Collection
            message.client.commands.set(newCommand.name, newCommand);
            // Responder
            message.channel.send({
                content: `Se volvió a cargar el comando \`${commandName}\`.`
            });
        } catch (err) {
            console.log(err);
            // Responder
            message.channel.send({
                content: `Ocurrió un error al volver a cargar el comando \`${commandName}\`.`
            });
        };
	}
};
