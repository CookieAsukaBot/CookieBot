const Discord = require('discord.js');
const path = require('path');

// Cliente
const bot = new Discord.Client();

// Configuración
const config = require('./config.json');

// Guardar comandos
bot.commands = new Discord.Collection();

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
// require('./plugins/index')(bot);