/////////////////////////////////////
//LIBRARY
const Discord = require("discord.js")
const fetch = require('node-fetch');

const { EmbedBuilder } = require('discord.js');

/////////////////////////////////////////
//GLOBAL VARIABLE

const twitchChannel = 'zhen1011'; // the Twitch channel you want to monitor
const discordChannelId = '563617204000522273'; // the Discord channel ID where the bot will send the message

//Channel ID/blablabla
//563617204000522270: My Craft Not Your Craft
//563617204000522273: texttexttexttexttext
//780386882218360853: Test Server
//843007750371016705: Test Text channel

// Twitch API authentication
const clientId = process.env.twitch_client_id;
const clientSecret = process.env.twitch_client_secret;
const tokenUrl = 'https://id.twitch.tv/oauth2/token';
let accessToken;


////////////////////////////////////////
// Authenticate with Twitch API
const authenticate = async () => {
  const response = await fetch(`${tokenUrl}?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
    method: 'POST',
  });

  const data = await response.json();
  if (data.data) {
    
  }
  accessToken = data.access_token;
};

////////////////////////////////////////
//Grabbing the streamer's profile picture
const getProfileImageUrl = async (username) => {
  const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-ID': clientId,
    },
  });

  const data = await response.json();
  if (data.data.length) {
    return data.data[0].profile_image_url;
  }
  return null;
};

////////////////////////////////////////
// Check if the Twitch channel is live
const checkStream = async (client, messageSent) => {

  //Using helix api to retrieve stream status/live information
  const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${twitchChannel}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-ID': clientId,
    },
  });

  //If data = null, means channel/stream is not live
  const data = await response.json();
  
  if (data.data.length) {
    // Twitch channel is live
    if (messageSent === false){ //Message was never sent

      //client.channels.cache.get('843007750371016705').send('It is live!');

      //Extract live info to a collection
      const { title, game_name, viewer_count, thumbnail_url } = data.data[0];

      //Get shitty photo
      const profileImageUrl = await getProfileImageUrl(twitchChannel);

      //Message template
      let embed_Msg = {
        color: 0x5805A6,
        title: `${twitchChannel} is live on Twitch!`,
        description: title,
        url: `https://www.twitch.tv/${twitchChannel}`,
        thumbnail: {
          url: profileImageUrl
        },
        fields: [
          {
            name: 'Game',
            value: game_name,
            inline: true
          }/*,
          {
            name: 'Viewers',
            value: viewer_count,
            inline: true
          }*/
        ],
        image: {
          url: thumbnail_url.replace('{width}x{height}', '320x180')
        },
        timestamp: new Date()
      };

      //Sending embed message to specific text channel(based on text channel id)
      client.channels.cache.get(discordChannelId).send({ embeds: [embed_Msg] });
      messageSent = true; //Set to true so it wont send the dogshit again
    
      return messageSent; //Return updated messageSent status
    } else {
      return messageSent;
    }

    return messageSent;
  } else { //Stream is not live(basically data = null)
    return messageSent = false; //Reset messageSent status
  }
};

module.exports = { authenticate, checkStream };