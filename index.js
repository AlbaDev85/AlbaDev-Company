const Discord = require('discord.js')
const { Intents } = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv')
const WOKCommands = require('wokcommands')
const mongoose = require('mongoose')
const bdd = require('./config/bdd.json')
const path = require('path')
require('dotenv/config')
dotenv.config()

const { Client, Collection } = require("discord.js");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MEMBERS, 
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})

client.on('ready', async (client) => {

    days = Math.floor((client.uptime / (1000 * 60 * 60 * 24)) % 60).toString()
    hours = Math.floor((client.uptime / (1000 * 60 * 60)) % 60).toString()
    minuts = Math.floor((client.uptime / (1000 * 60)) % 60).toString()
    seconds = Math.floor((client.uptime / 1000) % 60).toString()

    const uptime = `${days}d ${hours}h ${minuts}m ${seconds}s`
    const version = process.env.VERSION
    const status = [
    `Version : ${version}`,
    `Uptime : ${uptime}`,
    `Sur ${client.guilds.cache.size} serveurs`,
    `Prefix par défaut : w?`
            ];
setInterval(function(){
let stats = status[Math.floor(Math.random()*status.length)]
client.user.setActivity(stats, { type: "PLAYING" })
}, 10000)
    
    console.log(`Discord > A bien été connecté au compte EldoriaMC Bot#6445 !`)
    console.log(`AlbaIsHere > Ce code utilise le TypeScript et le JavaScript !`)
    new WOKCommands(client, {
        commandDir: path.join(__dirname, 'commands'),
        testServers: ['928908030194634752'],
        botOwners: ['504315887541551104'],
        defaultLanguage: 'french',
        disabledDefaultCommands: [
            'help'
        ],
        mongoUri: process.env.MONGO_URI,
        dbOptions: {
            keepAlive: true
        }
    })
    .setDefaultPrefix('w?')
})

function Savebdd() {
    fs.writeFile("./config/bdd.json", JSON.stringify(bdd, null, 4), (err) => {
      if (err) message.channel.send("Une erreur est survenue.");
  });
}

/* Distube */
const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
      new SpotifyPlugin({
        emitEventsAfterFetching: true
      }),
      new SoundCloudPlugin(),
      new YtDlpPlugin()
    ],
    youtubeDL: false
  })

client.login(process.env.TOKEN)