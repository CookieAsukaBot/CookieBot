module.exports = {
	name: 'ping',
	category: 'General',
	description: 'Ping.',
	execute (message) {
		message.channl.send({
			content: 'Pong!'
		});
	}
}
