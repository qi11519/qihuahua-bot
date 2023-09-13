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
    
    if (channel.videos.items[0]) {
      let latestVideo = channel.videos.items[0];
      
      const videoUrl = `https://www.youtube.com/watch?v=${latestVideo.id}`;
      const videoTitle = latestVideo.title;
      const videoThumbnail = latestVideo.thumbnails[3].url;

      //console.log(channelName);
      
      
      const uploadTime = latestVideo.uploadDate;

      const currentUploadTime = uploadTime.split(' ');
      
      const currentTime = new Date().getTime();

      //console.log("Latest Video now: " , videoTitle, " & ", currentUploadTime);
      //console.log(currentTime);
      
      //if (Number(currentUploadTime[0]) <= 40 && currentUploadTime[1] === "seconds") {
      if (Number(currentUploadTime[0]) <= 30 && currentUploadTime[1] === "minutes") {
        console.log("Its newly baked...")
        
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