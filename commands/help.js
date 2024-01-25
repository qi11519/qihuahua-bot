const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',

  aliases: ['help', 'h'],

  description: 'They need help.',

  execute(message, args) {

    ///////////////////////////////////////
    // General 'Help' embed message
    let help_Embed_Msg = {
      color: 0xFEFF9D,
      title: 'Prefix:-',
      author: {
        name: 'Qihuahua Bot General Command & Feature(s) List',
        icon_url: 'attachment://qihuahua.jpg',
      },
      fields: [
        { name: '/help', value: 'Get the list of available command/feature(s) for Qihuahua Bot' },
        { name: '/help music', value: 'Display the command for *Music Player*' },
        { name: '/help pvp', value: 'Display the command for PVP *Fighting Mini-Game*' },
      ],
    };

    ///////////////////////////////////////
    //'Help' embed message for Music Player
    let music_Embed_Msg = {
      color: 0xFEFF9D,
      title: 'Prefix:-',
      author: {
        name: 'Qihuahua Bot Command List for Music Player',
        icon_url: 'attachment://qihuahua.jpg',
      },
      fields: [
        { name: '/play (p) [Video Link (Youtube Only)]', value: 'Play a music based on youtube link.' },
        { name: '/play (p) [Video Name/Search Term]', value: 'Search on Youtube based on the name/term, return a list of 10 videos.' },
        { name: '/playsearch [Search Result Index(Number)]', value: 'Play/Queue the song located at selected index from the search result.' },
        { name: '/skip', value: 'Skip a song that is currently playing.' },
        { name: '/clear', value: "Clear the current song queue.(It won't stop the current playing song)" },
        { name: '/stop', value: 'Stop the song immediately, clear song queue, then disconnect Qihuahua Bot' },
        { name: '/queue', value: 'Show the current song queue.(Max View: 15 songs)' },
        { name: '/nowplaying (np)', value: 'Show the current playing song.' },
        { name: '/jump [Queued Song Index(Number)]', value: 'Play the song located at selected index in the song queue immediately.' },
        { name: '/skipto [Queued Song Index(Number)]', value: 'Skip the song until selected index in the song queue and play immediately.' },
        { name: '/shuffle', value: 'Shuffle the current song queue.' },
      ],
    };

    ///////////////////////////////////////
    //'Help' embed message for PVP Fighting Mini-game
    let pvp_Embed_Msg = {
      color: 0xFEFF9D,
      title: 'Prefix:-',
      author: {
        name: 'Qihuahua Bot Command List for PVP Fighting Mini-Game',
        icon_url: 'attachment://qihuahua.jpg',
      },
      fields: [
        { name: '/challenge (ch) [@<Tag ID>]', value: 'Challenge someone.' },
        { name: '/challenge accept (ch a) [@<Tag ID>]', value: 'Accept challenge from someone.' },
        { name: '/challenge decline (ch d) [@<Tag ID>]', value: 'Decline challenge from someone.' },
        { name: '/pvplist', value: 'Display all pending/existing challenges' },
        { name: '/clearfight (cf)', value: 'Clear all pending/existing challenges.' },
      ],
    };

    if (!args[0]) {
      message.channel.send({ embeds: [help_Embed_Msg], files: ['./images/qihuahua.jpg'] });
    } else if (args[0] === 'music') {
      message.channel.send({ embeds: [music_Embed_Msg], files: ['./images/qihuahua.jpg'] });
    } else if (args[0] === 'pvp') {
      message.channel.send({ embeds: [pvp_Embed_Msg], files: ['./images/qihuahua.jpg'] });
    } else {
      message.channel.send("The feature doesn't exist. Please try '/help' to get the list of available commands for Qihuahua Bot");;
    }

  }
}