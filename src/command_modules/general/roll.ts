import * as Discord from 'discord.js'

import { Bot } from '../../bot'
import { CommandInterface } from '../../typedefs'

export default class Roll implements CommandInterface {

    public help(): {elevatorPitch:string, description: string} {
        return {
            elevatorPitch: "D20s will decide your fate!",
            description: `Roll a multi-sided die, defaults to 100.`
        }
    }

    public process(bot: Bot, message: Discord.Message) {
        let dice: string[] = this.dissectMessaageContent(bot, message);
        let results: string = "";
        dice.shift();

        if (dice.length > 0) {
            for (const choice of dice) {
                let maxInt: number = parseInt(choice);
                results = results + "[**" + this.rollDie(maxInt).toString() + "**] ";
            }
        }
        else {
            results = "**[" + this.rollDie(100).toString() + "]**";
        }

        message.reply(results);
    }

    private rollDie(maxInt: number): number {
        return Math.ceil(Math.random() * Math.floor(maxInt));
    }

    private dissectMessaageContent(bot: Bot, message: Discord.Message): string[] {
        let messageContent: string = message.cleanContent;
    
        // Strip the prefix and split on spaces.
        messageContent = messageContent.slice(bot.getPrefix().length, message.cleanContent.length)
        return messageContent.split(' ');
    }
}
