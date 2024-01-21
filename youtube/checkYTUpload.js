const Discord = require("discord.js")
const { Client } = require('youtubei');
const client = new Client();

const channelId = 'UC-fDp2GeCZbBFrM-Jl1tP6g';
//UCyu2cg8Vi7teLTMddX_UPvA : Test YT Channel
//UC-fDp2GeCZbBFrM-Jl1tP6g : Banana Bus YT Channel

const discordChannelId = '563617204000522273';

module.exports = async function checkYTUpload(client1, messageSent) {
  try {
    const channelId = 'UC-fDp2GeCZbBFrM-Jl1tP6g';
    const discordChannelId = '563617204000522273';
    
    const channel = await client.getChannel(channelId);
    
    await channel.videos.next();

    const channelName = channel.name;

    // If video is found
    if (channel.videos.items[0]) {
      let latestVideo = channel.videos.items[0];

      // Video info: URL, Title, Thumbnail link, Upload Time (How long ago)
      const videoUrl = `https://www.youtube.com/watch?v=${latestVideo.id}`;
      const videoTitle = latestVideo.title;
      const videoThumbnail = latestVideo.thumbnails[3].url;
      const uploadTime = latestVideo.uploadDate;

      // 'uploadTime' will return as '3 hours ago', '30 minutes ago', etc.
      // then split by spacing
      // Exp: '30 minutes ago', split into {'30','minutes','ago'}
      const currentUploadTime = uploadTime.split(' ');

      // For every 30 minutes,
      // Check the lastest video if it is uploaded within 30 minutes,
      // If condition true, send a message to the discord channel, else, do nothing.
      if (Number(currentUploadTime[0]) <= 30 && currentUploadTime[1] === "minutes") {
        
        if (messageSent != videoUrl) {
          
          messageSent = videoUrl;
        
          let minutes = ~~(Number(latestVideo.duration) / 60);
          let extraSeconds = Number(latestVideo.duration) % 60;
          
          let embed = {
            color: 0xFEFF9D,
            title: videoTitle,
            url: videoUrl,
            author: {
              name: channelName + " just uploaded a new video!",
              icon_url: 'attachment://b.png',
            },
            thumbnail: {
              url: videoThumbnail,
            },
            fields: [
              { name: 'Video Link', value: videoUrl, inline: true },
              { name: 'Duration:', value: minutes + ":" + extraSeconds, inline: true },
              { name: 'Upload Date', value: uploadTime},
            ],
          };
  
          // Send the message
          //console.log("New video uploaded!");
          client1.channels.cache.get(discordChannelId).send({ embeds: [embed], files: ['./images/b.png'] });
        }
      }
    }
  } catch (error) {
    console.error(error);
  }

  return messageSent;
};