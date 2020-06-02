require('dotenv').config();
const fs = require('fs');
const userListJSON = fs.readFileSync('./userList.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const userList = JSON.parse(userListJSON);
const infernoUserIds = userList.reduce((ids, user) => {
  return user.inferno ? [...ids, user.discordId.toString()] : [...ids];
}, []);

client.once('ready', () => {
  console.log('Ready!');
});

client.login(process.env.BOT_TOKEN);

const responseArray = [
  'Sorry you are not permitted to use this emote, GIT GUD SCRUB',
  'smh cheese cape wanker',
];
const rndIndex = Math.floor(Math.random() * responseArray.length - 1);

client.on('message', async (msg) => {
  if (
    msg.guild.id === process.env.SERVER_ID &&
    msg.channel.id === process.env.CHANNEL_ID
  ) {
    if (msg.author.bot) return;
    if (msg.content.includes(':capebtw:')) {
      if (!infernoUserIds.includes(msg.author.id)) {
        msg.reply(responseArray[rndIndex]);
      }
    }
  }
});
