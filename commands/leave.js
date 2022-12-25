const ytdl = require('ytdl-core');;
const ytSearch = require('yt-search');

module.exports = {
  name: 'leave',
  description: 'To stop the bot that nobody loves and get the hell out from the voice channel.',
  async execute(message, args) {
    const voiceChannel = message.member.voice.channel;

    if(!voiceChannel) return message.channel.send("Yeah! If you want to get me out, face me in the voice channel, ya'little coward. [User not found in voice channel.]");
    await voiceChannel.leave();
    await message.channel.send("Ok I'm out. [Leaving voice channel.]");
    
  }
}