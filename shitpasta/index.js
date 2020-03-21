require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

client.once("ready", () => {
  console.log("🤖 armed for shitposting 🤖");
});

client.login(process.env.BOT_TOKEN);
