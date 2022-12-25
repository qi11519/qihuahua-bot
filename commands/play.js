
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel } = require('@discordjs/voice');
const { AudioPlayerStatus,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} = require('@discordjs/voice')

const Youtube = require('simple-youtube-api');
const youtube = new Youtube(process.env.GOOGLE_API_KEY);
const { escapeMarkdown } = require ('discord.js');

const queue = new Map();
const player = createAudioPlayer();

module.exports = {
  name: 'play',
  aliases: ['p','skip','stop','clear', "queue", "np"],
  description: 'Get in to the voice channel, then plays any shit people want.',
  async execute(message, args, cmd, client, Discord) {
    const voiceChannel = message.member.voice.channel;

    //if(!permissions.has('CONNECT')) return message.channel.send("I need your PERMISSION to *Connect* to voice channel, Sir. [Don't have the correct permission.]");
    //if(!permissions.has('SPEAK')) return message.channel.send("I need your PERMISSION to *Speak* in voice channel, Sir. [Don't have the correct permission.]");

    const server_queue = queue.get(message.guild.id);

    let current_song = "Null";
    
    if ((cmd === 'play') || (cmd === 'p') ){
      
      if(!voiceChannel) return message.channel.send('Get your ass into the voice channel! How am I supposed to know where to play all those wacky & cool contents for you. [User not found in voice channel.]');

      if(!args.length) return message.channel.send("Maybe you need to put a link behind the '/play' command so i know what to put ;D [Insert a **Youtube Link** after the '/play ' command.(Don't forget the spacing) ]");
      let song = { title: "Null", url: "Null"};


      if (args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        
        
      	const playlist = await youtube.getPlaylist(args[0]);
      	const videos = await playlist.getVideos();

        var numVideos = 0;
        
      	for (const heyVideo of Object.values(videos)) {
          
          const theVideo = await youtube.getVideoByID(heyVideo.id); 
          await handleVideo(theVideo, message, voiceChannel);
          numVideos +=1;
      	}

        message.channel.send("Total of **" + numVideos + " Videos** from the playlist is added to the queue. [Queued Playlist Videos]");
      
      } else {
        
        if(ytdl.validateURL(args[0])) {
          
          const song_info = await ytdl.getInfo(args[0]);
          song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url}
          
        } else {
          
          const video_finder = async (query) => {
            const videoResult = await ytSearch(query);
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
          }
          console.log(args);
          const video = await video_finder(args.join(' '));
  
          if (video){
            song = {title: video.title, url: video.url} 
          } else {
            message.channel.send("I don't think the search works. [Error finding video.]");
          }
        }
          
        if(!server_queue){
          
          const queue_constructor = {
            voice_channel: voiceChannel,
            text_channel: message.channel,
            connection: null,
            songs: []
          }
  
          queue.set(message.guild.id, queue_constructor);
          queue_constructor.songs.push(song);
  
          try {
            queue_constructor.connection = joinVoiceChannel({
              channelId: voiceChannel.id,
              guildId: message.guild.id,
              adapterCreator: message.guild.voiceAdapterCreator
            });
  
            //console.log(queue_constructor.songs);
            await video_player(message.guild, queue_constructor.songs.shift());
            
            player.on(AudioPlayerStatus.Idle, () => {
              //console.log('----------------------');
              //console.log(queue_constructor.songs);
              //console.log(queue_constructor.songs.shift());
              video_player(message.guild, queue_constructor.songs.shift());
            });
    
          } catch (err) {
            queue.delete(message.guild.id);
            message.channel.send('There was an error connecting!');
            throw err;
          }
        } else {
          server_queue.songs.push(song);
          return message.channel.send("**"+ song.title +"** is added to the song queue, ya better be patient for it.");
        }  
      }
    } else if(cmd === 'skip'){
      if(voiceChannel){ 
        console.log('Bot skipped!');
        skip_song(message, server_queue);
      } else {
        console.log('Cannot skip.');
      }
    } else if(cmd === 'clear'){
      console.log('Redirect to clear');
      if(voiceChannel){ 
        console.log('Playlist cleared!');
        clear_playlist(message, server_queue);
      } else {
        console.log('Cannot clear.');
      }
    } if (cmd === 'stop'){
      if(voiceChannel){
        console.log('Bot stopped!');
        stop_song(message, server_queue);
      } else {
        console.log('Cannot stop.');
      }
    } if (cmd === 'queue'){
      if(voiceChannel){
        console.log('Show queue!');
        show_queue(message, server_queue);
      } else {
        console.log('Cannot show queue.');
      }
    } if (cmd === 'np'){
      if(voiceChannel){
        console.log('Show currently playing!');
        now_playing(message, current_song);
      } else {
        console.log('Cannot show current song.');
      }
    }
  }
}

const video_player = async (guild, song) => {
  const song_queue = queue.get(guild.id);

  //console.log('check this out');
  //console.log(song);
  
  if(!song){
    //console.log('no more song');
    //console.log(song);
    song_queue.text_channel.send('Playlist Ended.');
    await song_queue.connection.destroy();
    queue.delete(guild.id);
    return;
  }
  
  const stream = ytdl(song.url, {filter: 'audioonly'});

  //const player = createAudioPlayer();

  song_queue.connection.subscribe(player)
  
  const resource = createAudioResource(stream, { inlineVolume: true})
  player.setMaxListeners(0)
  player.play(resource)

  current_song = song.title;
  
  await song_queue.text_channel.send('Now Playing **' + song.title + '**');
}

//PLAY VIDEO
async function handleVideo(theVideo, message, voiceChannel){
  const server_queue = queue.get(message.guild.id);
  var theVideoID = theVideo.id;
          
  const playlistVideo = {
    id: theVideoID,
    //title: escapeMarkdown(theVideo.title),
    title: theVideo.title,
    url: 'https://www.youtube.com/watch?v=' + theVideoID
  };
    
  if(!server_queue){
    //console.log("beep beep")
    const queue_constructor = {
      voice_channel: voiceChannel,
      text_channel: message.channel,
      connection: null,
      songs: []
    }

    queue.set(message.guild.id, queue_constructor);
    //console.log(playlistVideo + " should be added, 1")
    queue_constructor.songs.push(playlistVideo);

    try {
      //console.log("boop boop")
      queue_constructor.connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      });

      //console.log(queue_constructor.songs);
      await video_player(message.guild, queue_constructor.songs.shift());
      
      player.on(AudioPlayerStatus.Idle, () => {
        //console.log('----------------------');
        //console.log(queue_constructor.songs);
        //console.log(queue_constructor.songs.shift());
        video_player(message.guild, queue_constructor.songs.shift());
      });
      //console.log("baap baap")

    } catch (err) {
      queue.delete(message.guild.id);
      message.channel.send('There was an error connecting!');
      throw err;
    }

    //console.log("settled here");
  } else {
    //console.log(playlistVideo + " should be added, 2")
    server_queue.songs.push(playlistVideo);
    //return message.channel.send("**"+ playlistVideo.title +"** is added to the song queue, ya better be patient for it.");
    return undefined;
  } 
  return undefined;
}


//SKIP CURRENT SONG
const skip_song = async (message, server_queue) => {
  if(!message.member.voice.channel) return message.channel.send("I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]");

  if(!server_queue) return message.channel.send("Err...Are you trying to skip something that doesn't exist? [No song in song queue currently.]");

  message.channel.send("Skipped. Skipped. Skipped. [Song Skipped.]");
  player.stop();
  await video_player(message.guild, server_queue.songs.shift());
}

//CLEAR PLAYLIST
const clear_playlist = async (message, server_queue) => {
  if(!message.member.voice.channel) return message.channel.send("I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]");

  if(!server_queue) return message.channel.send("It's cleared. Wait...the playlist was already empty at the beginning. [No song in song queue currently.]");

  message.channel.send("Everything that can be clear is cleared. [Playlist Cleared.]");
  server_queue.songs = [];
  //await video_player(message.guild, server_queue.songs.shift());
}

//STOP QIHUAHUA BOT
const stop_song = async (message, server_queue) => {
  if(!message.member.voice.channel) return message.channel.send("I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]");
  
  message.channel.send("Ciao! [Force Stopped.]");
  await server_queue.connection.destroy();
  return server_queue = null;
}

//SHOW QUEUE
const show_queue = async (message, server_queue) => {
  if(!message.member.voice.channel) return message.channel.send("I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]");

  if(!server_queue) return message.channel.send("There was nothing at all. [No song in song queue currently.]");

  //message.channel.send("[Current Queue] :-");
  //console.log(server_queue.songs.length);
  var song_queue_list = "";
  
  let i = 1;

  //Show all song in list, by iterating
  for (let listed_song of server_queue.songs) {
    song_queue_list =  song_queue_list + i + ". **" + listed_song.title + "** \n";
    
    i++;
    if ((i > 15) || (i > server_queue.songs.length)){
      message.channel.send("[Current Queue] :- \n " + song_queue_list);
      break;
    }
  }
  
  //return server_queue = null;
}

//SHOW CURRENT SONG
const now_playing = async (message, current_song) => {
  if(!message.member.voice.channel) return message.channel.send("I don't see you anywhere, so I'm just gonna ignore you. [You have to be in a voice channel.]");

  if(current_song.title == "Null") return message.channel.send("You probably deafen. [No song playing currently.]");
  
  message.channel.send("Currently Playing:- **" + current_song + "**");
}