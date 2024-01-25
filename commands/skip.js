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

//For storing queue the server queue within the client, 
//or whatever, i think i forgot what it does
const queue = new Map(); 

let current_song = null; //Record curent playing song

//Act as a state, checking if the playlist is fully added to the queue
//Might remove this later
let playlist_queue_status = false; 

//Create audio player for playing music
//This one is variable holder for client.player
//which is an audio player object, basically the music player
let player = null;

//Normal Embed message template
const embed_Msg = {
  color: 0xFEFF9D,
  description: "Random Text",
};

////////////////////////////////////////
//SKIP CURRENT SONG
module.exports = {
  name: 'skip',

  aliases: ['skip'],

  description: 'Skip songs...',

  async execute(message, args, cmd, client) {
  //message: the user input(the whole message including the command, basically used for detecting which text-channel the message is placed)
  //args: the input (youtube links) after the command (like '/play'),
  //cmd: the commmand, if the line is '/skip', then the cmd is 'skip', might remove this later coz no longer using
  //client: Usually client refering to the bot itself, what i do is i bind stuff with the bot, then connect the bot, then the bot gives what binded with him like a luggage bag, might not a good practise but fk it

    //Detect the user in which voice-channel
    const voiceChannel = message.member.voice.channel;
    
    if (!message.member.voice.channel) { //User not in voice channel
      embed_Msg.description = "I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]";
      return message.channel.send({ embeds: [embed_Msg] });
    }

    if (client.player.state.status === AudioPlayerStatus.Idle) { //If no music playing currently
      if (!client.server_queue) { //If server queue is empty/doesn't exist
        embed_Msg.description = "Err...Are you trying to skip something that doesn't exist? [No song in song queue currently.]";
        return message.channel.send({ embeds: [embed_Msg] });
      } 
      
      /*
      else { //Even if the server queue exist hahahaha what am i doing here
        embed_Msg.description = "Err...Are you trying to skip something that doesn't exist? [No song in song queue currently.]";
        return message.channel.send({ embeds: [embed_Msg] });
      }*/
    }

    embed_Msg.description = "Skipped. Skipped. Skipped. [Song Skipped.]";
    message.channel.send({ embeds: [embed_Msg] });

    //Immediately stop the current playing song, 
    //Then the audio player will auto go to next song. (Re)
    client.player.stop();

    // console.log('Move to Next Song');
  }
}