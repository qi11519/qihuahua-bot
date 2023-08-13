//const { MessageActionRow, MessageButton, Interaction } = require('discord.js');

const fightingList = [];

module.exports = {
  name: 'challenge',

  aliases: ['ch', "challenge", "clearduel"],

  description: "Point the person you don't like, let's start a real man fight.",

  async execute(message, args, cmd, client) {
    
    if ((cmd === 'ch') || (cmd === 'challenge')) {
      
      if (args[0] != "accept" && args[0] != "getlost"){
        
        if (args[0].startsWith("<@")){
        
          const challenger = "<@" + message.author.id + ">";
          const challenged = args[0];
          
          message.channel.send(`Watch out! ${challenger} is challenging ${challenged} for a fight!!!\n${args[0]}, if you want to accept the challenge, type:\n"/challenge accept <@${message.author.id}>"\nOr Declining:\n/challenge getlost <@${message.author.id}>"`);
  
          const match = [challenger, challenged];
          fightingList.push(match);
  
          console.log(fightingList);
        
        } else {
          message.channel.send(`Ping some real people to the fight, unless you haven't seen one in a while.`);
        }
      } else {

        //console.log(args[1]);
        if (args[1].startsWith("<@")){
        
          const challenger = args[1];
          const challenged = "<@" + message.author.id + ">";
          
          if (args[0] == "accept"){
            //do something
            
            let i = 0;
            let found = 0;
    
            while (i < fightingList.length) {
                if (fightingList[i][0] == challenger && fightingList[i][1] == challenged){
                  found = 1;
                  fightingList.splice(i,1);
                } else {
                  i++;  
                }
            }

            if (found == 0){
              message.channel.send(`Bruh nobody ever challenge you, never ever.`);
            } else {
              message.channel.send(`Seems like we will have a fight going on between ${challenger} and ${challenged} now! \nStarting in 5 seconds...`);
              
              setTimeout(async () => {
                await fightGame(message, challenger, challenged, client);
              }, 5000);
              
            }
            
            console.log(fightingList);
            
          } else if (args[0] == "getlost"){
            const challenger = args[1];
            const challenged = "<@" + message.author.id + ">";
            
            let i = 0;
            let found = 0;
    
            while (i < fightingList.length) {
                if (fightingList[i][0] == challenger && fightingList[i][1] == challenged){
                  found = 1;
                  fightingList[i].splice(i,1);
                } else {
                  i++;  
                }
            }

            if (found == 0){
              message.channel.send(`Bruh nobody ever challenge you, never ever.`);
            } else {
              message.channel.send(`Sadly, Our Dear ${challenged} has shamelessly turned down the challenge request from ${challenger}...`);
            }
            console.log(fightingList);
          }
        }  else {
          message.channel.send(`Ping some real people to the fight, unless you haven't seen one in a while.`);
        }
      }
    } else if (cmd === 'clearduel'){
      while (fightingList.length > 0) {
        fightingList.pop();
      }
    }
  }
}

const fightGame = async (message, challenger, challenged, client) => {
  let challengerHP = 25;
  let challengerStatus = ["Stunned", "Poisoned"];
  let challengedHP = 25;
  let challengedStatus = ["Bleed"];

  const msgCH1HP = await message.channel.send(
    `Challenger ${challenger} \tHP: ${challengerHP} \tStatus: [ ${challengerStatus} ]`
  );
    
  const msgCH2HP = await message.channel.send(
    `Challenged ${challenged} \tHP: ${challengedHP} \tStatus: [ ${challengedStatus} ]`
  );

  //setTimeout(async () => { msgHP.edit(msgHP.content + "\nHello");}, 5000);

  //fightStart
  
  const msgAction = await message.channel.send(`Do something`);

  setTimeout(async () => { msgAction.edit(msgAction.content + "\nDo more thing");}, 5000);

  message.channel.send("Fight ended.")
}

const fightStart = async (message, challenger, challengerHP, challengerStatus, challenged, challengedHP, challengedStatus, msgCH1HP, msgCH2HP, client) => {

  let round = 1;
  
  while (challengerHP > 0 && challenged > 0){
    
  }
}