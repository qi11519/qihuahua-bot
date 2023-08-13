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
//SHOW QUEUE
module.exports = {
  name: 'queue',

  aliases: ['queue'],

  description: 'Display current song queue.',

  async execute(message, args, cmd, client) {
  //-message: basically is used for detecting which text-channel the user sent, so Qihuahua bot can text to the correct text-channel
  //-args: the input (youtube links) after the command (like '/play'),
  //-cmd: the commmand, if the line is '/skip', then the cmd is 'skip', might remove this later coz no longer using
  //-client: Usually client refering to the bot itself, what i do is i bind stuff with the bot, then connect the bot, then i always reference the bot for what binded with him like a luggage bag, might not a good practise but fk it

    if (!message.member.voice.channel) { //User not in voice channel
      embed_Msg.description = "I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]";
      return message.channel.send({ embeds: [embed_Msg] });
    }
  
    if (client.server_queue == null || !client.server_queue) { //No song queue
      embed_Msg.description = "There is nothing at all. [No song in song queue currently.]";
      return message.channel.send({ embeds: [embed_Msg] });
    }
  
    let song_queue_array = []; //String holder
  
    let i = 1;
  
    //Show all song in list, by iterating
    for (let listed_song of client.server_queue.songs) {
      song_queue_array.push({ name: i + ". " + listed_song.title, value: "Duration: " + listed_song.durationRaw });
      i++;
    }
  
    let display_song_queue_array = song_queue_array.slice(0, 10);
  
    let queue_Embed_Msg = {
      color: 0xFEFF9D,
      author: {
        name: 'Current Song Queue:-',
        icon_url: 'attachment://qihuahua.jpg',
      },
    };
  
    //Generating a embed message for 'Help'
    if (song_queue_array.length < 1) {
      queue_Embed_Msg.description = 'There is nothing in the song queue.';
    } else {
      queue_Embed_Msg.description = '*Total Song:* **' + client.server_queue.songs.length + "**";
      queue_Embed_Msg.fields = display_song_queue_array;
    }
  
    message.channel.send({ embeds: [queue_Embed_Msg], files: ['./images/qihuahua.jpg'] });
  }
}


