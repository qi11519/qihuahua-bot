const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  aliases: ['help'],
  description: 'They need help.',
  execute(message, args) {

    //Generating a embed message for 'Help'
    let help_Embed_Msg = {
      color: 0xFEFF9D,
      title: 'Prefix:-',
      author: {
        name: 'Qihuahua Bot Command List',
        icon_url: 'attachment://qihuahua.jpg',
      },
      fields: [
        { name: '/help', value: 'Get the list of available commands for Qihuahua Bot'},
        { name: '/play (p) [Video Link] :', value: 'Play a music based on youtube link.'},
        { name: '/play (p) [Video Name/Search Term] :', value: 'Search on youtube based on the name/term, return a list of 10 videos.'},
        { name: '/playsearch [Search Result Index(Number)]', value: 'Play/Queue the song located at selected index from the search result.'},
        { name: '/skip', value: 'Skip a song that is currently playing.'},
        { name: '/clear', value: "Clear the current song queue.(It won't stop the current playing song)"},
        { name: '/stop', value: 'Stop the song immediately, clear song queue, then disconnect Qihuahua Bot'},
        { name: '/queue', value: 'Show the current song queue.(Max View: 15 songs)'},
        { name: '/nowplaying (np)', value: 'Show the current playing song.'},
        { name: '/jump [Queued Song Index(Number)]', value: 'Play the song located at selected index in the song queue immediately.'},
        { name: '/skipto [Queued Song Index(Number)]', value: 'Skip the song until selected index in the song queue and play immediately.'},
        { name: '/shuffle', value: 'Shuffle the current song queue.'},
      ],
    };
    
    message.channel.send({ embeds: [help_Embed_Msg], files: ['./images/qihuahua.jpg'] });
  }
}