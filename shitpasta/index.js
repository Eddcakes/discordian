require("dotenv").config();
const fetch = require("node-fetch");
const Discord = require("discord.js");
const client = new Discord.Client();

client.once("ready", () => {
  console.log("🤖 armed for shitposting 🤖");
});

const url = "https://www.reddit.com/r/copypasta/hot.json";

client.on("message", msg => {
  if (
    msg.guild.id === process.env.SERVER_ID &&
    msg.channel.id === process.env.CHANNEL_ID
  ) {
    if (msg.author.bot) return;
    if (msg.content.startsWith("!shitpost")) {
      spamage()
        .then(content => {
          /* 
        ok so DiscordAPIError is thrown when body > 2000 chacters so need to check for this
        tts only speaks a few sentences through
        could we try breaking up into multiple messages to solve both of these?
        */
          return msg.channel.send(content, { tts: true });
        })
        .catch(
          msg.channel.send("oooopsy whoopsy something went wrong 😢", {
            tts: true
          })
        );
    }
  }
});

client.login(process.env.BOT_TOKEN);

function spamage() {
  return fetch("https://www.reddit.com/r/copypasta/hot.json")
    .then(response => response.json())
    .then(call => {
      const posts = call.data.children;
      const rndIndex = Math.floor(
        Math.random() * call.data.children.length - 1
      );
      const title = posts[rndIndex].data.title;
      const selftext = posts[rndIndex].data.selftext;
      if (title.length > selftext.length) {
        return title;
      } else {
        return selftext;
      }
    })
    .catch(err => console.log(err));
}
