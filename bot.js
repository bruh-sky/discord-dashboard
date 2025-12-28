const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const readyPromise = new Promise(resolve => {
  client.once("ready", () => {
    console.log(`✅ ${client.user.tag} online`);
    resolve();
  });
});

client.login(process.env.DISCORD_TOKEN);

module.exports = { client, EmbedBuilder, readyPromise };
