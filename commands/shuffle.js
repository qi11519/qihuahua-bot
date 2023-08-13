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
//SHUFFLE SONG QUEUE
module.exports = {
  name: 'shuffle',

  aliases: ['shuffle'],

  description: 'Everyday we shuffling!',

  async execute(message, args, cmd, client) {
  //-message: basically is used for detecting which text-channel the user sent, so Qihuahua bot can text to the correct text-channel
  //-args: the input (youtube links) after the command (like '/play'),
  //-cmd: the commmand, if the line is '/skip', then the cmd is 'skip', might remove this later coz no longer using
  //-client: Usually client refering to the bot itself, what i do is i bind stuff with the bot, then connect the bot, then i always reference the bot for what binded with him like a luggage bag, might not a good practise but fk it

    if (!message.member.voice.channel) {
      embed_Msg.description = "I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]";
      return message.channel.send({ embeds: [embed_Msg] });
    }
  
    if (!client.server_queue || client.server_queue.songs.length < 1) {
      embed_Msg.description = "There is nothing at all. [No song in song queue currently.]";
      return message.channel.send({ embeds: [embed_Msg] });
    }
    //Just sort the song queue casually, since it is an array
    //I think sort two times is better so the song queue is more messy
    client.server_queue.songs.sort(() => Math.random() - 0.5);
    client.server_queue.songs.sort(() => Math.random() - 0.5);
  
    embed_Msg.description = "The song queue is shuffled!";
    message.channel.send({ embeds: [embed_Msg] });
  }
}
