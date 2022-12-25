const Discord = require("discord.js")
const dotenv = require("dotenv")
const express = require("express");
const keepAlive = require("./server");

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


const client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.commands = new Discord.Collection();
client.events = new Discord.Collection();



['command_handler', 'event_handler'].forEach(handler => {
  //console.log(handler);
  //console.log('${handler}');
  var file_place = './handlers/' + handler;
  //console.log(file_place);
  require(file_place)(client, Discord);
})


client.on('guildMemberAdd', guildMember => {
  const roleName = 'Qihuahua Bot';
  let welcomeRole = guildMember.guild.roles.cache.get(role => role.name(roleName))
  guildMember.roles.add(welcomeRole);
});


keepAlive();
console.log('hello');
client.login(process.env.token);