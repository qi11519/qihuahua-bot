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

  let challengerObj = { name: challenger, hp: 20, status:["Stunned", "Poisoned"]};
  let challengedObj = { name: challenged, hp: 20, status:["Bleed"]};

  /*
  let challengerHP = 25;
  let challengerStatus = ["Stunned", "Poisoned"];
  let challengedHP = 25;
  let challengedStatus = ["Bleed"];
  */
  const msgStartGame = await message.channel.send(`DING DING DING!!! FIGHT STARTED`);

  await message.channel.send(`--------------------Player Stat--------------------`);
  
  const msgCH1HP = await message.channel.send(
    `Challenger ${challengerObj.name} \tHP: ${challengerObj.hp}/20 \tStatus: [ ${challengerObj.status} ]`
  );
    
  const msgCH2HP = await message.channel.send(
    `Challenged ${challengedObj.name} \tHP: ${challengedObj.hp}/20 \tStatus: [ ${challengedObj.status} ]`
  );

  let decideOrder = getRandomInt(2);
  let firstHandMessage;

  if (decideOrder == 0){
    firstHandMessage = `Challenger ${challengerObj.name} goes first~`;
  } else if (decideOrder == 1){
    firstHandMessage = `Challenged ${challengedObj.name} goes first~`;
  }
  const msgGame = await message.channel.send(`--------------------FIGHT START--------------------\n${firstHandMessage}`);
  //msgGame = await msgGame.edit(`${msgGame.content}\n${firstHandMessage}`);
  
  setTimeout(async () => { await fightStart(message, challengerObj, challengedObj, msgCH1HP, msgCH2HP, msgGame, decideOrder, client);}, 2000);

}

//const fightStart = async (message, challenger, challengerHP, challengerStatus, challenged, challengedHP, challengedStatus, msgCH1HP, msgCH2HP, client) => {
const fightStart = async (message, challengerObj, challengedObj, msgCH1HP, msgCH2HP, msgGame, decideOrder, client) => {
  
  let position;
  let unitTarget;
  let round = 1;
  
  while (challengerObj.hp > 0 && challengedObj.hp > 0){

    let decideAction = getRandomInt(10);

    if (decideOrder === 0){
      unitTarget = await { order: decideOrder, first: challengerObj, second: challengedObj, firstHP: msgCH1HP, secondHP: msgCH2HP, msgGame: msgGame};
      decideOrder = 1;
    } else if (decideOrder === 1){
      unitTarget = await { order: decideOrder, first: challengedObj, second: challengerObj, firstHP: msgCH2HP, secondHP: msgCH1HP, msgGame: msgGame};
      decideOrder = 0;
    }

    if (decideAction >= 0 && decideAction < 10){ //0~5(6)
      //ATTACK
      //setTimeout(async () => { await Attack(message, unitTarget, round);}, 1000);
      await Attack(message, unitTarget, round);
      
    }/* else if (decideAction > 5 && decideAction < 7){ //6
      //POISON or BLEED

      
    } else if (decideAction > 6 && decideAction < 8){ //7
      //FLEED

      
    } else if (decideAction > 7 && decideAction < 10){ //8,9
      //HEAL
      
      
    }*/
    
    round +=1;
  }

  let gameEnded = "Fight ended.";
  msgGame = await msgGame.edit(`${msgGame.content}\n${gameEnded}`);
  
  if (unitTarget.first.hp < 0 ){

    position = unitTarget.secondHP.content.split(' ')[0];

    gamneResultMessage = await message.channel.send(
    `The Fight's Winner is the ${position} ${unitTarget.second.name} !!!`);
    
  } else if (unitTarget.second.hp < 0){

    position = unitTarget.firstHP.content.split(' ')[0];

    gamneResultMessage = await message.channel.send(
    `The Fight's Winner is the  ${position} ${unitTarget.first.name} !!!`);
  }
}

function getRandomInt (max) {
  return Math.floor(Math.random() * max);
}

const Attack = async (message, unitTarget, round) => {
  let damageValue = getRandomInt(6);
  let dodgeChance = getRandomInt(6);

  let attackResultMessage;
  
  if (damageValue === 0){ damageValue = 1; }
  
  if (dodgeChance > 0){
    unitTarget.second.hp -= damageValue;

    attackResultMessage = 
    `Round ${round} : ${unitTarget.first.name} has dealt ${damageValue} to ${unitTarget.second.name}!!!`;

    let position = unitTarget.secondHP.content.split(' ')[0];
    
    unitTarget.secondHP = await unitTarget.secondHP.edit(`${position} ${unitTarget.second.name} \tHP: ${unitTarget.second.hp}/25 \tStatus: [ ${unitTarget.second.status} ]`);
    
  } else {
    attackResultMessage = 
    `Round ${round} : ${unitTarget.first.name} performed an attack, but he missed! Pathetic...`;
  }

  unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${attackResultMessage}`);
  
}