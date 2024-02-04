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
    description: 'Muestra tu avatar o de las personas mencionadas.',
    usage: '<@usuario>',
	async execute(message) {
        let mentions = message.mentions.users; // todo: limitar cantidad de menciones
        let avatars = [];
        let users = [];

        // Si no hay una mención
        if (!mentions.size) {
            avatars.push(getAvatar(message.author))
            return message.channel.send({
                content: `**${message.author.globalName}**, avatar de ${message.author.username}:`,
                files: avatars
            });
        }

        // Por cada mención
        await mentions.forEach(user => {
            users.push(user.tag);
            avatars.push(getAvatar(user));
        });

        let usersLists = users.map(user => `:arrow_right: **${user}**\n`).join('');

        // Responder
        message.channel.send({
            content: `**${message.author.globalName}**, avatares:\n${usersLists}`,
            files: avatars
        });
	},
}
