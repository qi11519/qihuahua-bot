require('dotenv').config();
//const Discord = require("discord.js")

module.exports = (client, Discord, message, interaction) => {
  const PREFIX = process.env.PREFIX;
  //console.log("t2est");
  //console.log(message.startsWith(PREFIX));

  //console.log(message.content.includes("rps"));

  //let args = null;
  //let cmd = null;
  /*
  if (message.content.includes("rps")){

    console.log("tchecking");
    
    if (!interaction || !interaction.isCommand() || interaction.user.bot) return;

    console.log("not skip");
    
    args = interaction.options._hoistedOptions.map(o => o.value);

    cmd = interaction.commandName;
    
  } else {*/
    if(!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).split(/ +/);

    const cmd = args.shift().toLowerCase();
  //}

  const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

  if(command && cmd != "rps"){ 
    command.execute(message, args, cmd, client);
  } else {
    console.log("it is rps");
    //command.execute(interaction, args, cmd, client);
  }
}
  
  
