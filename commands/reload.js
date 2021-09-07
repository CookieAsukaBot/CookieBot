module.exports = {
	name: 'reload',
    description: 'Recarga un comando!',
    roles: ['admin', 'mod'],
    usage: '[comando]',
	execute (message, args) {
        // Si no hay args
        if (!args[0]) return message.reply({ content: 'no haz mencionado qué comando recargar!' });

        // Buscar comando
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName || message.client.find(c => c.alises && c.aliases.includes(commandName)));

        // Si el comando no existe
        if (!command) return message.reply({ content: `no se encontró el comando \`${command.name}\`` });

        // Eliminar caché
        delete require.cache[require.resolve(`./${command.name}.js`)];

        // Cargar comando
        try {
            // Buscar
            const newCommand = require(`./${commandName}.js`);
            // Agregar al Collection
            message.client.commands.set(newCommand.name, newCommand);
            // Responder
            message.reply({ content: `Se volvió a cargar el comando \`${commandName}\`!` });
        } catch (err) {
            console.log(err);
            let sendError = `Ocurrió un error al volver a cargar el comando \`${commandName}\`\n`;
            sendError += `${err.message}`;

            // Responder
            message.reply({ content: sendError });
        };
	}
};
