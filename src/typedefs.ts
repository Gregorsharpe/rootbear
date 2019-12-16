import * as Discord from 'discord.js'

import { Bot } from './bot'

export interface BotConfig {
    token: string
    prefix: string
    version: string
    optionalConfigThing?: string
}

export interface MessageHandlerInterface {
    handleMessage(message: Discord.Message): void;
}

export interface CommandInterface {
    help(): {elevatorPitch:string, description: string}; 
    process(bot: Bot, message: Discord.Message): void;
}
