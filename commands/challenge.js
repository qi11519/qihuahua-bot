//const { MessageActionRow, MessageButton, Interaction } = require('discord.js');

const { setTimeout } = require("timers");

// A list for storing pending challenges/duels 
// that are not being accepted or rejected yet
const fightingList = [];

module.exports = {
  name: 'challenge',

  aliases: ["ch", "challenge", "clearfight", "cf", "pvplist"],

  description: "Point the person you don't like, let's start a real man fight.",

  async execute(message, args, cmd, client) {
    /////////////////////////////////////////////////////////////////////////
    // Challenge command
    if ((cmd === 'ch') || (cmd === 'challenge')) {
      // Example of command structure: 
      //      {cmd}         {args[0]}
      // -: /challenge <@${message.author.id}>
      // -: /pvplist
      // -: /clearfight
      // OR
      //      {cmd}   {args[0]}     {args[1]}
      // -: /challenge accept <@${message.author.id}>
      // -: /challenge decline <@${message.author.id}>

      //////////////////////////////////////////////////
      // If the args is not either 'Accepting' or 'Rejecting' challenge
      if (args[0] != "accept" && args[0] != "a" && args[0] != "decline" && args[0] != "d") {

        ////////////////////////
        // Check if this is a challenge, and theres challenged target mentioned
        if (args[0] && args[0].startsWith("<@")) {

          // Get challenger & challenged
          const challenger = "<@" + message.author.id + ">";
          const challenged = args[0];

          const match = [challenger, challenged]; // New match
          let existingMatch = []; // Placeholder for existed match
          let matchChecker = 0; // Existed match checker

          // Check if similar fight with same people involved is already pending
          fightingList.forEach(function(fight) {
            // challenger === challenger AND challenged === challenged
            if (fight[0] === match[0] && fight[1] === match[1]) {
              matchChecker = 1;
              existingMatch.push(fight[0], fight[1]);

              // challenger === challenged AND challenged === challenger
            } else if (fight[0] === match[1] && fight[1] === match[0]) {
              matchChecker = 1;
              existingMatch.push(fight[0], fight[1]);
            }
          })

          // If similar match not is found/not exist
          // Hence can add new pending match
          if (matchChecker === 0) {

            if (challenger === challenged) {

              message.channel.send(`Watch out! ${challenger} is challenging...wait a minute...challenging himself? Anyway.....\n${args[0]}, if you want to accept the challenge, type:\n> /challenge accept <@${message.author.id}>\n> /ch a <@${message.author.id}>\nOr Declining:\n> /challenge decline <@${message.author.id}>\n> /ch d <@${message.author.id}>`);
              
            } else {
            
              message.channel.send(`Watch out! ${challenger} is challenging ${challenged} for a fight!!!\n${args[0]}, if you want to accept the challenge, type:\n> /challenge accept <@${message.author.id}>\n> /ch a <@${message.author.id}>\nOr Declining:\n> /challenge decline <@${message.author.id}>\n> /ch d <@${message.author.id}>`);
            
            }
            fightingList.push(match);

            // If similar match is found
          } else {
            message.channel.send(`I think you should settled your previous fight schedule first, before yall starting a new one.\n[ Existed match ] Challenger: ${existingMatch[0]} , Challenged: ${existingMatch[1]} `);

          }

          ////////////////////////
          // If no challenge target mentioned && args[0] doesnt exist
        } else if (!args[0]) {
          message.channel.send(`Ping some real people to the fight properly, unless you haven't seen one in a while.`);
        } else { // Random command that doesn't exist.
          message.channel.send(`Okay, let me make it clear, THAT'S NOT HOW CHALLENGE COMMAND WORKS! Follow the user manual please :P`);
        }

        ////////////////////////////////////////////////
        // If either to accept challenge or reject challenge or removing a challenge
      } else {
        //////////////////////
        //Accepting a challenge
        if (args[1] && args[1].startsWith("<@")) {

          let gameAnnouceMessage; // Channel Message Itself
          let gameAnnouceMessageTemplate; // Message String

          // Get challenger & challenged
          const challenger = args[1];
          const challenged = "<@" + message.author.id + ">";

          // Accepting a fight
          if (args[0] == "accept" || args[0] == "a") {

            // Search for the pending fight
            let i = 0;
            let found = 0;

            fightingList.forEach(function(fight) {
              if (fight[0] == challenger && fight[1] == challenged) {
                fightingList.splice(i, 1);
                found = 1;
              } else {
                i++;
              }
            })

            // If no challenge record
            if (found == 0) {
              message.channel.send(`Bruh nobody ever challenge you, never ever. Forever lonely.`);

              // If theres one challenge record, start fight
            } else {
              
              if (challenger === challenged) {
                gameAnnouceMessageTemplate = `:mega: :mega: Okay... ${challenger} is trying to fight himself for some reason... :crossed_swords: :crossed_swords:`
              } else {
                gameAnnouceMessageTemplate = `:mega: :mega: Seems like we will have a fight going on between ${challenger} and ${challenged} now! :crossed_swords: :crossed_swords:`
              }
              
              gameAnnouceMessage = await message.channel.send(gameAnnouceMessageTemplate);

              // Counting down from five
              // Making it as theres clock animation
              let i = 6;
              let iTime = ['12', '10', '8', '6', '4', '2', '12'];
              let iText = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

              // Initial timer, set as 6
              gameAnnouceMessage = await gameAnnouceMessage.edit(`${gameAnnouceMessageTemplate}\n> :clock${iTime[i]}: Starting in :${iText[i]}: seconds...`);
              
              // Trigger per second, last 6 second
              const countingDown = setInterval(async () => {
                i=i-1; // Decrease per second
                
                if(i >= 0){ //If timer not reach 6 sec yet
                  
                  // Display timer in message,
                  // by editing the message from time to time(per second)
                  gameAnnouceMessage = await gameAnnouceMessage.edit(`${gameAnnouceMessageTemplate}\n> :clock${iTime[i]}: Starting in :${iText[i]}: seconds...`);
                  
                }
              }, 1000);

              // Set time out by 6 seconds
              // so count down won't be skipped
              setTimeout(async() =>{

                // Destroy count down interval
                await clearInterval(countingDown);

                // Reset channel message
                gameAnnouceMessage = await gameAnnouceMessage.edit(`${gameAnnouceMessageTemplate}`)

                // Proceed to start fight
                await fightGame(message, challenger, challenged, gameAnnouceMessage, client);
              }, 7000);

            }
            //////////////////////
            // Rejecting a challenge
          } else if (args[0] == "decline" || args[0] == "d") {
            const challenger = args[1];
            const challenged = "<@" + message.author.id + ">";

            // Search for the pending fight
            let i = 0;
            let found = 0;

            fightingList.forEach(function(fight) {
              if (fight[0] == challenger && fight[1] == challenged) {
                found = 1;
                fightingList.splice(i, 1);
              } else {
                i++;
              }
            })

            // No record of being challenged
            if (found == 0) {
              message.channel.send(`Bruh nobody ever challenge you, never ever. Forever lonely.`);

              // Rejected response
            } else {
              if (challenger === challenged){

                message.channel.send(`${challenged} has declined the challenge from himself...I guess no one cares.`);
                
              } else {
              
              message.channel.send(`Sadly, Our Dear ${challenged} has shamelessly turned down the challenge request from ${challenger}...`);
                
              }
            }

          }
          ////////////////////////
          // If no challenger target mentioned && args[1] doesnt exist
        } else if (!args[1]) {
          message.channel.send(`Ping some real people to the fight (you can ping yourself), unless you haven't seen one in a while.`);
        } else { // Random command that doesn't exist.
          message.channel.send(`Okay, let me make it clear, THAT'S NOT HOW CHALLENGE COMMAND WORKS! Follow the user manual (/help pvp) please :P`);
        }
      }
      /////////////////////////////////////////////////////////////////////////
    } else if (cmd === 'clearfight' || cmd === 'cf') {

      //No pending fight
      if (fightingList.length < 1) {

        message.channel.send("There is no pending fight at all.");

      } else { // Has pending fights

        //Removing all pending fights
        while (fightingList.length > 0) {
          fightingList.pop();
        }

        message.channel.send(`All pending fights have been cleared. Thanks me later!`);

      }

    } else if (cmd === 'pvplist') {

      let pvp_array = []; //String holder of fights
      let i = 1;

      // Embed Msg for fight list
      let pvplist_Embed_Msg = {
        color: 0xFEFF9D,
        author: {
          name: 'Current Pending PVP List:-',
          icon_url: 'attachment://qihuahua.jpg',
        },
      };

      //No pending fight
      if (fightingList.length < 1) {

        message.channel.send("There is no pending fight at all.");

      } else { // Has pending fights

        //Get all fights, by iterating
        for (let fight of fightingList) {
          pvp_array.push({ name: i + ". " + fight[0] + " VS. " + fight[1], value: "Challenge from: " + fight[0] });
          i++;
        }

        pvplist_Embed_Msg.fields = pvp_array;

        message.channel.send({ embeds: [pvplist_Embed_Msg], files: ['./images/qihuahua.jpg'] });
      }
    }
  }
}

///////////////////////////////////////////////////////
// Setup Fight
const fightGame = async (message, challenger, challenged, gameAnnouceMessage, client) => {

  // Setup player object
  let challengerObj = { name: challenger, hp: 10, status: [] };
  let challengedObj = { name: challenged, hp: 10, status: [] };

  gameAnnouceMessage = await gameAnnouceMessage.edit(`${gameAnnouceMessage.content}\n:bellhop: :bellhop: :bellhop: FIGHT STARTED :bellhop: :bellhop: :bellhop:`);

  gameAnnouceMessage = await gameAnnouceMessage.edit(`${gameAnnouceMessage.content}\n**|>---------------<| PLAYER STAT |>---------------<|**`);

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

  if (decideOrder == 0) {
    firstHandMessage = `Challenger ${challengerObj.name} goes first~`;
  } else if (decideOrder == 1) {
    firstHandMessage = `Challenged ${challengedObj.name} goes first~`;
  }

  const msgGame = await message.channel.send(`**|>---------------<| FIGHT START |>---------------<|**\n${firstHandMessage}`);

  setTimeout(async () => { await fightStart(message, challengerObj, challengedObj, msgCH1HP, msgCH2HP, msgGame, decideOrder, client); }, 2000);

}

///////////////////////////////////////////////////////
// Fight Start
const fightStart = async (message, challengerObj, challengedObj, msgCH1HP, msgCH2HP, msgGame, decideOrder, client) => {

  let role; // Challenger OR Challenged
  let unitTarget; // Player who do move current round
  let round = 1; // Current round, starting from round 1
  let roundTracker = decideOrder;
  let newRoundMessage, gameResultMessage;
  let gameEnded = "**|>---------------<| FIGHT ENDED |>---------------<|**";

  //////////////////////////////////////
  // If no one lose yet
  while (challengerObj.hp > 0 && challengedObj.hp > 0) {

    // Random number to decide which move
    let decideAction = getRandomInt(25);

    ///////////////////////
    // If challenger goes first
    if (decideOrder === 0) {
      unitTarget = await { order: decideOrder, first: challengerObj, second: challengedObj, firstHP: msgCH1HP, secondHP: msgCH2HP, msgGame: msgGame };

      ///////////////////////
      // If challenged goes first
    } else if (decideOrder === 1) {
      unitTarget = await { order: decideOrder, first: challengedObj, second: challengerObj, firstHP: msgCH2HP, secondHP: msgCH1HP, msgGame: msgGame };

    }

    ///////////////////////
    //New Round started
    newRoundMessage = `> ** Round ${round} **`;

    if (roundTracker === decideOrder) {

      unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${newRoundMessage}`);

      ////////////
      // Settle status at start of the round
      await statusSettle(message, unitTarget);

    }

    let isStunned = unitTarget.first.status.find(status => status.status === "Stunned");

    ///////////////////////
    // Perform action
    // Conduct action based on randomized number
    if (challengerObj.hp > 0 && challengedObj.hp > 0 && !isStunned) {

      if (decideAction >= 0 && decideAction < 14) { // 0~13
        //ATTACK
        await Attack(message, unitTarget, round);

      } else if (decideAction > 13 && decideAction < 21) { // 14~20
        //POISON or BLEED or STUNNED or CONFUSED
        await Special(message, unitTarget, round);

      } else if (decideAction > 20 && decideAction < 22) { // 21
        //FLEED
        await Flee(message, unitTarget, round);

      } else if (decideAction > 21 && decideAction < 25) { // 21~24
        //HEAL
        await Heal(message, unitTarget, round);

      }

      ///////////////////////
      // If current player is stunned
    } else if (challengerObj.hp > 0 && challengedObj.hp > 0 && isStunned) {

      stunnedMessage = `${unitTarget.first.name} is still being stunned, so he couldn't perform any action this round...`

      unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${stunnedMessage}`);
    }

    ///////////////////////
    //Round done
    if (roundTracker == decideOrder) {
      round += 1; // Move to next round
    }

    ///////////////////////
    // Switch turn
    if (decideOrder === 1) {
      decideOrder = 0;  // Next round is Challenger
    } else if (decideOrder === 0) {
      decideOrder = 1; // Next round is Challenged
    }

    ///////////////////////
    //Annouce winner if one of the player lost
    if (unitTarget.first.name == unitTarget.second.name && (unitTarget.first.hp < 1 || unitTarget.second.hp < 1)) { // Player challenge himself
      unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${gameEnded}`);

      gameResultMessage = await message.channel.send(
        `The Fight's Winner is... Does it even matter? It's the same person!`);

    } else if (unitTarget.first.hp < 1 && unitTarget.second.hp < 1) { // DRAW
      unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${gameEnded}`);
      
      gameResultMessage = await message.channel.send(
        `The Fight has ended in DRAW!!!`);
    
    } else if (unitTarget.first.hp < 1) { // If first player lost (HP to 0)
      unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${gameEnded}`);

      role = unitTarget.secondHP.content.split(' ')[0]; // Get first player role

      gameResultMessage = await message.channel.send(
        `The Fight's Winner is the ${role} ${unitTarget.second.name} !!!`);

    } else if (unitTarget.second.hp < 1) {  // Else if second player lost (HP to 0)
      msgGame = await msgGame.edit(`${msgGame.content}\n${gameEnded}`);

      role = unitTarget.firstHP.content.split(' ')[0]; // Get second player role

      gameResultMessage = await message.channel.send(
        `The Fight's Winner is the ${role} ${unitTarget.first.name} !!!`);
    }
  }
}

///////////////////////////////////////////////////////
// Randomize number
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

///////////////////////////////////////////////////////
// Perform Attack
const Attack = async (message, unitTarget, round) => {
  let damageValue = getRandomInt(6); // Randomize attack damage value
  let critChance = getRandomInt(11);
  let parryValue = getRandomInt(8); // If 0 or 7: Parry 50% of damage
  let dodgeChance = getRandomInt(12); // If 0: Evade damage entirely
  let attackResultMessage;

  if (damageValue === 0 || damageValue === 1) { damageValue = 2; } // Minimum attack damage

  let barrierExist = unitTarget.second.status.find(status => status.status === "Barrier");
  let confuseExist = unitTarget.first.status.find(status => status.status === "Confused");

  //////////////////////////////////////
  // No dodge & No Confuse
  if (dodgeChance > 0 && !confuseExist) {

    ////////////////////////
    //If has 'Barrier' buff
    if (barrierExist) {

      // Remove barrier
      unitTarget.second.status = unitTarget.second.status.filter(status => status.status != "Barrier");

      attackResultMessage =
        `${unitTarget.first.name} tried to strike ${unitTarget.second.name}, but was blocked. Poof! Barrier's gone.`;

      ////////////////////////
      // If parry
    } else if (parryValue == 0 || parryValue == 7 && !barrierExist) { //If parry

      // If critical
      if (critChance === 10) {
        unitTarget.second.hp -= damageValue; // Cirt Damage is halved

        attackResultMessage =
          `${unitTarget.first.name} landed a critical strike on ${unitTarget.second.name}, but luckily ${unitTarget.second.name} parried 50% of the attack, took only ${Math.round(damageValue)} dmg!`;

        // If no critical
      } else {

        unitTarget.second.hp -= Math.round(damageValue / 2); // Damage is halved

        attackResultMessage =
          `${unitTarget.first.name} attacked ${unitTarget.second.name}, but ${unitTarget.second.name} parried 50% of the attack skillfully, took only ${Math.round(damageValue / 2)} dmg!`;
      }
      ////////////////////////
      // If no parry
    } else {

      // If critical
      if (critChance === 10) {
        unitTarget.second.hp -= damageValue * 2; // Normal Damage

        attackResultMessage =
          `${unitTarget.first.name} landed a perfect critical strike on ${unitTarget.second.name}, dealing ${damageValue * 2} dmg! Unbelievable!!!`;

        // If no critical
      } else {
        unitTarget.second.hp -= damageValue; // Normal Damage

        attackResultMessage =
          `${unitTarget.first.name} has dealt ${damageValue} dmg to ${unitTarget.second.name}!`;
      }

    }

  //////////////////////////////////////
  // If dodged & No Confuse
  } else if (dodgeChance == 0 && !confuseExist) {
    
    attackResultMessage =
      `${unitTarget.first.name} performed an attack, but he missed! Pathetic...`;
  
  //////////////////////////////////////
  // If no dodged & Confused
  } else if (dodgeChance > 0 && confuseExist) {
    
    unitTarget.first.hp -= 3; // Normal Damage but damage himself due to confuse

    attackResultMessage =
      `${unitTarget.first.name} tried to hit ${unitTarget.second.name}, but hurt himself due to confusion, dealing 3 dmg! Did you forget who your enemy is??`;

  //////////////////////////////////////
  // If dodged & Confused
  // Dodge can wake him up immediately
  }  else if (dodgeChance == 0 && confuseExist) {

    unitTarget.second.hp -= 1; // Small damage
    
    attackResultMessage =
      `${unitTarget.first.name} snapped out of confusion, and managed to land a minor scratch on ${unitTarget.second.name}, dealing 1 dmg. To be fair, not bad at all!`;
    
  }

  // Update status
  await updateStatusDisplay(message, unitTarget, attackResultMessage);

}

///////////////////////////////////////////////////////
// Perform Special
const Special = async (message, unitTarget, round) => {
  //let status = { status: '', round: 0 }; // Status object

  let method = getRandomInt(9); // Deciding which specil action
  let methodChance = getRandomInt(6); // Decide success or fail
  let methodResultMessage;

  let isConfuse = unitTarget.first.status.find(status => status.status === "Confused");
  
  if (!isConfuse){
  
    switch (method) {
      //////////////////////////////////////
      // Poison
      case 0:
      case 2:
      case 4:
        if (methodChance < 4) { // Success
  
          //Check if there is existing poison buff to the enemy
          const hasPoisonStatus = unitTarget.second.status.find(status => status.status === "Poisoned");
  
          if (!hasPoisonStatus) { // If enemy no existing poison buff
  
            // Add poison status to second player
            unitTarget.second.status.push({ status: "Poisoned", round: 3 });
  
            methodResultMessage =
              `${unitTarget.first.name} hit ${unitTarget.second.name} with a venomous strike, inflicting 2 poison dmg for the next 3 round(s)! How despicable!`;
  
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
      case 5:
        if (methodChance < 4) { // Success

          // Deal 2 damage
          unitTarget.second.hp -= 2;
          
          // Add bleed status to second player
          unitTarget.second.status.push({ status: "Bleed", round: 1 });

          methodResultMessage =
            `${unitTarget.first.name} hit ${unitTarget.second.name} with a vicious stab, dealing 2 dmg, then inflict 3 bleed dmg in the next 1 round! Ouch!`;
  
        } else { // Fail
  
          methodResultMessage =
            `${unitTarget.first.name} tried to strike ${unitTarget.second.name} to cause him bleed, but failed! Oh dear!`;
  
        }
  
        break
  
      //////////////////////////////////////
      // Stun
      case 6:
      case 8:
        if (methodChance < 2) { // Success
  
          //Check if there is existing stun buff to the enemy
          const hasStunStatus = unitTarget.second.status.find(status => status.status === "Stunned");
  
          if (hasStunStatus) { // If enemy has existing stun buff
  
            // Increase stun round by 1
            hasStunStatus.round += 1;
  
            // Deal 2 damage
            unitTarget.second.hp -= 2;
  
            methodResultMessage =
              `${unitTarget.first.name} threw a 15kg dumbell at ${unitTarget.second.name} who was still stunned, dealing 2 dmg and increase 1 more round of stun!`;
  
          } else { // If enemy has no existing stun buff
  
            // Add stun status to second player
            unitTarget.second.status.push({ status: "Stunned", round: 1 });
  
            // Deal 1 damage
            unitTarget.second.hp -= 1;
  
            methodResultMessage =
              `${unitTarget.first.name} hit ${unitTarget.second.name} with a stunning blow, dealing 1 dmg and stun him ${unitTarget.second.name} for 1 round!`;
  
          }
  
        } else { // Fail
  
          // Deal 1 damage to himself
          unitTarget.first.hp -= 1;
  
          methodResultMessage =
            `${unitTarget.first.name} swung a heavy hammer at ${unitTarget.second.name}, but missed and hit his own toe, dealing 1 dmg to himself! Be careful~`;
  
        }
  
        break
  
      //////////////////////////////////////
      // Confuse
      case 7:
        if (methodChance < 2) {
          //Check if there is existing stun buff to the enemy
          const hasConfuseStatus = unitTarget.second.status.find(status => status.status === "Confused");
  
          if (hasConfuseStatus) { // If enemy has existing confuse buff
  
            methodResultMessage =
              `${unitTarget.first.name} tried to confuse ${unitTarget.second.name} with random dad jokes, but ${unitTarget.second.name} was already confused...and it was a bad joke too!`;
  
          } else { // If enemy has no existing stun buff
  
            // Add confuse status to second player
            unitTarget.second.status.push({ status: "Confused", round: 1 });
  
            methodResultMessage =
              `${unitTarget.first.name} is chanting some Calculus formulas, causing ${unitTarget.second.name} to be confused for 1 round, just like one in the exam field!`;
  
          }
        } else { // Fail
          
          methodResultMessage =
            `${unitTarget.first.name} did a chicken dance in front of  ${unitTarget.second.name}, but ${unitTarget.second.name} just staring at him awkwardly, probably had a mix of confusion and sympathy for him.`;
          
        }
        break
      //////////////////////////////////////
      default:
        break
    }
  } else {
    methodResultMessage =
      `${unitTarget.first.name} attempted to perform some special move, but was too confused to do so!`;
  }
  
  // Update status
  await updateStatusDisplay(message, unitTarget, methodResultMessage);

}

///////////////////////////////////////////////////////
// Perform Escape
const Flee = async (message, unitTarget, round) => {
  let escapeChance = getRandomInt(3); // If 0: Escape Failed, 1: Escape Success
  let escapeResultMessage;

  let isConfused = unitTarget.first.status.find(status => status.status === "Confused");
  

  //////////////////////////////////////
  // If escape success
  if (escapeChance === 1 && !isConfused) {

    unitTarget.first.hp = 0; // Escape = Suicide

    escapeResultMessage =
      `${unitTarget.first.name} has shamelessly ran away!!! [ HP Reduced to 0 ]`;
  
  //////////////////////////////////////
  // If escape failed
  } else if (!isConfused) { 
    escapeResultMessage =
      `${unitTarget.first.name} tried to escape, but failed! Guess there's no way out...`;

  //////////////////////////////////////
  // If escape confusion
  } else if (isConfused) {
    unitTarget.first.hp = 4; // Failed, and hurt himself
    
    escapeResultMessage =
      `${unitTarget.first.name} tried to escape in confusion but stumbled, causing himself to suffer 4 dmg as he fell to the ground.`;
  }

  // Update status
  await updateStatusDisplay(message, unitTarget, escapeResultMessage);

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

  if (healValue === 0) { healValue = 1; } // Minimum heal value

  let isConfused = unitTarget.first.status.find(status => status.status === "Confused");

  if (!isConfused) {
    ///////////////////////////
    // Critical Heal
    if (critChance == 16) {
      unitTarget.first.hp += healValue * 2; // Heal
  
      healResultMessage =
        `${unitTarget.first.name} made a critical heal on himself, restored ${healValue * 2} HP!!!`;
  
      ///////////////////////////
      // Failed Heal
    } else if (critChance >= 0 && critChance < 3) {
      unitTarget.first.hp -= 1; // Fail heal, damage himself 1HP
  
      healResultMessage =
        `${unitTarget.first.name} performed a healing magic, but he failed! Resulting 1 dmg to himself... How incompetent~`;
  
      ///////////////////////////
      // Barrier Magic
    } else if (critChance < 20 && critChance > 16) {
  
      // Add barrier status
      unitTarget.first.status.push({ status: "Barrier", round: 2 });
  
      healResultMessage =
        `${unitTarget.first.name} casted barrier magic that lasts 2 rounds and blocks normal attack once!`;
  
      ///////////////////////////
      // Purify Magic
    } else if (critChance < 15 && critChance > 11) {
  
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
  } else if(isConfused && critChance > 17) {
    // Add barrier status
    unitTarget.first.status.push({ status: "Barrier", round: 2 });

    healResultMessage =
      `${unitTarget.first.name} recalled his mother from hometown, snapped him back from confusion, infusing himself with courage and a protective barrier!`;
    
  } else {
    healResultMessage =
      `${unitTarget.first.name} wanted to cast some healing magic, but failed due to confusion, ending up chanting some random spanish!`;
  }
  
  // Update status
  await updateStatusDisplay(message, unitTarget, healResultMessage);

}

///////////////////////////////////////////////////////
// Settle status from all players at every starting of the round
const statusSettle = async (message, unitTarget) => {
  const statusArrays = [unitTarget.first, unitTarget.second];
  let statusUpdate = ``;


  for (const statusTarget of statusArrays) { // All player

    for (const status of statusTarget.status) { // All status

      // Decrease the duration of each status by 1 round
      status.round--;

      if(statusUpdate){
        statusUpdate += `\n`;
      }
      
      //////////////////////////////////////
      // Check if the status has a corresponding damaging effect
      switch (status.status) {

        ///////////////////////
        //Poisoned
        case 'Poisoned':
          statusTarget.hp -= 2; // Take damage
          statusUpdate += `${statusTarget.name} took 2 dmg from poison!`;

          break;

        ///////////////////////
        // Bleed
        case 'Bleed':
          statusTarget.hp -= 3; // Take damage
          statusUpdate += `${statusTarget.name} took 3 dmg from bleeding!`;

          break;

        ///////////////////////
        // Confuse
        case 'Confused':
          if (status.round > -1) {
          
            statusUpdate += `${statusTarget.name} is still suffering from confusion!`;
          
          }
          break;
        ///////////////////////
        // Barrier
        case 'Barrier':
          // If the status is 'Barrier', display unique message
          if (status.round === 0) {

            statusUpdate += `The ${status.status} status on ${statusTarget.name} has worn off.`;

          }
          break
      }

      //////////////////////////////////////
      // If the status has expired, excluding 'Stunned' & 'Barrier'
      if (status.round === 0 && status.status != 'Stunned' && status.status != 'Confused' && status.status != 'Barrier') {

        statusUpdate += ` The ${status.status} status has worn off.`;

      }
      
    }

    //////////////////////////////////////
    // Settle 1 round Status, Exp: 'Stunned', 'Confused'
    // Each round happened, only if those status is -1, then its status is removed
    let isStunned = statusTarget.status.find(status => status.status === "Stunned");
    let isConfused = statusTarget.status.find(status => status.status === "Confused");

    ///////////////////
    // Settle 'Stunned'
    if (isStunned) {

      // If the stun status is expired, aka if -1
      if (isStunned.round < 0) {

        if(statusUpdate){
          statusUpdate += `\n`;
        }
        
        statusUpdate += `${statusTarget.name} has woke up from stunned!`;
      }
    }
    ///////////////////
    // Settle 'Confused'
    if (isConfused) {

      // If the confuse status is expired, aka if -1
      if (isConfused.round < 0) {

        if(statusUpdate){
          statusUpdate += `\n`;
        }
        
        statusUpdate += `${statusTarget.name} has recovered from the state of confusion!`;
      }
    }
    
    //////////////////////////////////////
    // Remove the expired status from all player
    // 'Stunned' and 'Confused' will only disappear after -1 round,
    // So it won't be ignored upon next round
    statusTarget.status = statusTarget.status.filter(status => 
      (status.round > 0 && status.status != 'Stunned' && status.status != 'Confused') || 
      (status.round > -1 && (status.status == 'Stunned' || status.status == 'Confused'))
    );
    
  }

  // Update status
  await updateStatusDisplay(message, unitTarget, statusUpdate);

}

///////////////////////////////////////////////////////
// Settle all player status display
const updateStatusDisplay = async (message, unitTarget, incomingUpdate) => {
  
  let statusStringP1 = `` // Player 1 status string
  unitTarget.first.status.forEach(status => {

    // Unique display case for 'Stunned' and 'Confused'
    // If 0, show 1, as it only expired on -1
    if ((status.status == 'Stunned' || status.status == 'Confused') && status.round == 0) {
      statusStringP1 += `{${status.status}: 1 Round(s)} `
    } else {
      statusStringP1 += `{${status.status}: ${status.round} Round(s)} `
    }
  });
  
  let statusStringP2 = `` // PLayer 2 status string
  unitTarget.second.status.forEach(status => {

    // Unique display case for 'Stunned' and 'Confused'
    // If 0, show 1, as it only expired on -1
    if ((status.status == 'Stunned' || status.status == 'Confused') && status.round == 0) {
      statusStringP2 += `{${status.status}: 1 Round(s)} `
    } else {
      statusStringP2 += `{${status.status}: ${status.round} Round(s)} `
    }
  });

  let roleP1 = unitTarget.firstHP.content.split(' ')[0]; // Get first player role
  let roleP2 = unitTarget.secondHP.content.split(' ')[0]; // Get second player role
  
  // Update first player status
  unitTarget.firstHP = await unitTarget.firstHP.edit(`${roleP1} ${unitTarget.first.name} \tHP: ${unitTarget.first.hp}/10 \tStatus: [ ${statusStringP1} ]`);

  // Update second player status
  unitTarget.secondHP = await unitTarget.secondHP.edit(`${roleP2} ${unitTarget.second.name} \tHP: ${unitTarget.second.hp}/10 \tStatus: [ ${statusStringP2} ]`);

  // Display update in text message
  unitTarget.msgGame = await unitTarget.msgGame.edit(`${unitTarget.msgGame.content}\n${incomingUpdate}`);

}