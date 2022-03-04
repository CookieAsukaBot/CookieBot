module.exports = (bot) => {
    bot.once('ready', () => {
        console.log(`[BOT] [${process.env.BOT_NAME || "BOT"}] Se ha conectado a Discord.`);
    });

    bot.user.setPresence({
        status: process.env.BOT_STATUS || 'online',
        activities: [{
            type: process.env.BOT_ACTIVITY_TYPE || "WATCHING",
            name: process.env.BOT_ACTIVITY || "Cookies"
        }]
    });
};
