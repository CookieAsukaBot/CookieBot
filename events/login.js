module.exports = (bot, config) => {
    // Obtener Token desde el config
    const { token } = config.bot;

    // Iniciar sesión
    bot.login(token);
}