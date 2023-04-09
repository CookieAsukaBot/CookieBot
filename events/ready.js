module.exports = (bot) => {
    bot.on('ready', () => {
        console.log(`[BOT] [${process.env.BOT_NAME || "BOT"}] Se conectó a Discord.`);
    });

    bot.user.setPresence({
        status: process.env.BOT_STATUS || 'online',
        activities: [{
            type: process.env.BOT_ACTIVITY_TYPE || "WATCHING",
            name: process.env.BOT_ACTIVITY || "Cookies"
        }]
    });
}
