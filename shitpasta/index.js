require("dotenv").config();
const fetch = require("node-fetch");
const Discord = require("discord.js");
const client = new Discord.Client();

client.once("ready", () => {
  console.log("🤖 armed for shitposting 🤖");
});

client.on("message", async msg => {
  if (
    msg.guild.id === process.env.SERVER_ID &&
    msg.channel.id === process.env.CHANNEL_ID
  ) {
    if (msg.author.bot) return;
    if (
      msg.content.startsWith("!shitpost") ||
      msg.content.startsWith("!shitpasta")
      // if SHITPASTA could tocaps the message lol
    ) {
      await spamage("copypasta")
        .then(content => {
          /* 
          now the message is chunked for tts it says the bot name each new chunk 
          `beepboop said:` every 184 char chunk 
        */
          content.map(chunkedContent => {
            msg.channel.send(chunkedContent, {
              tts: true
            });
          });
        })
        .catch(err => console.log("spamage error: ", err));
    }
  }
});
client.login(process.env.BOT_TOKEN);

function spamage(subreddit) {
  return fetch(`https://www.reddit.com/r/${subreddit}/hot.json`)
    .then(response => response.json())
    .then(call => {
      const posts = call.data.children;
      const rndIndex = Math.floor(
        Math.random() * call.data.children.length - 1
      );
      const title = posts[rndIndex].data.title;
      const selftext = posts[rndIndex].data.selftext;
      if (title.length > selftext.length) {
        return chunk(title);
      } else {
        return chunk(selftext);
      }
    })
    .catch(err => {
      return console.log(err);
    });
}

//break content into chunks less than 184 characters
function chunk(text) {
  //185 characters seems to be longest discord tts reads
  const maxChunkSize = 184;
  let chunks = [];
  //might be nice to break at closest space before 185th character to only split "full" words
  if (text.length > maxChunkSize) {
    for (let ii = 0; ii < text.length; ii += maxChunkSize) {
      chunks.push(text.substring(ii, ii + maxChunkSize));
    }
  } else {
    chunks.push(text);
  }
  return chunks;
}
