const { MessageActionRow, MessageButton, Interaction } = require('discord.js');

const CHOICES = ['rock', 'paper', 'scissors'];

const competingList = [];

let games = new Map();

module.exports = {
  name: 'rps',
  
  aliases: ['rps'],
  
  description: 'Challenge someone to a game of Rock Paper Scissors!',

  async execute(interaction, args, cmd, client) {
    console.log("activated");
    const opponent = interaction.options.getMember('opponent');
    if (!opponent) {
      return interaction.reply('Please mention an opponent to challenge!');
    }

    if (opponent.user.bot) {
      return interaction.reply('You cannot challenge a bot to Rock Paper Scissors!');
    }

    if (games.has(interaction.channelId)) {
      return interaction.reply('There is already a game in progress in this channel!');
    }

    // Create a new game and store it in the games map
    const game = new RPSGame(interaction.user, opponent);
    games.set(interaction.channelId, game);

    // Send the challenge message with buttons for each choice
    const challengeMessage = await interaction.reply({
      content: `${opponent}, ${interaction.user} has challenged you to a game of Rock Paper Scissors! Choose your move:`,
      components: [
        new MessageActionRow().addComponents(
          CHOICES.map(choice => new MessageButton().setCustomId(choice).setLabel(capitalize(choice)).setStyle('PRIMARY'))
        )
      ]
    });

    // Create a message collector to listen for the opponent's choice
    const collector = challengeMessage.createMessageComponentCollector({
      filter: i => i.user.id === opponent.id,
      time: 15000
    });

    // When the opponent makes a choice, end the game and send the result message
    collector.on('collect', async i => {
      const game = games.get(interaction.channelId);
      const result = game.play(i.customId);
      games.delete(interaction.channelId);

      await challengeMessage.edit({
        content: `${opponent} chose ${capitalize(i.customId)}! ${result}`
      });
    });

    // If the opponent doesn't make a choice in time, end the game and send the timeout message
    collector.on('end', async collected => {
      if (games.has(interaction.channelId)) {
        games.delete(interaction.channelId);
        await challengeMessage.edit({
          content: `${opponent} didn't respond in time. Game over!`
        });
      }
    });
  }
};

class RPSGame {
  constructor(player1, player2) {
    this.players = [player1, player2];
    this.choices = new Map();
  }

  play(choice) {
    this.choices.set(choice, this.players.indexOf(message.author));

    if (this.choices.size === this.players.length) {
      const p1Choice = this.choices.get(CHOICES[0]);
      const p2Choice = this.choices.get(CHOICES[1]);

      if (p1Choice === p2Choice) {
        return 'It\'s a tie!';
      } else if ((p1Choice + 1) % 3 === p2Choice) {
        return `${this.players[0]} wins!`;
      } else {
        return `${this.players[1]} wins!`;
      }
    } else {
      return `${this.players[this.choices.size]} has chosen their move!`;
    }
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
