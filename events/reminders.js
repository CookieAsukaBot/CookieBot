const Discord = require('discord.js');
const moment = require('moment');
moment.locale('es');

const Remind = require('../database/models/Remind');

async function setTimers(reminds, bot) {
    reminds.forEach(rm => {
        // Transformar a MS
        let getDate = rm.date;
        let toMs = moment(getDate).valueOf() - moment().valueOf();

        // Actualizar versión
        if (rm.isReminded) return;
        if (toMs > 2147483647) return; // tenmporal fix | 24.85 días es el límite
        if (toMs <= 0) toMs = 1000;

        setTimeout(async () => {
            // Recordar
            let guild = await bot.guilds.cache.find(g => g.id === rm.guild);
            if (!guild || guild.length == 0) return;
            let channel = await guild.channels.cache.find(c => c.id === rm.channel);

            let ping = `<@${rm.userID}>`;
            let avatar = await bot.users.cache.find(u => u.id === rm.userID);

            let embed = new Discord.MessageEmbed()
                .setColor(process.env.BOT_COLOR)
                .setAuthor('Recordatorio', avatar.displayAvatarURL())
                .setFooter(`¡Gracias por usar nuestro servici🍪! | ${moment(rm.date)}`)
                .setDescription(`${rm.message}`);

            // Actualizar
            await Remind.updateOne({ _id: rm._id }, {
                isReminded: true
            });

            // Responder
            await channel.send(`${ping}`, { embed });
        }, toMs);
    });
};

module.exports = async (bot) => {
    // Obtener recordatorios
    const reminds = await Remind.find();

    setTimers(reminds, bot);
};