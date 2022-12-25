const fs = require('fs');

module.exports = (client, Discord) =>{
  const command_files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

  for(const file of command_files){

    var file_place = '../commands/' + file;
    
    const command = require(file_place);

    if(command.name){
      client.commands.set(command.name, command);
    } else {
      continue;
    }
  }
}