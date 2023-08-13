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
//PLAY SELECTED INDEX VIDEO IMMEDIATELY BASED ON THESONG QUEUE
//Ps. It skips currently playing video
module.exports = {
  name: 'jump',

  aliases: ['jump'],

  description: 'Jump to the selected song.',

  async execute(message, args, cmd, client) {
  //-message: basically is used for detecting which text-channel the user sent, so Qihuahua bot can text to the correct text-channel
  //-args: the input (youtube links) after the command (like '/play'),
  //-cmd: the commmand, if the line is '/skip', then the cmd is 'skip', might remove this later coz no longer using
  //-client: Usually client refering to the bot itself, what i do is i bind stuff with the bot, then connect the bot, then i always reference the bot for what binded with him like a luggage bag, might not a good practise but fk it

    if (!message.member.voice.channel) { //User not in voice channel
      embed_Msg.description = "I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]";
      return message.channel.send({ embeds: [embed_Msg] });
    }

    if (!client.server_queue) { //If no song queue at all
      embed_Msg.description = "Much better if you jump into infinity void. [No song in song queue currently.]";
      return message.channel.send({ embeds: [embed_Msg] });
    }

    //The user input will be like this
    //Exp: /jump 1
    //'/jump' will be 'cmd'
    //User input after command will always stored as in array
    //So args will be like ['1']
    //If we want to get the '1', we then do 'args[0]'

    //This will apply to other files' logic as well, but i only write once here hahahaha
    
    let choice = parseInt(args[0]); //Turn input into integer, coz user input is always string
  
    if (isNaN(choice)) { //Usually some retarded will enter something other than digit
      embed_Msg.description = "Maybe you should give a proper number, not random text... [Invalid index for Jumping to other song.]";
      return message.channel.send({ embeds: [embed_Msg] });
      console.log('>Failed Jump! [1]');
  
    } else {
      if (client.server_queue.songs.length > choice) { //If given index is reachable
  
        embed_Msg.description = "We are jumping!!! [Jumped to song index " + choice + ".]";
        message.channel.send({ embeds: [embed_Msg] });
  
        //Basically i just shift the selected song to the first spot of the queue
        //Then skip the current playing song
        client.server_queue.songs.unshift(server_queue.songs.splice(choice - 1, 1)[0]);
  
        console.log('>Jump!');
        client.player.stop();
  
      } else { //If given index is bigger than the queue's length
        embed_Msg.description = "I don't think that index is reachable. [Input index doesn't match the index of song queue.]";
        message.channel.send({ embeds: [embed_Msg] });
        console.log('>Failed Jump! [2]');
      }
    }
  }
}