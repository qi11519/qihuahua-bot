const fs = require('fs');

module.exports = (client, Discord, commands) =>{
  const command_files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

  for(const file of command_files){

    var file_path = '../commands/' + file;
    
    const command = require(file_path);

    if(command.name){
      client.commands.set(command.name, command);
      commands.push(command);
    } else {
      continue;
    }
  }
}