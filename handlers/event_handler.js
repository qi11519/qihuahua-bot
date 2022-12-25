const fs = require('fs');

module.exports = (client, Discord) =>{
  const load_dir = (dirs) =>{ 

    var file_place1 = './events/' + dirs;
    
    const event_files = fs.readdirSync(file_place1).filter(file => file.endsWith('.js'));
    
  for(const file of event_files){
    var file_place2 = '../events/' + dirs + '/' + file; 
    //console.log(file_place2);
    const event = require(file_place2);
    const event_name = file.split('.')[0];
    client.on(event_name, event.bind(null, client, Discord));
    }
  }
  
  ['client','guild'].forEach(e => load_dir(e));
  
}