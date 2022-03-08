const { Client, Intents, Collection } = require('discord.js');
const path = require('node:path');

// Cliente
const bot = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS
    ]
});

// Configuración
const config = require('./config.json');
bot.prefix = process.env.BOT_PREFIX;

// Guardar comandos
bot.commands = new Collection();
bot.cooldowns = new Collection();
bot.slashCommands = new Collection();

// Cargar comandos
const commandPath = path.join(__dirname, 'commands');

// Eventos
const events = async () => { // remover await innecesarios
    await require('./events/commands')(bot, commandPath);
    await require('./events/login')(bot);
    await require('./events/ready')(bot);
    await require('./events/message')(bot, config);
    await require('./events/interactionCreate')(bot);
    await require('./events/reminders')(bot);
    await require('./plugins/index')(bot);
    // require('./events/guildMember')(bot);
};

events();
