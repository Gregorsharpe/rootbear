import * as Discord from 'discord.js'

import { Bot } from '../../bot'
import { CommandInterface } from '../../typedefs'

export default class Ping implements CommandInterface {

    public help(): {elevatorPitch:string, description: string} {
        return {
            elevatorPitch: "Send a ping, and wait for a Pong.",
            description: `A quick way to check if Rootbear is online and responding properly.`
        }
    }

    public process(bot: Bot, message: Discord.Message): string {
        return "Pong!"
    }
}