module.exports = {
	name: 'invite',
    description: '¡Agrega el bot a tu servidor!',
	execute(message) {
        message.reply({
            content: `https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&permissions=0&scope=bot`
        });
	}
};
