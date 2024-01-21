//const { MessageActionRow, MessageButton, Interaction } = require('discord.js');

// A list for storing pending challenges/duels 
// that are not being accepted or rejected yet
const fightingList = [];

module.exports = {
  name: 'challenge',

  aliases: ['ch', "challenge", "clearduel"],

  description: "Point the person you don't like, let's start a real man fight.",

  async execute(message, args, cmd, client) {
    /////////////////////////////////////////////////////////////////////////
    // Challenge command
    if ((cmd === 'ch') || (cmd === 'challenge')) {
      // Example of command structure: 
      //      {cmd}         {args[0]}
      // -: /challenge <@${message.author.id}>
      // -: /clearduel
      // OR
      //      {cmd}   {args[0]}     {args[1]}
      // -: /challenge accept <@${message.author.id}>
      // -: /challenge getlost <@${message.author.id}>

      //////////////////////////////////////////////////
      // If the args is not either 'Accepting' or 'Rejecting' challenge
      if (args[0] != "accept" && args[0] != "a" && args[0] != "getlost" && args[0] != "d"){

        ////////////////////////
        // Check if this is a challenge, and theres challenged target mentioned
        if (args[0] && args[0].startsWith("<@")){

          // Get challenger & challenged
          const challenger = "<@" + message.author.id + ">";
          const challenged = args[0];

          const match = [challenger, challenged]; // New match
          let existingMatch = []; // Placeholder for existed match
          let matchChecker = 0; // Existed match checker

          // Check if similar fight with same people involved is already pending
          fightingList.forEach(function(fight){
            // challenger === challenger AND challenged === challenged
            if(fight[0] === match[0] && fight[1] === match[1]){
              matchChecker = 1;
              existingMatch.push(fight[0], fight[1]);
              
            // challenger === challenged AND challenged === challenger
            } else if (fight[0] === match[1] && fight[1] === match[0]){
              matchChecker = 1;
              existingMatch.push(fight[0], fight[1]);
            }
          })

          // If similar match not is found/not exist
          // Hence can add new pending match
          if (matchChecker === 0){

            message.channel.send(`Watch out! ${challenger} is challenging ${challenged} for a fight!!!\n${args[0]}, if you want to accept the challenge, type:\n> /challenge accept <@${message.author.id}>\n> /ch a <@${message.author.id}>\nOr Declining:\n> /challenge getlost <@${message.author.id}>\n> /ch d <@${message.author.id}>`);
            
            fightingList.push(match);

          // If similar match is found
          } else {
            message.channel.send(`I think you should settled your previous fight schedule first, before yall starting a new one.\n[ Existed match ] Challenger: ${existingMatch[0]} , Challenged: ${existingMatch[1]} `);

          }

        ////////////////////////
        // If no challenge target mentioned && args[0] doesnt exist
        } else if(!args[0]) {
          message.channel.send(`Ping some real people to the fight properly, unless you haven't seen one in a while.`);
        } else { // Random command that doesn't exist.
          message.channel.send(`Okay, let me make it clear, THAT'S NOT HOW CHALLENGE COMMAND WORKS! Follow the user manual please :P`);
        }
        
      ////////////////////////////////////////////////
      // If either to accept challenge or reject challenge
      } else {
        //////////////////////
        //Accepting a challenge
        if (args[1] && args[1].startsWith("<@")){

          let gameAnnouceMessage;
          
          // Get challenger & challenged
          const challenger = args[1];
          const challenged = "<@" + message.author.id + ">";

          // Accepting a fight
          if (args[0] == "accept" || args[0] == "a"){

            // Search for the pending fight
            let i = 0;
            let found = 0;

            fightingList.forEach(function(fight){
              if (fight[0] == challenger && fight[1] == challenged){
                  fightingList.splice(i,1);
                  found = 1;
                } else {
                  i++;  
                }
            })

            // If no challenge record
            if (found == 0){
              message.channel.send(`Bruh nobody ever challenge you, never ever. Forever lonely.`);
            
            // If theres one challenge record, start fight
            } else {
              gameAnnouceMessage = await message.channel.send(`Seems like we will have a fight going on between ${challenger} and ${challenged} now! \nStarting in 5 seconds...`);
              
              setTimeout(async () => {
                await fightGame(message, challenger, challenged, gameAnnouceMessage, client);
              }, 5000);
              
            }
          //////////////////////
          // Rejecting a challenge
          } else if (args[0] == "getlost" || args[0] == "d"){
            const challenger = args[1];
            const challenged = "<@" + message.author.id + ">";

            // Search for the pending fight
            let i = 0;
            let found = 0;
            
            fightingList.forEach(function(fight){
              if (fight[0] == challenger && fight[1] == challenged){
                  found = 1;
                  fightingList.splice(i,1);
                } else {
                  i++;  
                }
            })

            // No record of being challenged
            if (found == 0){
              message.channel.send(`Bruh nobody ever challenge you, never ever. Forever lonely.`);
            
            // Rejected response
            } else {
              message.channel.send(`Sadly, Our Dear ${challenged} has shamelessly turned down the challenge request from ${challenger}...`);
            }

          }
        ////////////////////////
        // If no challenger target mentioned && args[1] doesnt exist
        } else if(!args[1]) {
          message.channel.send(`Ping some real people to the fight, unless you haven't seen one in a while.`);
        } else { // Random command that doesn't exist.
          message.channel.send(`Okay, let me make it clear, THAT'S NOT HOW CHALLENGE COMMAND WORKS! Follow the user manual please :P`);
        }
      }
      /////////////////////////////////////////////////////////////////////////
    } else if (cmd === 'clearduel'){
      
      //Removing all pending fights
      while (fightingList.length > 0) {
        fightingList.pop();
      }
      
      message.channel.send(`All pending fights have been cleared. Thanks me later!`);
      
    }
  }
}

///////////////////////////////////////////////////////
// Setup Fight
const fightGame = async (message, challenger, challenged, gameAnnouceMessage, client) => {

  // Setup player object
  let challengerObj = { name: challenger, hp: 10, status:[]};
  let challengedObj = { name: challenged, hp: 10, status:[]};

    gameAnnouceMessage = await gameAnnouceMessage.edit(`${gameAnnouceMessage.content}\nDING DING DING!!! FIGHT STARTED`);
  
    gameAnnouceMessage = await gameAnnouceMessage.edit(`${gameAnnouceMessage.content}\n|>---------------<| PLAYER STAT |>---------------<|`);

  // Stats of Challenger
  const msgCH1HP = await message.channel.send(
    `Challenger ${challengerObj.name} \tHP: ${challengerObj.hp}/10 \tStatus: [ ${challengerObj.status} ]`
  );

  // Stats of Challenged
  const msgCH2HP = await message.channel.send(
    `Challenged ${challengedObj.name} \tHP: ${challengedObj.hp}/10 \tStatus: [ ${challengedObj.status} ]`
  );

  // Decide who start first
  // 0: Challenger, 1: Challenged
  let decideOrder = getRandomInt(2);
  let firstHandMessage;

  if (decideOrder == 0){
    firstHandMessage = `Challenger ${challengerObj.name} goes first~`;
  } else if (decideOrder == 1){
    firstHandMessage = `Challenged ${challengedObj.name} goes first~`;
  }
  
  const msgGame = await message.channel.send(`|>---------------<| FIGHT START |>---------------<|\n${firstHandMessage}`);
  
  setTimeout(async () => { await fightStart(message, challengerObj, challengedObj, msgCH1HP, msgCH2HP, msgGame, decideOrder, client);}, 2000);

}

///////////////////////////////////////////////////////
// Fight Start
const fightStart = async (message, challengerObj, challengedObj, msgCH1HP, msgCH2HP, msgGame, decideOrder, client) => {
  
  let role; // Challenger OR Challenged
  let unitTarget; // Player who do move current round
  let round = 1; // Current round, starting from round 1
  let roundTracker = decideOrder;
  let newRoundMessage, gameResultMessage;
  let gameEnded = "|>---------------<| FIGHT ENDED |>---------------<|";

  //////////////////////////////////////
  // If no one lose yet
  while (challengerObj.hp > 0 && challengedObj.hp > 0){
    
    // Random number to decide which move
    let decideAction = getRandomInt(19);

    ///////////////////////
    // If challenger goes first
    if (decideOrder === 0){
      unitTarget = await { order: decideOrder, first: challengerObj, second: challengedObj, firstHP: msgCH1HP, secondHP: msgCH2HP, msgGame: msgGame};

    ///////////////////////
    // If challenged goes first
    } else if (decideOrder === 1){
      unitTarget = await { order: decideOrder, first: challengedObj, second: challengerObj, firstHP: msgCH2HP, secondHP: msgCH1HP, msgGame: msgGame};

    }
    
    ///////////////////////
    //New Round started
    newRoundMessage = `> Round ${round} :`;
    
    if (roundTracker === decideOrder){ 
      
      unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${newRoundMessage}`);

      ////////////
      // Settle status at start of the round
      await statusSettle(message, unitTarget);

      ///////////////////////
      // Waking up from stunned
      // Each round happened, only if Stunned is -1, then its status is removed
      let playerArray = [unitTarget.first, unitTarget.second];

      await playerArray.forEach(async (player) => {
        let isStunned = player.status.find(status => status.status === "Stunned");

        if (isStunned){
          // Reduce 1 round of stun status
          isStunned.round -= 1;

          // If the status is expired
          if (isStunned.round < 0){
            // Remove the stunned status
            player.status = player.status.filter(status => status.round > -1);

            unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${player.name} has woke up from stunned!`);

          }

        }
      });

    }

    let isStunned = unitTarget.first.status.find(status => status.status === "Stunned");
    
    ///////////////////////
    // Perform action
    // Conduct action based on randomized number
    if (challengerObj.hp > 0 && challengedObj.hp > 0 && !isStunned){
      
      if (decideAction >= 0 && decideAction < 11){ //0~10
        //ATTACK
        await Attack(message, unitTarget, round);
      
      } else if (decideAction > 10 && decideAction < 15){ //11~14
        //POISON or BLEED or STUNNED
        await Special(message, unitTarget, round);
      
      } else if (decideAction > 14 && decideAction < 16){ //15
        //FLEED
        await Flee(message, unitTarget, round);

      } else if (decideAction > 15 && decideAction < 19){ //16~18
        //HEAL
        await Heal(message, unitTarget, round);
        
      }
      
    ///////////////////////
    // If current player is stunned
    } else if (challengerObj.hp > 0 && challengedObj.hp > 0 && isStunned){

      
      
      stunnedMessage = `${unitTarget.first.name} is still being stunned, so he couldn't perform any action this round...`

      unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${stunnedMessage}`);
    }

    ///////////////////////
    //Round done
    if (roundTracker == decideOrder){
      round +=1; // Move to next round
    }

    ///////////////////////
    // Switch turn
    if (decideOrder === 1){
      decideOrder = 0;  // Next round is Challenger
    } else if (decideOrder === 0){
      decideOrder = 1; // Next round is Challenged
    }

    ///////////////////////
    //Annouce winner if one of the player lost
    if (unitTarget.first.hp < 1 ){ // If first player lost (HP to 0)
      unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${gameEnded}`);
      
      role = unitTarget.secondHP.content.split(' ')[0]; // Get first player role
  
      gameResultMessage = await message.channel.send(
        `The Fight's Winner is the ${role} ${unitTarget.second.name} !!!`);
      
    } else if (unitTarget.second.hp < 1){  // Else if second player lost (HP to 0)
      msgGame = await msgGame.edit(`${msgGame.content}\n${gameEnded}`);
      
      role = unitTarget.firstHP.content.split(' ')[0]; // Get second player role
  
      gameResultMessage = await message.channel.send(
        `The Fight's Winner is the ${role} ${unitTarget.first.name} !!!`);
    }
  }
}

///////////////////////////////////////////////////////
//Randomize number
function getRandomInt (max) {
  return Math.floor(Math.random() * max);
}

///////////////////////////////////////////////////////
// Perform Attack
const Attack = async (message, unitTarget, round) => {
  let damageValue = getRandomInt(6); // Randomize attack damage value
  let critChance = getRandomInt(11);
  let parryValue = getRandomInt(8); // If 0 or 7: Parry 50% of damage
  let dodgeChance = getRandomInt(9); // If 0: Evade damage entirely
  let attackResultMessage;
  
  if (damageValue === 0){ damageValue = 1; } // Minimum attack damage

  let i = 0;
  let barrierExist = unitTarget.second.status.find(status => status.status === "Barrier");

  //////////////////////////////////////
  // No dodge
  if (dodgeChance > 0){

    ////////////////////////
    //If has 'Barrier' buff
    if (barrierExist) {
      
      // Remove barrier
      unitTarget.second.status = unitTarget.second.status.filter(status => status.status != "Barrier");
      
      attackResultMessage =
        `${unitTarget.first.name} tried to strike ${unitTarget.second.name}, but was blocked. Poof! Barrier's gone.`;

    ////////////////////////
    // If parry
    } else if (parryValue == 0 || parryValue == 7 && !barrierExist){ //If parry

      // If critical
      if(critChance === 10) {
        unitTarget.second.hp -= damageValue; // Cirt Damage is halved
  
        attackResultMessage = 
          `${unitTarget.first.name} landed a critical strike on ${unitTarget.second.name}, but luckily ${unitTarget.second.name} parried 50% of the attack, taking only ${Math.round(damageValue)} damage!`;

      // If no critical
      } else {

        unitTarget.second.hp -= Math.round(damageValue/2); // Damage is halved

        attackResultMessage = 
          `${unitTarget.first.name} attacked ${unitTarget.second.name}, but ${unitTarget.second.name} parried 50% of the attack skillfully, and took only ${Math.round(damageValue/2)} damage!`;
      }
    ////////////////////////
    // If no parry
    } else {

      // If critical
      if(critChance === 10) {
        unitTarget.second.hp -= damageValue*2; // Normal Damage
  
        attackResultMessage = 
          `${unitTarget.first.name} landed a perfect critical strike on ${unitTarget.second.name}, dealing ${damageValue*2} damage! Unbelieveable!!!`;

      // If no critical
      } else {
        unitTarget.second.hp -= damageValue; // Normal Damage

        attackResultMessage = 
          `${unitTarget.first.name} has dealt ${damageValue} to ${unitTarget.second.name}!`;
      }
        
    }

  //////////////////////////////////////
  // If dodged
  } else {
    attackResultMessage = 
      `${unitTarget.first.name} performed an attack, but he missed! Pathetic...`;
  }

  let role = unitTarget.secondHP.content.split(' ')[0]; //Get target player role
  
  // Update status
  let statusString = ``
  unitTarget.second.status.forEach(status => {
    statusString += `{${status.status}: ${status.round} Round(s)} `
  });
  unitTarget.secondHP = await unitTarget.secondHP.edit(`${role} ${unitTarget.second.name} \tHP: ${unitTarget.second.hp}/10 \tStatus: [ ${statusString} ]`);

  unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${attackResultMessage}`);

}

///////////////////////////////////////////////////////
// Perform Special
const Special = async (message, unitTarget, round) => {
  //let status = { status: '', round: 0 }; // Status object

  let method = getRandomInt(5); // Deciding which specil action
  let methodChance = getRandomInt(7); // Decide success or fail
  let methodResultMessage;
  
  switch(method){
    //////////////////////////////////////
    // Poison
    case 0:
    case 2:
      if (methodChance < 4){ // Success

        //Check if there is existing poison buff to the enemy
        const hasPoisonStatus = unitTarget.second.status.find(status => status.status === "Poisoned");

        if(!hasPoisonStatus) { // If enemy no existing poison buff
          
          // Add poison status to second player
          unitTarget.second.status.push({ status: "Poisoned", round: 4 });

          methodResultMessage = 
            `${unitTarget.first.name} hit ${unitTarget.second.name} with a venomous strike, inflicting 1 poison damage for the next 4 round(s)! How despicable!`;
          
        } else { // Enemy already get poisoned
          
          methodResultMessage = 
            `${unitTarget.first.name} hit ${unitTarget.second.name} with a venomous strike, but ${unitTarget.second.name} is already poisoned!`;
          
        }
        
      } else { // Fail

        methodResultMessage = 
          `${unitTarget.first.name} tried to poison ${unitTarget.second.name}, but failed! I repeat, HE FAILED!`;
        
      }
        
      break
    //////////////////////////////////////
   // Bleed
    case 1:
    case 3:
      if (methodChance < 4){ // Success

        //Check if there is existing bleed buff to the enemy
        const hasBleedStatus = unitTarget.second.status.find(status => status.status === "Bleed");

        if(!hasBleedStatus) { // If enemy has no existing bleed buff

          // Add bleed status to second player
          unitTarget.second.status.push({ status: "Bleed", round: 2 });

          methodResultMessage = 
            `${unitTarget.first.name} hit ${unitTarget.second.name} with a vicious stab, inflicting 2 bleed damage for the next 2 round(s)! Ouch!`;

        } else { // Enemy already bleeding
          
          hasBleedStatus.round += 1; // Increase bleed round by 1
          
          methodResultMessage = 
            `${unitTarget.first.name} has stabbed ${unitTarget.second.name} with a small knife, ${unitTarget.second.name} gets one more round of bleeding!`;

        }

      } else { // Fail

        methodResultMessage = 
          `${unitTarget.first.name} tried to strike ${unitTarget.second.name} to cause him bleed, but failed! Oh dear!`;
      
      }
      
      break
      
    //////////////////////////////////////
    case 4: // Stun
      if (methodChance < 2){ // Success

        //Check if there is existing stun buff to the enemy
        const hasStunStatus = unitTarget.second.status.find(status => status.status === "Stunned");

        if(hasStunStatus) { // If enemy has existing stun buff

          // Increase stun round by 1
          hasStunStatus.round += 1;

          // Deal 2 damage
          unitTarget.second.hp -= 2;

          methodResultMessage = 
            `${unitTarget.first.name} threw a 15kg dumbell at ${unitTarget.second.name} who was still stunned, dealing 2 damage and increase 1 mor round of stun!`;

        } else { // If enemy has no existing stun buff

          // Add stun status to second player
          unitTarget.second.status.push({ status: "Stunned", round: 1 });

          // Deal 1 damage
          unitTarget.second.hp -= 1;

          methodResultMessage = 
            `${unitTarget.first.name} hit ${unitTarget.second.name} with a stunning blow, dealing 1 damage and stunning ${unitTarget.second.name} for 1 round!`;

        }

      } else { // Fail

        // Deal 1 damage to himself
        unitTarget.first.hp -= 1;

        methodResultMessage = 
          `${unitTarget.first.name} swung a heavy hammer at ${unitTarget.second.name}, but missed and hit his own toe, dealing 1 damage to himself! Be careful~`;

      }
      
      break

    //////////////////////////////////////
    case 5: // Confuse
      if (methodChance < 2){
      
      } else {
        // Pending
      }
      break
    //////////////////////////////////////
    default:
      break  
  }

  let role = unitTarget.secondHP.content.split(' ')[0]; // Get target player role

  // Update status
  let statusString = ``
  unitTarget.second.status.forEach(status => {
    statusString += `{${status.status}: ${status.round} Round(s)} `
  });
  
  unitTarget.secondHP = await unitTarget.secondHP.edit(`${role} ${unitTarget.second.name} \tHP: ${unitTarget.second.hp}/10 \tStatus: [ ${statusString} ]`);

  unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${methodResultMessage}`);
  
}

///////////////////////////////////////////////////////
// Perform Escape
const Flee = async (message, unitTarget, round) => {
  let escapeChance = getRandomInt(2); // If 0: Escape Failed, 1: Escape Success
  let escapeResultMessage;

  //////////////////////////////////////
  if (escapeChance === 0){ // If escape failed
    escapeResultMessage = 
      `${unitTarget.first.name} tried to escape, but failed! Guess there's no way out...`;

  //////////////////////////////////////
  } else if(escapeChance === 1){ // If escape success

    unitTarget.first.hp = 0; // Escape = Suicide
    
    escapeResultMessage = 
      `${unitTarget.first.name} has shamelessly ran away!!! [ HP Reduced to 0 ]`;
  }

  let role = unitTarget.firstHP.content.split(' ')[0]; // Get current player role

  // Update status
  let statusString = ``
  unitTarget.first.status.forEach(status => {
    statusString += `{${status.status}: ${status.round} Round(s)} `
  });
  unitTarget.firstHP = await unitTarget.firstHP.edit(`${role} ${unitTarget.first.name} \tHP: ${unitTarget.first.hp}/10 \tStatus: [ ${statusString} ]`);

  unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${escapeResultMessage}`);
}

//////////////////////////////////// just ///////////////////
// Performing Heal
const Heal = async (message, unitTarget, round) => {
  let healValue = getRandomInt(3); // Random heal value
  
  // If 0~2: Failed, 
  // 12~14: Purify,
  // 15: 2x Heal, 
  // 17~19: Barrier,
  // Other: Normal Heal,
  let critChance = getRandomInt(20);
  let healResultMessage;

  if (healValue === 0){ healValue = 1; } // Minimum heal value

  ///////////////////////////
  // Critical Heal
  if (critChance == 16){
    unitTarget.first.hp += healValue*2; // Heal

    healResultMessage = 
      `${unitTarget.first.name} made a critical heal on himself, and restored ${healValue*2} HP!!!`;
    
  ///////////////////////////
  // Failed Heal
  } else if(critChance >= 0 && critChance < 3) {
    unitTarget.first.hp -= 1; // Fail heal, damage himself 1HP

    healResultMessage = 
      `${unitTarget.first.name} performed a healing magic, but he failed! Resulting 1 damage to himself... How incompetent~`;

  ///////////////////////////
  // Barrier Magic
  } else if(critChance < 20 && critChance > 16) {

    // Add barrier status
    unitTarget.first.status.push({ status: "Barrier", round: 2 });

    healResultMessage = 
      `${unitTarget.first.name} casted barrier magic that lasts 2 rounds and blocks normal attack once!`;

  ///////////////////////////
  // Purify Magic
  } else if(critChance < 15 && critChance > 11) {

    // Clear all the negative status status
    unitTarget.first.status = unitTarget.first.status.filter(status => status.status !== "Poisoned" && status.status !== "Bleed");

    healResultMessage = 
      `${unitTarget.first.name} casted purify magic, cleansing most negative statuses on himself.`;
    
  ///////////////////////////
  // Normal Heal
  } else {
    unitTarget.first.hp += healValue; // Heal

    healResultMessage = 
      `${unitTarget.first.name} casted healing magic, restoring ${healValue} HP!`;

  }

  let role = unitTarget.firstHP.content.split(' ')[0]; // Get current player role

  // Update status
  let statusString = ``
  unitTarget.first.status.forEach(status => {
    statusString += `{${status.status}: ${status.round} Round(s)} `
  });
  unitTarget.first = await unitTarget.firstHP.edit(`${role} ${unitTarget.first.name} \tHP: ${unitTarget.first.hp}/10 \tStatus: [ ${statusString} ]`);

  unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${healResultMessage}`);
}

///////////////////////////////////////////////////////
// Settle status from all players at every starting of the round
const statusSettle = async (message, unitTarget) => {
  const statusArrays = [unitTarget.first, unitTarget.second];
  let statusUpdate = ``;

  
  for (const statusTarget of statusArrays) { // All player
    for (const status of statusTarget.status) { // All status
      
      // Decrease the duration of each status by 1 round
      if (status.status != "Stunned" && status.status != 'Confused'){
        status.round--;
      }

      //////////////////////////////////////
      // Check if the status has a corresponding damaging effect
      switch (status.status) {

        ////////////////////////////
        case 'Poisoned': //Poisoned
          statusTarget.hp -= 1; // Take damage
          statusUpdate = `${statusTarget.name} takes 1 damage from poison!`;

          break;

        ////////////////////////////
        case 'Bleed': //Bleed
          statusTarget.hp -= 2; // Take damage
          statusUpdate = `${statusTarget.name} takes 2 damage from bleeding!`;
          
          break;

        ////////////////////////////
        // case 'Stunned': //Stunned
        //   if (status.round > -1){
        //       statusUpdate = `${statusTarget.name} is still being stunned... Still sleeping...`;
        //   }
          
        //   break;
          
      }

      //////////////////////////////////////
      if (status.round === 0 && status.status != 'Stunned' && status.status != 'Barrier') { // If the status has expired
        statusUpdate += ` The ${status.status} status has worn off.`;
      } else if (status.round === 0 && status.status == 'Barrier') {
        statusUpdate += ` The ${status.status} status on ${statusTarget.name} has worn off.`;
      }
      
    }

    // Remove the expired status from all player
    statusTarget.status = statusTarget.status.filter(status => status.round > 0 || status.status == 'Stunned');
    
  }

  // Update status
  let statusStringP1 = ``
    unitTarget.first.status.forEach(status => {
      statusStringP1 += `{${status.status}: ${status.round} Round(s)} `
  });
  let statusStringP2 = ``
    unitTarget.second.status.forEach(status => {
      statusStringP2 += `{${status.status}: ${status.round} Round(s)} `
  });

  let roleP1 = unitTarget.firstHP.content.split(' ')[0]; // Get first player role
  let roleP2 = unitTarget.secondHP.content.split(' ')[0]; // Get first player role
  
  unitTarget.firstHP = await unitTarget.firstHP.edit(`${roleP1} ${unitTarget.first.name} \tHP: ${unitTarget.first.hp}/10 \tStatus: [ ${statusStringP1} ]`);
  
  unitTarget.secondHP = await unitTarget.secondHP.edit(`${roleP2} ${unitTarget.second.name} \tHP: ${unitTarget.second.hp}/10 \tStatus: [ ${statusStringP2} ]`);

  unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${statusUpdate}`);
  
}