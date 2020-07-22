module.exports = (bot, config) => {
    // Al iniciar el bot
    bot.once('ready', () => {
        console.log(`[BOT] ${config.bot.name} Se ha conectado a Discord.`);
    });
}