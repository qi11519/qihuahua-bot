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
//DISPLAY CURRENT SONG
module.exports = {
  name: 'nowplaying',

  aliases: ['np'],

  description: 'Display current playing song.',

  async execute(message, args, cmd, client) {
  //-message: basically is used for detecting which text-channel the user sent, so Qihuahua bot can text to the correct text-channel
  //-args: the input (youtube links) after the command (like '/play'),
  //-cmd: the commmand, if the line is '/skip', then the cmd is 'skip', might remove this later coz no longer using
  //-client: Usually client refering to the bot itself, what i do is i bind stuff with the bot, then connect the bot, then i always reference the bot for what binded with him like a luggage bag, might not a good practise but fk it

    if (!message.member.voice.channel) { //User not in voice channel
      embed_Msg.description = "I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]";
      return message.channel.send({ embeds: [embed_Msg] });
    }
    
    if (client.current_song == null || !client.current_song) { //If no current song
      embed_Msg.description = "C'mon man, nothing is playing right now. [No song playing currently.]";
      return message.channel.send({ embeds: [embed_Msg] });
    }
  
    const server_queue = client.queue.get(message.guild.id); //Retrieve server_queue, for retrieving text-channel info
  
    //Link for thumbnail attachment
    let thumbnail_link = client.current_song.thumbnails.url.split('?')[0]; //Thumbnail
  
    let playing_Embed_Msg = {
      color: 0xFEFF9D,
      title: client.current_song.title,
      url: client.current_song.url,
      author: {
        name: 'Current Playing Video',
        icon_url: 'attachment://qihuahua.jpg',
      },
      thumbnail: {
        url: thumbnail_link,
      },
      fields: [
        { name: 'Video Link', value: client.current_song.url, inline: true },
        { name: 'Duration:', value: client.current_song.durationRaw, inline: true },
        { name: 'Channel', value: client.current_song.channel.name + "\n" + client.current_song.channel.url },
      ],
    };

    // console.log();

    //Send song info into text-channel
    await client.server_queue.text_channel.send({ embeds: [playing_Embed_Msg], files: ['./images/qihuahua.jpg'] });
  }
}