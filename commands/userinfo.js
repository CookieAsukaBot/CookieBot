const Discord = require('discord.js');
const moment = require('moment');
moment.locale('es');

module.exports = {
    name: 'userinfo',
    description: 'placeholder',
    roles: ['admin'],
    usage: '[@mención (opcional)]',
    async execute(message, args) {
        const mention = message.mentions.users.first();
        const user = message.author;

        const embed = new Discord.MessageEmbed()
            .setColor(process.env.BOT_COLOR);

        // Obtener datos
        if (mention) {

        } else {
            let guild = await message.client.guilds.cache.find(g => g.id === message.guild.id);
            let member = await guild.members.cache.find(m => m.id === message.author.id);

            embed.setAuthor(`Info. de ${message.author.tag}`, message.author.displayAvatarURL());
            embed.addField('ID', `${user.id}`);

            if (member.nickname) embed.addField('Apodo', `${member.nickname}`);

            embed.addField(`Se registró ${moment(user.createdAt).fromNow()} 📆`, `${moment(user.createdAt).format('LLLL')}`);
            embed.addField(`Ingresó al servidor ${moment(member.joinedAt).fromNow()} 📅`, `${moment(member.joinedAt).format('LLLL')}`);
        };

        // Responder
        await message.reply({ embeds: [embed] });
    }
};
