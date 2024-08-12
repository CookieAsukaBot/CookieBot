const Discord = require('discord.js');
const moment = require('moment');
moment.locale('es');

const getJoined = (user, member) => {
    let discord = `**Discord**: ${moment(user.createdAt).fromNow()}\n➡|| ${moment(user.createdAt).format('LLLL')}||\n`;
    let guild = `**Servidor**: ${moment(member.joinedAt).fromNow()}\n➡|| ${moment(member.joinedAt).format('LLLL')}||`;

    return discord + guild;
}

const getInfo = (user, member) => {
    let info = ``;

    if (user.id) info += `**ID**: ${user.id}`;
    if (user.bot) info += `\n**Bot**: Sí`;
    // if (user.owner) info += `\n**Dueño**: Sí`;

    return info;
}

const getGuild = (user, member) => {
    let info = "";

    if (member.nickname) info += `**Apodo**: ${member.nickname}\n`;
    if (member.displayHexColor) info += `**Color**: ${member.displayHexColor}\n`
    info += `**Roles**: ${member._roles.length}`;

    return info;
}

const getStatus = (user, member) => {
    // Needs testing #todo
    /**
     * bugs:
     * - Si el usuario está offline no tiene estado
     * - Si el usuario no tiene estado crashea
     */
    // return `${member.presence.status} | ${member.presence.activities ? member.presence.activities[0].state || member.presence.activities[0] : ''}`;
    console.log({member})
    return `${member.presence?.status}`;
}

const generateEmbed = (embed, user, member) => {
    embed.setAuthor({
        name: `Info. de ${user.tag}`,
        iconURL: user.displayAvatarURL()
    });

    embed.addFields(
        {name: `📰 Información`, value: getInfo(user, member), inline: true},
        {name: `📅 Ingresó`, value: getJoined(user, member), inline: true},
        {name: `🎭 Servidor`, value: getGuild(user, member)},
        {name: `⭐ Estado`, value: getStatus(user, member)}
    );

    return embed;
}

module.exports = {
    name: 'userinfo',
    category: 'General',
    description: 'Información sobre tu cuenta o la de un usuario.',
    usage: '<@mención>',
    cooldown: 3,
    async execute(message, args) {
        let mention = message.mentions.users.first();
        let guild = await message.client.guilds.cache.find(g => g.id === message.guild.id);
        let user = message.author;

        let embed = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR);

        // Obtener datos
        if (mention) {
            let member = await guild.members.cache.find(m => m.id === mention.id);
            user = mention;
            embed = generateEmbed(embed, user, member);
        } else {
            let member = await guild.members.cache.find(m => m.id === message.author.id);
            embed = generateEmbed(embed, user, member);
        }

        // Responder
        message.channel.send({
            embeds: [embed]
        });
    }
}
