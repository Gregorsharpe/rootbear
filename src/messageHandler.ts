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
            let secondWord: string = "all";

            if (firstWord == "help") {

                if (spaceDelimitedMessage.length > 1) secondWord = spaceDelimitedMessage[1].toLowerCase();

                this._moduleManager.getHelp(secondWord).then( result => {
                    message.reply(result);
                });
                
            }

            else if (this.existsInCommands(firstWord)) {
                this._moduleManager.fetchCommand(firstWord).then( result => {
                    message.reply(result.process(message));
                });
            }
        }
    }

    private async init() {
        await this._moduleManager.loadModules();

        this._parentBot.getLogger().info("---------------------------------");
        this._parentBot.getLogger().info("Loading commands...");

        this._moduleManager.getTreeOfLoadedCommands().then( commandModuleTree => {
            commandModuleTree.forEach((commandModule, commandModuleKey) => {
                var listOfCommandsByModule: string[] = [];
                commandModule.forEach((command, commandKey) => {
                    listOfCommandsByModule.push(commandKey);
                });
                this._parentBot.getLogger().info("Loaded " + listOfCommandsByModule.length + " from " + commandModuleKey + ": " + listOfCommandsByModule.join(", "));
            });
        });

        this._moduleManager.getListOfLoadedCommands().then( result => {
            this._commandList = result;
            this._parentBot.getLogger().info("---------------------------------");
            this._parentBot.getLogger().info("Loaded " + this._commandList.length + " commands in total!");
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
