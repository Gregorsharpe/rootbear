import * as Discord from 'discord.js'

import { MessageHandlerInterface, CommandInterface } from './typedefs'
import { Bot } from './bot'
import { ModuleManager } from './moduleManager'

export class MessageHandler implements MessageHandlerInterface {

    private _parentBot: Bot;
    private _moduleManager: ModuleManager;
    private _commandList: string[] = [];

    constructor(parentBot: Bot) {
        this._parentBot = parentBot;
        this._moduleManager = new ModuleManager(this._parentBot, './dist/command_modules/');
        this.init()
    }

    public async handleMessage(message: Discord.Message) {
        // Ensure we never reply to ourselves.
        if (this.itWasntMe(message.author) && this.matchesPrefix(message)) {
            let spaceDelimitedMessage:string[] = this.dissectMessaageContent(message);
            let firstWord: string = spaceDelimitedMessage[0].toLowerCase();

            if (this.existsInCommands(firstWord)) {
                this._moduleManager.fetchCommand(firstWord).then( result => {
                    message.reply(result.process());
                });
            }
        }
    }

    private async init() {
        await this._moduleManager.loadModules();

        this._moduleManager.getListOfLoadedCommands().then( result => {
            this._commandList = result;
            this._parentBot.getLogger().info(this._commandList.length + " command(s) loaded: " + this._commandList.toString());
        });
    }

    private itWasntMe(author: Discord.User): Boolean {
        return (author.id !== this._parentBot.getClient().user.id)
    }

    private matchesPrefix(message: Discord.Message): Boolean {
        return message.cleanContent.charAt(0) == this._parentBot.getPrefix()
    }
    
    private existsInCommands(toCheck: string): Boolean {
        return this._commandList.indexOf(toCheck) > -1
    }

    private dissectMessaageContent(message: Discord.Message): string[] {
        let messageContent: string = message.cleanContent;

        // Strip the prefix and split on spaces.
        messageContent = messageContent.slice(this._parentBot.getPrefix().length, message.cleanContent.length)
        return messageContent.split(' ');
    }
}
