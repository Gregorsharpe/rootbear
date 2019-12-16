import * as Discord from 'discord.js'

import { Bot } from '../../bot'
import { CommandInterface } from '../../typedefs'

export default class Flip implements CommandInterface {

    public help(): {elevatorPitch:string, description: string} {
        return {
            elevatorPitch: "Flip a coin for all the big decisions!",
            description: `Flip a coin, or multiple coins. flip <numCoins>`
        }
    }

    public process(bot: Bot, message: Discord.Message) {
        let args: string[] = this.dissectMessaageContent(bot, message);
        let results: string = "";
        args.shift();

        if (args.length > 0) {
            // If a user is mentioned, flip that user.
            if (message.mentions.users.size > 0) {
                for (const user of message.mentions.users) {
                    let mentionedUser: Discord.User = user[1];
                    bot.getLogger().info(bot.getUsername() + " : " + mentionedUser.username);
                    if (bot.getUsername() == mentionedUser.username) {
                        results = results + "You think you're funny?!\n";
                        results = results + "(╯°□°）╯︵ " + flipString(message.author.username) + '\n';
                    }
                    else {
                        results = results + "(╯°□°）╯︵ " + flipString(mentionedUser.username.toLowerCase()) + '\n';
                    }    
                }
                message.channel.send(results);
            }
            // If a numerical arg is provided, flip multiple coins.
            else {
                let numCoins = parseInt(args[0]);
                for ( let i = 0; i < numCoins; i++ ) {
                    results = results + this.flipCoin() + " ";
                }
                message.channel.sendMessage(results);
            }
        }
        // Default, flip one coin.
        else {
            message.channel.sendMessage(this.flipCoin());
        }
    }

    private flipCoin(): string {
        return Math.round(Math.random()) ? "Heads" : "Tails";
    }

    private dissectMessaageContent(bot: Bot, message: Discord.Message): string[] {
        let messageContent: string = message.cleanContent;
    
        // Strip the prefix and split on spaces.
        messageContent = messageContent.slice(bot.getPrefix().length, message.cleanContent.length)
        return messageContent.split(' ');
    }
}


function flipString(aString: string) {

    var flipTable: {[key: string]: string} = {
        ['a'] : '\u0250',
        ['b'] : 'q',
        ['c'] : '\u0254', 
        ['d'] : 'p',
        ['e'] : '\u01DD',
        ['f'] : '\u025F', 
        ['g'] : '\u0183',
        ['h'] : '\u0265',
        ['i'] : '\u0131', 
        ['j'] : '\u027E',
        ['k'] : '\u029E',
        ['l'] : '\u0283',
        ['m'] : '\u026F',
        ['n'] : 'u',
        ['r'] : '\u0279',   
        ['t'] : '\u0287',
        ['v'] : '\u028C',
        ['w'] : '\u028D',
        ['y'] : '\u028E',
        ['.'] : '\u02D9',
        ['['] : ']',
        ['('] : ')',
        ['{'] : '}',
        ['?'] : '\u00BF',
        ['!'] : '\u00A1',
        ["\'"] : ',',
        ['<'] : '>',
        ['_'] : '\u203E',
        [';'] : '\u061B',
        ['\u203F'] : '\u2040',
        ['\u2045'] : '\u2046',
        ['\u2234'] : '\u2235',
        ['\r'] : '\n' 
    }

    var last = aString.length - 1;
    var result = new Array(aString.length)
    for (var i = last; i >= 0; --i) {
        var c = aString.charAt(i)
        var r = flipTable[c]
        result[last - i] = r != undefined ? r : c
    }
    return result.join('')
}
