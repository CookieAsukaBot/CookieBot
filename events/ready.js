module.exports = (bot) => {
    // Al iniciar el bot
    bot.once('ready', () => {
        console.log(`[BOT] ${process.env.BOT_NAME} Se ha conectado a Discord.`);
    });
}