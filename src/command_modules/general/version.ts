import * as Discord from 'discord.js'

import { Bot } from '../../bot'
import { CommandInterface } from '../../typedefs'

export default class Version implements CommandInterface {

    public help(): {elevatorPitch:string, description: string} {
        return {
            elevatorPitch: "Display version info.",
            description: `Display the current version of the Rootbear code.`
        }
    }

    public process(bot: Bot, message: Discord.Message) {
        message.reply(bot.getVersion.toString());
    }
}