require('dotenv').config();

module.exports = (client, Discord, message) => {
  const PREFIX = process.env.PREFIX;
  //console.log(client);
  //console.log(message.startsWith(PREFIX));
  if(!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).split(/ +/);
  
  const cmd = args.shift().toLowerCase();

  const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
  
  if(command) command.execute(message, args, cmd, client, Discord);
}