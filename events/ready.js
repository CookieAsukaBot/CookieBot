module.exports = (bot) => {
    bot.on('ready', () => {
        console.log(`[BOT] [${process.env.npm_package_version}] [${process.env.BOT_NAME || "BOT"}] Se conectó a Discord.`);
    });

    bot.user.setPresence({
        activities: [{
            name: process.env.BOT_ACTIVITY || "Cookies",
            // type: process.env.BOT_ACTIVITY_TYPE || "WATCHING"
        }],
        status: process.env.BOT_STATUS || 'online'
    });
}
