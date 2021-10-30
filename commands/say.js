module.exports = {
    name: 'say',
    description: 'Lo que agregues como mensaje lo diré por ti!',
    roles: ['admin'],
    usage: '[mensaje]',
    execute(message, args) {
        // Comprobar si tiene args
        if (!args || args.length <= 0) return message.delete();

        // Mensaje
        let msg = args.join(' ');

        // Eliminar mensaje
        message.delete();

        // Mostrar por consola
        let showConsole = `[${message.channel.guild.name}][#${message.channel.name}][!say][${message.author.tag}] ${msg}`;
        console.log(showConsole); // opcional?

        // Enviar mensaje
        message.channel.send({ content: msg });
    }
};
