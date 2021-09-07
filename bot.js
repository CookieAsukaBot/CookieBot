const { Client, Intents, Collection } = require('discord.js');
const path = require('path');

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

// Guardar comandos
bot.commands = new Collection();

// Cargar comandos
const commandPath = path.join(__dirname, 'commands');


// Commands
require('./events/commands')(bot, commandPath);

// Ready
require('./events/ready')(bot);

// guildAddMember / guildRemoveMember
// require('./events/guildMember')(bot);

// Message
require('./events/message')(bot, config);

// Login
require('./events/login')(bot);

// Reminders
require('./events/reminders')(bot);

// Plugins
require('./plugins/index')(bot);
