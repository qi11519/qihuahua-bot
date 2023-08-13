const fs = require('fs');

module.exports = (client, Discord, commands) =>{
  
  const load_dir = (dirs) =>{ 

    var file_place1 = './events/' + dirs;
    
    const event_files = fs.readdirSync(file_place1).filter(file => file.endsWith('.js'));
    
    for(const file of event_files){
      var file_place2 = '../events/' + dirs + '/' + file; 
      //console.log(file_place2);
      const event = require(file_place2);
      const event_name = file.split('.')[0];
      
      //console.log(event_name);
      
      /*if (event_name === 'interaction') {
        client.on(event_name, (...args) => event(client, Discord, ...args));
      } else {
        client.on(event_name, event.bind(null, client, Discord));
      }

      if (event_name === 'interactionCreate') {
        client.on(event_name, interaction => event(client, Discord, interaction, ...args));
      } else {
        client.on(event_name, event.bind(null, client, Discord));
      }
      */

     client.on(event_name, event.bind(null, client, Discord));
    }
  }
  //['client','guild'].forEach(e => load_dir(e));
  ['client','guild'].forEach(e => load_dir(e));
  
}