import * as Discord from 'discord.js'

import { Bot } from '../../bot'
import { CommandInterface } from '../../typedefs'

export default class Choose implements CommandInterface {

    public help(): {elevatorPitch:string, description: string} {
        return {
            elevatorPitch: "Trouble deciding? Ask rootbear!",
            description: `Choose between the options provided: choose <thing1> <thing2> .. <thingX>`
        }
    }

    public process(bot: Bot, message: Discord.Message) {
        let choices: string[] = this.dissectMessaageContent(bot, message);
        choices.shift();

        if (choices.length > 1) {
            let myChoice: string = choices[Math.floor(Math.random() * choices.length)];
            message.reply(myChoice);
        }
        else if (choices.length === 1) {
            message.reply("Tough choice, but I picked \"" + choices[0] + "\".");
        }
        else {
            message.reply("I choose you!");
        }
    }

    private dissectMessaageContent(bot: Bot, message: Discord.Message): string[] {
        let messageContent: string = message.cleanContent;

        // Strip the prefix and split on spaces.
        messageContent = messageContent.slice(bot.getPrefix().length, message.cleanContent.length)
        return messageContent.split(' ');
    }
}
