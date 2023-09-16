module.exports = {
    name: 'say',
    category: 'General',
    description: 'Lo que agregues como mensaje lo diré por ti.',
    roles: ['admin'],
    usage: '[mensaje]',
    execute(message, args) {
        // Comprobar si tiene args
        if (!args || args.length <= 0) return message.delete();

        // Mensaje
        let msg = args.join(' ');

        // Eliminar mensaje
        // todo: si el bot no tiene permisos esto crash
        try {
            message.delete();
        } catch (error) {}

        // Mostrar por consola
        let showConsole = `[${message.channel.guild.name}][#${message.channel.name}][${process.env.prefix}${this.name}][${message.author.username}] ${msg}`;
        console.log(showConsole); // opcional?

        // Enviar mensaje
        message.channel.send({
            content: msg
        });
    }
}
