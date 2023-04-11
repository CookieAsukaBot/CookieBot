const {Client, GatewayIntentBits, Partials, Collection} = require('discord.js');
const path = require('node:path');

// Cliente
const bot = new Client({
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
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
const events = async () => { // todo: remover await innecesarios?
    await require('./events/commands')(bot, commandPath);
    await require('./events/login')(bot);
    await require('./events/ready')(bot);
    await require('./events/message')(bot, config);
    await require('./events/interactionCreate')(bot);
    await require('./plugins/index')(bot);
    // require('./events/guildMember')(bot);
}

events();
