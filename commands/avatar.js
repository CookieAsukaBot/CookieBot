const fixExtension = (url) => {
    return url.includes("webp") ? url.replace("webp", "png") : url;
}

const getAvatar = (user) => {
    return fixExtension(user.displayAvatarURL({
        dynamic: true,
        size: 4096
    }));
}

module.exports = {
	name: 'avatar',
    category: 'General',
    description: 'Muestra tu avatar o el de la persona mencionada.',
    usage: '<@usuario>',
	execute(message) {
        // Si no hay una mención
        if (!message.mentions.users.size) {
            return message.channel.send({
                content: `**${message.author.globalName}**, avatar de ${message.author.username}:\n${getAvatar(message.author)}`
            });
        }

        // Por cada mención
        let avatarList = message.mentions.users.map(user => {
            return `Avatar de ${user.tag}:\n${getAvatar(user)}`; // todo: tiene que haber un máximo de menciones ya que Discord no tiene caracteres infinitos (con un index)
        });

        // Responder
        message.channel.send({
            content: `**${message.author.globalName}**,\n${avatarList.join(",").replaceAll(",", "\n")}`
        });
	},
}
