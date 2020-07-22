module.exports = (bot, config) => {
    // Configuración
    const { prefix } = config.commands;

    // Obtener permisos
    const adminPermissions = config.commands.permissions.admin;
    const modPermissions = config.commands.permissions.mod;

    bot.on('message', message => {
        // Si el mensaje no empieza con el prefix || si el mensaje es de un bot => no avanza el código (return)
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        // Comprobar si el mensaje se envió en el servidor
        if (message.channel.type === "dm") return;
        // Abajo de if (!command) return
        // if (command.guildOnly && message.channel.type !== 'text') {
        //     return message.reply('no puedes usar comandos por mensajes privados!');
        // }

        // Argumentos / Comando
        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Primero busca si hay un comando con ese nombre. Sino, intenta con encontrar uno que esté en aliases o que lo incluya
        const command = bot.commands.get(commandName) ||
                        bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        // Si el comando no existe, no se continúa
        if (!command) return;

        // Comprobar si el comando requiere permisos
        if (command.roles) {
            let hasPermissions = false;

            // Se agrega por si se ha modificado el config.json
            adminPermissions.push('admin');
            modPermissions.push('mod'); 

            // Requiere admin
            // Si el usuario tiene un role de adminPermissions
            if (command.roles.some(r => adminPermissions.includes(r))) {
                // Verificar usuario
                if (message.member.roles.cache.some(r => adminPermissions.includes(r.name))) hasPermissions = true;
            } 

            // Requiere mod
            // Si el usuario tiene un role de modPermissions
            if (command.roles.some(r => modPermissions.includes(r))) {
                // Verificar usuario
                if (message.member.roles.cache.some(r => modPermissions.includes(r.name))) hasPermissions = true;
            }

            // Comprobar si tiene permisos
            // Si el usuario no tiene permisos, no se continúa
            if (!hasPermissions) return message.reply('no tienes permisos!');
        }

        // Comprobar si requiere de args y el usuario no usó args
        if (command.args && !args.length) {
            let reply = `Este comando requiere de "argumento(s)", ${message.author}!`;

            // Si el comando tiene un ejemplo de uso
            if (command.usage) {
                reply += `\nEjemplo de su uso: \`${prefix}${command.name} ${command.usage}\``;
            }

            // Envía el mensaje
            return message.channel.send(reply);
        }

        // Agregar cooldown aquí en el futuro

        // Intentar ejecutar el comando
        try {
            command.execute(message, args);
        } catch (err) {
            console.error(err);
            message.reply('ocurrió un error al intentar usar el comando!');
        }
    });
}