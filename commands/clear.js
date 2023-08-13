/////////////////////////////////////
//LIBRARY
const Discord = require("discord.js")
const ytdl = require('ytdl-core');
const playdl = require('play-dl');

const ytSearch = require('yt-search');

const { EmbedBuilder } = require('discord.js');

const { joinVoiceChannel,
  AudioPlayerStatus,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} = require('@discordjs/voice')

/////////////////////////////////////////
//GLOBAL VARIABLE

//Normal Embed message template
const embed_Msg = {
  color: 0xFEFF9D,
  description: "Random Text",
};

////////////////////////////////////////
//CLEAR CURRENT SONG QUEUE ENTIRELY
module.exports = {
  name: 'clear',

  aliases: ['clear'],

  description: 'Clear song queue.',

  async execute(message, args, cmd, client) {
  //-message: basically is used for detecting which text-channel the user sent, so Qihuahua bot can text to the correct text-channel
  //-args: the input (youtube links) after the command (like '/play'),
  //-cmd: the commmand, if the line is '/skip', then the cmd is 'skip', might remove this later coz no longer using
  //-client: Usually client refering to the bot itself, what i do is i bind stuff with the bot, then connect the bot, then i always reference the bot for what binded with him like a luggage bag, might not a good practise but fk it

    if (!message.member.voice.channel) { //User not in voice channel
      embed_Msg.description = "I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]";
      return message.channel.send({ embeds: [embed_Msg] });
    }
    
    if (!client.server_queue) { //If no current song
      embed_Msg.description = "It's cleared. Wait...the playlist was already empty at the beginning. [No song in song queue currently.]";
      return message.channel.send({ embeds: [embed_Msg] });
    }
  
    embed_Msg.description = "Everything that can be cleared is cleared. [Playlist Cleared.]";
    message.channel.send({ embeds: [embed_Msg] });

    console.log(">Song Queue Cleared.");
    
    client.server_queue.songs = []; //Return a empty array
  }
}
