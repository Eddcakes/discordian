require("dotenv").config();
const fetch = require("node-fetch");
const Discord = require("discord.js");
const client = new Discord.Client();
const env_settings = process.env.SETTINGS;
const subReddit = process.env.SUB_REDDIT || "copypasta";

client.on("ready", () => {
  if (process.env.NODE_ENV === "production") {
    client.user
      .setActivity("the clock")
      .then(presence =>
        console.log(
          `set for production activity ${presence.activities[0].name}`
        )
      )
      .catch(console.error);
  }

  if (env_settings === "development") {
    client.user
      .setActivity("dev mode")
      .then(presence =>
        console.log(`set dev activity ${presence.activities[0].name}`)
      )
      .catch(console.error);
  }
});

client.once("ready", () => {
  console.log("🤖 armed for shitposting 🤖");
});

const prefix = "!shitpost ";

if (env_settings === "development") {
  client.on("message", async msg => {
    if (
      msg.guild.id === process.env.SERVER_ID &&
      msg.channel.id === process.env.CHANNEL_ID
    ) {
      if (!msg.content.startsWith(prefix) || msg.author.bot) return;
      const args = msg.content.slice(prefix.length).split(/ +/);
      const postNo = parseInt(args.shift());
      /* stickied posts don't seem to count towards the 25 default so can be higher than 25 */
      if (Number.isInteger(postNo) && postNo < 25) {
        ttsPost(msg, subReddit, postNo);
      } else {
        msg.reply(`argument must be a number < 25, you entered: ${postNo}`);
      }
    }
  });
}

client.on("message", async msg => {
  if (
    msg.guild.id === process.env.SERVER_ID &&
    msg.channel.id === process.env.CHANNEL_ID
  ) {
    if (msg.author.bot) return;
    if (msg.content.startsWith("!shitpasta")) {
      ttsPost(msg, subReddit);
    }
  }
});

client.login(process.env.BOT_TOKEN);

/**
 * wrapper to send spam as tts
 * @param {Object} msg the discord message object so we can send the messages
 * @param {String} sub subreddit
 * @param {Number} postNumber post number, limit ~< 25 if null || omitted uses random num
 */
async function ttsPost(msg, sub, postNumber) {
  await spamage(sub, postNumber)
    .then(content => {
      // now the message is chunked for tts it says the bot name each new chunk
      // `beepboop said:` every 184 char chunk
      content.map(chunkedContent => {
        msg.channel.send(unescape(chunkedContent), {
          tts: true
        });
      });
    })
    .catch(err => console.log(`ttsPost error: ${err}`));
}

function spamage(subreddit, postNumber = null) {
  return fetch(`https://www.reddit.com/r/${subreddit}/hot.json`)
    .then(response => response.json())
    .then(call => {
      const posts = call.data.children;
      const rndIndex = Math.floor(
        Math.random() * call.data.children.length - 1
      );
      const title =
        postNumber === null || postNumber < posts.length
          ? posts[rndIndex].data.title
          : posts[postNumber].data.title;
      const selftext =
        postNumber === null || postNumber < posts.length
          ? posts[rndIndex].data.selftext
          : posts[postNumber].data.selftext;
      if (title.length > selftext.length) {
        return chunk(title);
      } else {
        return chunk(selftext);
      }
    })
    .catch(err => {
      return console.log(`spamage ${err}`);
    });
}

//break content into chunks less than 184 characters
function chunk(text) {
  //185 characters seems to be longest discord tts reads
  let ii, lastSpaceIndex;
  const maxChunkSize = 184;
  let chunks = [];
  if (text.length > maxChunkSize) {
    for (ii = 0; ii < text.length; ii += lastSpaceIndex) {
      let temp = text.substring(ii, ii + maxChunkSize);
      lastSpaceIndex = temp.lastIndexOf(" ");
      // need to check for the last "part" otherwise last index of space
      // will mean ii is always less than text.length
      if (ii + maxChunkSize > text.length) {
        chunks.push(text.substring(ii, ii + maxChunkSize));
        break;
      } else {
        chunks.push(text.substring(ii, ii + lastSpaceIndex));
      }
    }
  } else {
    chunks.push(text);
  }
  return chunks;
}
