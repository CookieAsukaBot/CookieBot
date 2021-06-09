module.exports = {
	name: 'play',
	description: 'Play!',
	execute (message) {
		message.channel.send('Song!');
	}
};