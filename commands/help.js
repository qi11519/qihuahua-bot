module.exports = {
  name: 'help',
  aliases: ['help'],
  description: 'They need help.',
  execute(message, args) {

    message.channel.send("[ Qihuahua Bot Command List ]\n Prefix: / \n- help : Get the list of available commands for Qihuahua Bot \n- play (p) [Video Link/Video Name] : Play a music based on youtube link/name \n- skip : Skip a song that is currently playing. \n- clear : Clear the current song queue.(Not stopping current song)\n- stop : Stop the song immediately, clear song queue, then disconnect Qihuahua Bot \n- queue : Show the current song queue.(Max View: 15 songs) \n- np : Show the current playing song.");
  }
}