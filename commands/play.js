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
//I use 'let' here so all these global act as temporarily,
//and i can unpdate it later on, unlike 'const'

//Storing search result from youtube
let search_result = [];
let selectable_result = [];

//Act as a state recorder, checking if the playlist is fully added to the queue
//Might remove this later
let playlist_queue_status = false; 

//Normal Embed message template
const embed_Msg = {
  color: 0xFEFF9D,
  description: "Random Text",
};

////////////////////////////////////////
//WHOLE MESSAGE EMBED STYLE TEMPLATE
//I LEAVE THIS HERE FOR REFERENCE COZ IM TOO LAZY TO GO READ DOCUMENTATION AGAIN, AND AGAIN, AND AGAIN, AND AGAIN
/*
const exampleEmbed = new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle('Some title')
  .setURL('https://discord.js.org/')
  .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
  .setDescription('Some description here')
  .setThumbnail('https://i.imgur.com/AfFp7pu.png')
  .addFields(
    { name: 'Regular field title', value: 'Some value here' },
    { name: '\u200B', value: '\u200B' },
    { name: 'Inline field title', value: 'Some value here', inline: true },
    { name: 'Inline field title', value: 'Some value here', inline: true },
  )
  .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  .setImage('https://i.imgur.com/AfFp7pu.png')
  .setTimestamp()
  .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
*/
////////////////////////////////////////
module.exports = {
  name: 'play',

  aliases: ['p', "playsearch", "ps"],

  description: 'Get in to the voice channel, then plays any shit people want.',

  async execute(message, args, cmd, client) {
  //message: the user input(the whole message including the command, basically used for detecting which text-channel the message is placed)
  //args: the input (youtube links) after the command (like '/play'),
  //cmd: the commmand, if the line is '/skip', then the cmd is 'skip', might remove this later coz no longer using
  //client: usually client refering to the bot itself, what i do is i binded stuff with the bot, then connect the bot, then the bot gives what binded with him like a luggage bag, might not a good practise but fk it
    

    //Detect the user in which voice-channel
    const voiceChannel = message.member.voice.channel;

    //if(!permissions.has('CONNECT')) return message.channel.send("I need your PERMISSION to *Connect* to voice channel, Sir. [Don't have the correct permission.]");
    //if(!permissions.has('SPEAK')) return message.channel.send("I need your PERMISSION to *Speak* in voice channel, Sir. [Don't have the correct permission.]");

    //Detect the user wrote command in which text-channel
    client.server_queue = client.queue.get(message.guild.id);

    //PLAY COMMAND
    if ((cmd === 'play') || (cmd === 'p')) {

      if (!voiceChannel) return message.channel.send('Get your ass into the voice channel! How am I supposed to know where to play all those wacky & cool contents for you. [User not found in voice channel.]');

      if (!args.length) return message.channel.send("Maybe you need to put a link behind the '/play' command so i know what to put ;D [Insert a **Youtube Link** after the '/play ' command.(Don't forget the spacing) ]");

      //Template for a song object
      //basically all it needs for displaying in the discord
      let song = {
        title: null,
        url: null,
        durationRaw: null,
        thumbnails: null,
        channel: null,
        /*
        YouTubeChannel{
          name: null,
          url: null
        }
        */
      };

      var tempLink = args[0]; //just a temporary holder for user input (This one is specially for checking if link is livestream)

      //Regular Expression for identifying a legit youtube link
      var ytRegExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/)(?:\S+)?$/; 

      if (tempLink.includes('live')) { //Check if the user input/link is belongs to a livestream

        //Because the youtube livestream link is not possible for playing by Qihuahua Bot
        //So here, it replaces the chichi-chacha shit of livestream link into a playable type of link for Qihuahua Bot
        //Original: http://www.youtube.com/live/ABC123
        //After: http://www.youtube.com/watch?v=ABC123
        //Both link serves the same actually
        if (tempLink.match(ytRegExp)) {
          tempLink = args[0].split('?');
          args[0] = tempLink[0].replace('live/', 'watch?v=');
        }
      }

      //console.log(args[0]); //I need to see wadafreak ppl put

      ///Check if the link is a playlist
      if (playdl.yt_validate(args[0].split('&')[0]) === 'playlist') {
        
        const playlist = await playdl.playlist_info(args[0], { incomplete : true }); //Obtain the playlist

        const videos = await playlist.all_videos() //Obtain all the videos in the playlist, as in array

        var numVideos = 0; // Count added video
        playlist_queue_status = false; //Starting the process of queuing videos

        //This for-loop is about adding all the videos that obtained earlier into the song queue
        for (const video_details of videos) {

          //Make the video into an object that can be used
          song = {
            title: video_details.title,
            url: video_details.url,
            durationRaw: video_details.durationRaw,
            thumbnails: video_details.thumbnails[0],
            channel: video_details.channel
          };
          console.log(song.title);
          await handleVideo(song, message, client, voiceChannel); //Handling video, go check the handleVideo() function
          numVideos += 1; //Count videos
        }

        playlist_queue_status = true; //Means the process of queuing videos is done

        //Notify all the videos are queued
        let added_Embed_Msg = {
          color: 0xFEFF9D,
          author: {
            name: 'Playlist Queued',
            icon_url: 'attachment://qihuahua.jpg',
          },
          description: 'Total of **' + numVideos + ' Videos** from the playlist is added to the queue.',
        };

        message.channel.send({ embeds: [added_Embed_Msg], files: ['./images/qihuahua.jpg'] });

        console.log("--------------");
        console.log("Total of " + numVideos + " Videos from the playlist is added to the queue.");


      } else { //If not playlist
        
        if (playdl.yt_validate(args[0].split('&')[0]) === 'video') { //Check if it is a video

          try {

            //Get video info, if the video is copyrighted, this always return error
            const song_info = await playdl.video_info(args[0].split('&')[0]);

            //Make the video into an object that can be used
            song = {
              title: song_info.video_details.title,
              url: song_info.video_details.url,
              durationRaw: song_info.video_details.durationRaw,
              thumbnails: song_info.video_details.thumbnails[0],
              channel: song_info.video_details.channel
            };

            await handleVideo(song, message, client, voiceChannel);

            if (client.server_queue) { //If server queue exist
              //If theres song playing currently OR song in playlist
              //I didn't include this in handleVideo() to avoid qihuahua bot spam the text-channel until my hair all falls off when adding a playlist
              if (client.server_queue.songs.length > 0 || client.player._status === AudioPlayerStatus.Idle) { 
                embed_Msg.description = "**" + song.title + "** is added to the song queue, ya better be patient for it.";
                message.channel.send({ embeds: [embed_Msg] });
              }
            }

            //Apparently Youtube blocked you from getting copyrighted music's info
          } catch (error) {
            //console.error('An error occurred while getting video info: ', error);
            embed_Msg.description = "Copyrighted song cannot be played. [Violating Youtube TOS.]";
            return message.channel.send({ embeds: [embed_Msg] });
          }

          //This part is about using youtube search for result
          //Only reach here if user input is not playlist and video link
          //But its not complete yet
        } else {

          if (!(args[0].match(ytRegExp))) {

            console.log('>Searching videos.');

            embed_Msg.description = "Searching videos...";
            message.channel.send({ embeds: [embed_Msg] });
            
            //Search on youtube with the input from user
            search_song(message, args.join(' '));

          } else {
            embed_Msg.description = "I can't find any video from the link. [Error youtube link.]";
            return message.channel.send({ embeds: [embed_Msg] });
          }
        }
      }
    } 
    //JUMP SONG COMMAND
    else if (cmd === 'playsearch' || cmd === 'ps') {
      console.log('>Play selected result!');
      playsearch(message, args[0], client);
    }
  }
}

////////////////////////////////////////////////////////////////
//PLAY VIDEO
const video_player = async (message, song, client) => {
  const song_queue = client.queue.get(message.guild.id);
  
  if (!song) {
    //Check if the queue done
    if (song_queue.songs.length < 1) {
      if (client.player.state.status === AudioPlayerStatus.Idle) {
      //If no more song in the song queue
        embed_Msg.description = '**Playlist Ended.**';
        message.channel.send({ embeds: [embed_Msg] });
      }
    }
    //await song_queue.connection.destroy();
    //queue.delete(guild.id);
    return;
  } else {
    console.log('----------------------');//I am a line, ignore me
    //To check what is the current captured song
    console.log(">Playing: " + song.title);
  }

  //converting video into playable source for audio player
  const source = await playdl.stream(song.url);

  song_queue.connection.subscribe(client.player)

  //Create the resource(basically the processed video) for the audio player to play
  const resource = createAudioResource(source.stream, { inputType: source.type })

  client.player.setMaxListeners(0) //Unset the limit of listeners, but why they create this in the first place???
  client.player.play(resource) //Play the audio player

  //Update current playing song
  client.current_song = song;

  //This function is about displaying the current playing song.
  //now_playing(message, song);

  client.commands.get('nowplaying').execute(message, [], 'nowplaying', client);
}

////////////////////////////////////////////////////////////////
//HANDLE PLAYLIST VIDEOS
//ADD VIDEOS FROM PLAYLIST TO QUEUE
//It has pretty much similar code from the algorithm of play command
async function handleVideo(song, message, client, voiceChannel) {
  
  //Basically, to detect which text-channel the command message is from,
  //Because song queue is binded to text-channel
  client.server_queue = client.queue.get(message.guild.id);

  //If there was no song queue OR qihuahua bot was not playing song at all
  //Create a new song queue for storing songs
  if (!client.server_queue) {
    client.server_queue = {
      voice_channel: voiceChannel,
      text_channel: message.channel,
      connection: null,
      songs: []
    }

    //Binding the queue to the text-channel
    client.queue.set(message.guild.id, client.server_queue);

    //Add videos to the playlist
    client.server_queue.songs.push(song);

    //Create connection for the bot, to the voice channel
    try {
      client.server_queue.connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      });

      //Play the first music basically
      let next_music = client.server_queue.songs.shift()
      await video_player(message, next_music, client);

      //If the current song stopped playing/ended,
      //Detect the audio player, if idle
      //Play next song (Getting next song from song queue)
      client.player.on(AudioPlayerStatus.Idle, () => {
        next_music = client.server_queue.songs.shift()
        video_player(message, next_music, client);
      });
      
      //Catching the god-damn errors
    } catch (error) {
      client.queue.delete(message.guild.id);
      //console.error('An error occurred while connecting: ', error);
      embed_Msg.description = 'There was an error connecting! Please try again later!';
      message.channel.send({ embeds: [embed_Msg] });
      throw error;
    }

    //If a song queue is already generated/qihuahua bot is already playing music
  } else {
    //if (server_queue.songs.length < 0){
    if (client.player.state.status === AudioPlayerStatus.Idle) {
      video_player(message, song, client);
    } else {
      //Just add the video to the existing song queue
      client.server_queue.songs.push(song);
    }
    return undefined;
  }
  return undefined; //maybe it works
}

////////////////////////////////////////////////////////////////
//SEARCH SONG
const search_song = async (message, query) => {

  search_result = [];
  
  const r = await ytSearch(query); //Search result, it returns an array of videos

  const videos = r.videos.slice(0, 10); //Get the first 10 video from search result

  if (videos.length < 0){
    embed_Msg.description = "Seems like there is none of what you are looking for... [No search result.]";
    return message.channel.send({ embeds: [embed_Msg] });
  }
  
  //videos.forEach( function ( video ) {
  for (let video of videos) {
    const song_info = await playdl.video_info(video.url); //Get video info

    song = {
      title: song_info.video_details.title,
      url: song_info.video_details.url,
      durationRaw: song_info.video_details.durationRaw,
      thumbnails: song_info.video_details.thumbnails[0],
      channel: song_info.video_details.channel
    };

    search_result.push(song);
  }
  //);

  let song_queue_array = []; //String holder
  selectable_result = []; //Global variable, for storing search result
  
  let i = 1;

  //Show all song in list, by iterating
  for (let song of search_result) {
    selectable_result.push(song);
    song_queue_array.push({ name: i + ". " + song.title, value: "Channel: " + song.channel.name + " **|** Duration: " + song.durationRaw });
    i++;
  }
  //let display_song_queue_array = song_queue_array.slice(0, 10);

  //Generating a embed message for search result
  let search_Embed_Msg = {
    color: 0xFEFF9D,
    author: {
      name: 'Searched Result:-',
      icon_url: 'attachment://qihuahua.jpg',
    },
    description: "Use command **'/playsearch' (ps) [Index number]** to play desired video. \n[From number '1' to '10']",
    fields: song_queue_array,
  };

  console.log('>Found videos!');
  message.channel.send({ embeds: [search_Embed_Msg], files: ['./images/qihuahua.jpg'] });
}

////////////////////////////////////////////////////////////////
//PLAY SELECTED SEARCH RESULT
const playsearch = async (message, target, client) => {

  if (!message.member.voice.channel) {
    embed_Msg.description = "I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]";
    return message.channel.send({ embeds: [embed_Msg] });
  }

  if (!selectable_result.length > 0) {
    embed_Msg.description = "I think I can't just pop out something that doesn't exist. [No search result.]";
    return message.channel.send({ embeds: [embed_Msg] });
  }

  const voiceChannel = message.member.voice.channel;

  let choice = parseInt(target); //Turn input into integer, coz initial input is always string

  if (isNaN(choice)) { //Usually some retarded will enter something other than digit
    embed_Msg.description = "Maybe you should give a proper number, not random text... [Invalid index for search result.]";
    console.log('>Failed play search! [1]');
    return message.channel.send({ embeds: [embed_Msg] });

  } else {
    if (selectable_result.length > choice && choice > 0) { //If given index is reachable

      embed_Msg.description = "Playing the selected search result. [Result Index : " + choice + "]";
      message.channel.send({ embeds: [embed_Msg] });

      await handleVideo(selectable_result[choice-1], message, client, voiceChannel);

    } else { //If given index is bigger than the queue's length
      embed_Msg.description = "I don't think that index is reachable. [Input index doesn't match the index of search result.]";
      console.log('>Failed play search! [2]');
      return message.channel.send({ embeds: [embed_Msg] });
    }
  }
  return;
}
