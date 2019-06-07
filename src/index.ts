const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

console.log(`Starting bot!`);
client.login('NTU0NzM0MDI5MjQxNTgxNjA5.XPm4Yg.cJdFmMeJgAwwLRk5obO4bN-5FDk');