const Discord = require("discord.js")
const dotenv = require("dotenv")
const express = require("express");
const keepAlive = require("./server");
const { checkStream, authenticate } = require("./checkStreamerLive");
const checkYTUpload = require('./checkYTUpload');


const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { AudioPlayerStatus,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  getVoiceConnection,
} = require('@discordjs/voice')

const fs = require("fs")
const { Player } = require("discord-player")
const ytdl = require("ytdl-core");
const { Client, Intents } = require('discord.js');

let twitchMessageSent = false;
let ytMessageSent = {
  color: 0xC70808,
  description: "Random Text",
};

const client = new Client({ 
  partials: ["MESSAGE", "CHANNEL", "REACTION"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const commands = []; //To store command
client.commands = new Discord.Collection(); //Storing available command as file identifier(basically, using command to find file name)
client.events = new Discord.Collection(); //same as above


client.queue = new Map(); //This one is for recording and capturing 'server_queue' from 'message'
client.server_queue = new Map(); //This one is for recording song queue and bot's connection

//Create audio player for playing music
//This one is variable holder for client.player
//which is an audio player object, basically the music player
client.player = createAudioPlayer(); 

client.current_song = {
                        title: null,
                        url: null,
                        durationRaw: null,
                        thumbnails: null,
                        channel: null,
                      };

//Allow handling command name pointing to their corresponding files
//but actually, it just path finding to the file
['command_handler', 'event_handler'].forEach(handler => {
  //console.log(handler);
  //console.log('${handler}');
  var file_place = './handlers/' + handler;
  //console.log(file_place);
  require(file_place)(client, Discord, commands);
})

//Auto adding discord role "Qihuahua Bot" to the bot, if the role exist in the server
client.on('guildMemberAdd', guildMember => {
  const roleName = 'Qihuahua Bot';
  let welcomeRole = guildMember.guild.roles.cache.get(role => role.name(roleName))
  guildMember.roles.add(welcomeRole);
});

/////////////////////////////////////////////////////////////
client.on('ready', async () => {
  await authenticate();
  console.log(`>Authenticated with Twitch API`);
  
  console.log(`>Twitch API ready for ${client.user.tag}`);
  console.log(`>Youtube API ready for ${client.user.tag}`);
  
  setInterval(async () => {
    twitchMessageSent = await checkStream(client, twitchMessageSent);
    ytMessageSent = await checkYTUpload(client, ytMessageSent);
  }, 1790000);
});

/////////////////////////////////////////////////////////////

keepAlive();
console.log('hello');
client.login(process.env.token);