import * as Discord from 'discord.js'

export interface BotConfig {
    token: string
    prefix: string
    optionalConfigThing?: string
}

export interface MessageHandlerInterface {
    handleMessage(message: Discord.Message): void;
}

export interface CommandInterface {
    process(): string;
}