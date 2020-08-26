const Discord = require('discord.js');
const moment = require('moment');
moment.locale('es');

const Remind = require('../database/models/Remind');

function generateTemporalTimer(toMs, message, remind) {
    setTimeout(async () => {
        let embed = new Discord.MessageEmbed()
            .setColor(process.env.BOT_COLOR)
            .setAuthor('Recordatorio', message.author.displayAvatarURL())
            .setFooter(`¡Gracias por usar nuestro servici🍪!`)
            .setDescription(`${remind.message}`);

        // Actualizar
        await Remind.updateOne({ _id: remind._id }, {
            isReminded: true
        });

        // Responder
        message.reply({ embed });
    }, toMs);
};

async function commandList(message) {
    const reminds = await Remind.find({ userID: message.author.id });
    const list = [];
    let index = 1;

    // Mensaje
    reminds.map((r) => {
        let getDate = r.date;
        let toMs = moment(getDate).valueOf() - moment().valueOf();

        if (toMs <= 0) return;

        // Agregar
        let id = index++; // index + 1
        let timeFromNow = moment(r.date).fromNow();
        let timeDetailed = moment(r.date).calendar();
        let toPush = `${id} - ${timeDetailed} (${timeFromNow})`

        list.push(toPush);
    });

    if (!reminds || list.length <= 0) return message.reply('no tienes ningún recordatorio!'); // Embed pls

    // Responder
    let embed = new Discord.MessageEmbed()
        .setColor(process.env.BOT_COLOR)
        .setAuthor(`Lista de recordatorios para ${message.author.tag}`, message.author.displayAvatarURL())
        .setFooter(`¡Gracias por usar nuestro servici🍪!`)
        .setDescription(list);

    return message.channel.send({ embed });
};

module.exports = {
	name: 'remind',
    description: 'Crea un recordatorio!',
    aliases: ['remindme', 'rm', 'reminder', 'recordar'],
    usage: '1 (m, h, d, s) | [mensaje]',
	async execute (message, args) {
        // Si no hay args mostrar ejemplo
        if (!args || args.length <= 0) return message.reply(`ejemplo de uso: ${process.env.BOT_PREFIX}${this.name} ${this.usage}`);

        // Comando List
        if (args[0].toLowerCase() === "list") return commandList(message);

        // Comprobar si el comando es válido
        if (!args.join(' ').split('|')[0] || !args.join(' ').split('|')[1]) return message.reply(`ejemplo de uso: ${process.env.BOT_PREFIX}${this.name} ${this.usage}`);

        // Obtener Datos del mensaje
        const msg = args.join(' ').split('|'); // 3d | hello
        const getDate = msg[0].toString(); // 3d
        const getMessage = msg[1].toString(); // hello

        if (!getMessage || getMessage.length <= 0) return message.reply(`ejemplo de uso: ${process.env.BOT_PREFIX}${this.name} ${this.usage}`);

        // Convertir a fecha
        const actualDate = moment();
        let getDateInfo = 0;
        let setDate = actualDate;

        // m
        if (getDate.includes('m')) {
            getDateInfo = parseInt(getDate.split('m')[0]);
            setDate.add(getDateInfo, 'minutes');
        }
        // h
        if (getDate.includes('h')) {
            getDateInfo = parseInt(getDate.split('h')[0]);
            setDate.add(getDateInfo, 'hours');
        }

        // d
        if (getDate.includes('d')) {
            getDateInfo = parseInt(getDate.split('d')[0]);
            setDate.add(getDateInfo, 'days');
        }
        // s
        if (getDate.includes('s')) {
            getDateInfo = parseInt(getDate.split('s')[0]);
            setDate.add(getDateInfo, 'weeks');
        }
        // y?

        // Modelo
        const remind = new Remind({
            userID: message.author.id,

            // dm: false,
            guild: message.guild.id,
            channel: message.channel.id,

            message: getMessage,
            date: setDate
        });

        // Guardar
        await remind.save();

        // Responder
        let embed = new Discord.MessageEmbed()
            .setColor(process.env.BOT_COLOR)
            // .setTitle('Recordatorio')
            .setAuthor(`Recordatorio para ${message.author.tag}`, message.author.displayAvatarURL()) // message.author.tag
            // .setFooter(`¡Gracias por usar nuestro servici🍪!`)
            .setDescription(`Se ha guardado tu recordatorio, te lo recordaré **${setDate.fromNow()}**.`);

        message.channel.send({ embed });
        message.delete();

        // Crear timer
        let toMs = moment(remind.date).valueOf() - moment().valueOf();
        generateTemporalTimer(toMs, message, remind);
	}
};