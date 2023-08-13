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
//STOP QIHUAHUA BOT
module.exports = {
  name: 'stop',

  aliases: ['stop'],

  description: 'Stop Qihuahua Bot from staying alive.',

  async execute(message, args, cmd, client) {
  //-message: basically is used for detecting which text-channel the user sent, so Qihuahua bot can text to the correct text-channel
  //-args: the input (youtube links) after the command (like '/play'),
  //-cmd: the commmand, if the line is '/skip', then the cmd is 'skip', might remove this later coz no longer using
  //-client: Usually client refering to the bot itself, what i do is i bind stuff with the bot, then connect the bot, then i always reference the bot for what binded with him like a luggage bag, might not a good practise but fk it

    //Detect the user in which voice-channel
    const voiceChannel = message.member.voice.channel;

    if (!message.member.voice.channel) { //User not in voice channel
      embed_Msg.description = "I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]";
      return message.channel.send({ embeds: [embed_Msg] });
    }

    //Reset current playing song
    client.current_song = {
                        title: null,
                        url: null,
                        durationRaw: null,
                        thumbnails: null,
                        channel: null,
                      }; 
    
    //If qihuahua is in the voice-channel, then kick its ass out
    if (client.server_queue != null) {
      if (client.server_queue.connection._state.status == "ready") { //If Qihuahua bot is staying in the voice channel
    
        embed_Msg.description = "Ciao! [Force Stopped.]";
        message.channel.send({ embeds: [embed_Msg] });
    
        await client.server_queue.connection.destroy(); //Destroy Qihuahua bot from reality.
        client.queue.delete(message.guild.id);
    
      } else { //If Qihuahua bot is not in voice channel
        embed_Msg.description = "I wasn't even here! [Force Stopped.]";
        message.channel.send({ embeds: [embed_Msg] });
      }
    } else { //If server queue doesn't exist, usually means Qihuahua bot is not & was not playing music at all
      embed_Msg.description = "I wasn't even here! [Force Stopped.]";
      message.channel.send({ embeds: [embed_Msg] });
    }

    //Reset song queue
    return client.server_queue = null; 
  }
}