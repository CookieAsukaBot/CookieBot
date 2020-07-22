module.exports = {
	name: 'avatar',
    description: 'Muestra tu avatar o el de la persona mencionada.',
    usage: '(mención del usuario opcional)',
	execute(message) {
        // Si no hay una mención
        if (!message.mentions.users.size) {
            return message.channel.send(`Avatar de ${message.author.tag}: ${message.author.displayAvatarURL({ dynamic: true, size: 4096 })}`); // If true, the format will dynamically change to gif for animated avatars; the default is false.
        }

        // Buscar el usuario y agregar el mensaje
        const avatarList = message.mentions.users.map(user => {
            return `Avatar de ${user.tag}: ${user.displayAvatarURL({ dynamic: true, size: 4096 })}`;
        });

        // Responder
        message.channel.send(avatarList);
	},
};