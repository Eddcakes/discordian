require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

client.once("ready", () => {
  console.log("we have lift off");
});

client.on("message", msg => {
  const rndNum = Math.floor(Math.random() * 100);
  if (
    msg.guild.id === process.env.SERVER_ID &&
    msg.channel.id === process.env.CHANNEL_ID
  ) {
    if (msg.author.bot) return;
    if (rndNum < 25) {
      msg.reply(suckArray[Math.floor(Math.random() * suckArray.length)], {
        tts: true
      });
    } else if (rndNum === 69) {
      msg.channel.send("@everyone wakeup", { tts: true });
    } else {
      msg.reply(coolArray[Math.floor(Math.random() * coolArray.length)], {
        tts: true
      });
    }
  }
});

client.login(process.env.BOT_TOKEN);

const coolArray = [
  "Hey, thats pretty cool",
  "nice hat",
  "...sweet",
  "tell me more",
  "wow thats cool",
  "close enough",
  "🤖"
];

const suckArray = [
  "u suk",
  "kys",
  "so much 💩...",
  `you're still here?`,
  "no one cares",
  "wow thats so interesting 😴😴"
];
