module.exports = {
	name: 'ping',
	category: 'General',
	description: 'Ping.',
	execute (message) {
		message.channel.send({
			content: `**Pong**!`
		});
	}
}
