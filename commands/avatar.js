const getAvatar = (user) => {
    // If true, the format will dynamically change to gif for animated avatars; the default is false.
    return fixExtension(user.displayAvatarURL({ dynamic: true, size: 4096 }));
};

const fixExtension = (url) => {
    if (url.includes("webp")) {
        return url.replace("webp", "png");
    } else {
        return url;
    };
};

module.exports = {
	name: 'avatar',
    description: 'Muestra tu avatar o el de la persona mencionada.',
    usage: '(mención del usuario opcional)',
	execute(message) {
        // Si no hay una mención
        if (!message.mentions.users.size) {
            return message.reply({
                content: `Avatar de ${message.author.tag}: ${getAvatar(message.author)}`
            });
        };

        // Por cada mención
        let avatarList = message.mentions.users.map(user => {
            return `Avatar de ${user.tag}: ${getAvatar(user)}`;
        });

        // Responder
        message.reply({
            content: `${avatarList.join(",").replaceAll(",", "\n")}`
        });
	},
};
