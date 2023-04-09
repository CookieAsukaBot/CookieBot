const { Collection } = require('discord.js');

module.exports = (bot, config) => {
    // Configuración
    const prefix = bot.prefix;

    // Obtener permisos
    const adminPermissions = config.commands.permissions.admin;
    const modPermissions = config.commands.permissions.mod;

    bot.on('messageCreate', async message => {
        // Captar solo comandos
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        if (message.channel.type === "dm") return;

        // Argumentos / Comando
        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Primero busca si hay un comando con ese nombre. Sino, intenta con encontrar uno que esté en aliases o que lo incluya
        const command = bot.commands.get(commandName) ||
                        bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        // Si el comando no existe, no se continúa
        if (!command) return;
        // Abajo de if (!command) return
        // guildOnly option
        // if (command.guildOnly && message.channel.type !== 'text') {
        //     return message.message.channel.send({ content: '¡No puedes usar comandos por mensajes privados! });
        // }

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
            if (!hasPermissions) return message.channel.send({
                content: `¡**${message.author.username}**, no tienes permisos!`
            });
        }

        // Comprobar si requiere de args y el usuario no usó args
        if (command.args && !args.length) {
            let reply = `¡**${message.author.username}**, este comando requiere de "argumento(s)"!`;

            // Si el comando tiene un ejemplo de uso
            if (command.usage) {
                reply += `\nEjemplo de su uso: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send({
                content: reply
            });
        }

        // Sitema de cooldownds
        // https://web.archive.org/web/20200813031659/https://discordjs.guide/command-handling/adding-features.html
        if (!bot.cooldowns.has(command.name)) {
            bot.cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = bot.cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000; // por 1 segundo

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`**${message.author.username}**, espera ${timeLeft.toFixed(1)} segundo(s) para volver a usar \`${command.name}\`.`);
            }
        }

        // Intentar ejecutar el comando
        try {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            await command.execute(message, args, bot);
        } catch (error) {
            console.error(error);
            message.channel.send(`¡**${message.author.username}**, ocurrió un error al intentar usar el comando!`);
        }
    });
}
