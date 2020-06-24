require('dotenv').config();
const fs = require('fs');
const userListJSON = fs.readFileSync('./userList.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const userList = JSON.parse(userListJSON);
const infernoUserIds = userList.reduce((ids, user) => {
  return user.inferno ? [...ids, user.discordId.toString()] : [...ids];
}, []);
const maxCapeUserIds = userList.reduce((ids, user) => {
  return user.max ? [...ids, user.discordId.toString()] : [...ids];
}, []);

client.once('ready', () => {
  console.log('Ready!');
});

client.login(process.env.BOT_TOKEN);

const infernoRespArray = [
  'Sorry you are not permitted to use this emote, GIT GUD SCRUB',
  'smh cheese cape wanker',
  'Really? Again? SMH',
  'Sorry you do not reach the minimum skill threshold to use this emote',
  'Maybe you should try harder?',
  '👀 does it even need to be said? 🤦‍♂️',
  'Shall we see whos selling? 💰💰🌋',
];

client.on('message', async (msg) => {
  if (
    msg.guild.id === process.env.SERVER_ID &&
    msg.channel.id === process.env.CHANNEL_ID
  ) {
    if (msg.author.bot) return;
    if (msg.content.includes(':maxinfernal:')) {
      if (
        !infernoUserIds.includes(msg.author.id) &&
        !maxCapeUserIds.includes(msg.author.id)
      ) {
        msg.reply('OK, keep dreaming mate');
      } else if (!maxCapeUserIds.includes(msg.author.id)){
        msg.reply(
          `haha only ${Math.floor(Math.random() * 100000)} hours to go...`
        );
      }
    } else if (msg.content.includes(':capebtw:')) {
      if (!infernoUserIds.includes(msg.author.id)) {
        msg.reply(
          infernoRespArray[Math.floor(Math.random() * infernoRespArray.length)]
          );
      }
    }
  }
});
