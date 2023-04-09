const { SlashCommandBuilder } = require('@discordjs/builders');

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
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Muestra tu avatar o el de la persona mencionada.')
		.addUserOption(option => option.setName('target').setDescription('El avatar a mostrar de...')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');

		if (!user) {
			return interaction.reply(`Tu avatar: ${getAvatar(interaction.user)}`);
		}

		return interaction.reply(`Avatar de ${user.tag}:\n${getAvatar(user)}`);
	},
}
