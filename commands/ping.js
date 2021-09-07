module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute (message) {
		message.reply({ content: 'Pong.' });
	}
};
