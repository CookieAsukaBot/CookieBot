const Discord = require('discord.js');
const moment = require('moment');
moment.locale('es');

const Remind = require('../database/models/Remind');

async function setTimers(reminds, bot) {
    reminds.forEach(rm => {
        // Transformar a MS
        let getDate = rm.date;
        let toMs = moment(getDate).valueOf() - moment().valueOf();

        if (toMs <= 0) return;
    
        setTimeout(async () => {
            // Recordar
            let guild = await bot.guilds.cache.find(g => g.id === rm.guild);
            let channel = await guild.channels.cache.find(c => c.id === rm.channel);

            let ping = `<@${rm.userID}>`;
            let avatar = await bot.users.cache.find(u => u.id === rm.userID);

            let embed = new Discord.MessageEmbed()
                .setColor(process.env.COLOR)
                .setAuthor('Recordatorio', avatar.displayAvatarURL())
                .setFooter(`¡Gracias por usar nuestro servici🍪!`)
                .setDescription(`${rm.message}`);

            channel.send(`${ping}`, { embed });
            // Actualizar
            // await Remind.deleteOne({ _id: rm._id });
        }, toMs);
    });
};

module.exports = async (bot) => {
    // Obtener recordatorios
    const reminds = await Remind.find();

    setTimers(reminds, bot);
};