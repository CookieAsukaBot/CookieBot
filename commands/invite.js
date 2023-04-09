module.exports = {
	name: 'invite',
    category: 'General',
    description: 'Agrega el bot a tu servidor.',
	execute(message) {
        message.channel.send({
            content: `https://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=0&scope=applications.commands%20bot`
        });
	}
}
