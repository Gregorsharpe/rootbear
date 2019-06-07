var Discord = require('discord.js');
var client = new Discord.Client();
client.on('ready', function () {
    console.log("Logged in as " + client.user.tag + "!");
});
client.on('message', function (msg) {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});
console.log("Starting bot!");
client.login('NTU0NzM0MDI5MjQxNTgxNjA5.XPm4Yg.cJdFmMeJgAwwLRk5obO4bN-5FDk');
//# sourceMappingURL=index.js.map