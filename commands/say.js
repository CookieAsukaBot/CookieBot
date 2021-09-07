module.exports = {
    name: 'say',
    description: 'Lo que agregues como mensaje lo diré por ti!',
    roles: ['admin'],
    usage: '[mensaje]',
    execute(message, args) {
        // Comprobar si tiene args
        if (!args || args.length <= 0) return message.delete();

        // Mensaje
        let msg = args.join(' '); // https://stackoverflow.com/questions/28007949/how-to-convert-array-into-string-without-comma-and-separated-by-space-in-javascr/28007965

        // Eliminar mensaje
        message.delete();

        // Mostrar por consola
        let showConsole = `[${message.channel.guild.name}][#${message.channel.name}][!say][${message.author.tag}] ${msg}`;
        console.log(showConsole); // opcional?

        // Enviar mensaje
        message.reply({ content: msg });
    }
};
