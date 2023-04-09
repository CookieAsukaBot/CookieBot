module.exports = {
	name: 'purge',
    category: 'General',
    description: 'Limpia el chat (hasta 99 mensajes).',
    aliases: ['clearchat', 'cleanchat'],
    roles: ['admin'],
    usage: '<cantidad de mensajes>',
	execute(message, args) {
        // Obtener cantidad de mensajes
        const amount = parseInt(args[0]) + 1; // +1 es por el mensaje que se usa de comando

        // Comprobar valores
        if (isNaN(amount)) return message.channel.send({
            content: `**${message.author.username}**, se require de números!`
        });

        if (amount <= 1 || amount > 100) return message.channel.send({
            content: `**${message.author.username}**, se requiere de un valor del 1 al 99.` // todo: redacción?
        });

        // Eliminar mensajes
        message.channel.bulkDelete(amount, true)
            .catch(error => {
                console.error(error);
                message.channel.send({
                    content: `¡**${message.author.username}**, ocurrió un error al intentar de eliminar mensajes en este canal!`
                });
            });
	}
}
