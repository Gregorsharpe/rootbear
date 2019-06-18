import * as Discord from 'discord.js'
import * as Log4js from 'log4js'

import { Bot } from './bot'
import { MessageHandlerInterface } from './typedefs'
import { ModuleManager } from './moduleManager'

export class MessageHandler implements MessageHandlerInterface {

    private _parentBot: Bot;
    private _logger!: Log4js.Logger
    private _moduleManager: ModuleManager;
    private _commandList: string[] = [];

    constructor(parentBot: Bot) {
        this._parentBot = parentBot;
        this._logger = parentBot.getLogger();
        this._moduleManager = new ModuleManager(this._parentBot, './dist/command_modules/');
        this.init()
    }


    // Contains a built-in definition for the 'help' command, otherwise passing the desired 
    // command name to the module manager and getting back a CommandInterface.

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
                    result.process(this._parentBot, message);
                });
            }
        }
    }

    // Init the module manager so we can start making requests to it. Also provides pretty results to console.
    private async init() {
        await this._moduleManager.loadModules();

        this._logger.info("---------------------------------");
        this._logger.info("Loading commands...");

        this._moduleManager.getTreeOfLoadedCommands().then( commandModuleTree => {
            commandModuleTree.forEach((commandModule, commandModuleKey) => {
                var listOfCommandsByModule: string[] = [];
                commandModule.forEach((command, commandKey) => {
                    listOfCommandsByModule.push(commandKey);
                });
                this._logger.info("Loaded " + listOfCommandsByModule.length + " from " + commandModuleKey + ": " + listOfCommandsByModule.join(", "));
            });
        });

        this._moduleManager.getListOfLoadedCommands().then( result => {
            this._commandList = result;
            this._logger.info("---------------------------------");
            this._logger.info("Loaded " + this._commandList.length + " commands in total!");
        });
    }

    // Ensure the ID of a Discord user does not match the bot's ID. 
    private itWasntMe(author: Discord.User): Boolean {
        return (author.id !== this._parentBot.getClient().user.id);
    }

    private matchesPrefix(message: Discord.Message): Boolean {
        return message.cleanContent.charAt(0) == this._parentBot.getPrefix();
    }
    
    private existsInCommands(toCheck: string): Boolean {
        return this._commandList.indexOf(toCheck) > -1
    }

    // Turns a single-string Message into a list of words that was tokenized on spaces.
    public dissectMessaageContent(message: Discord.Message): string[] {
        let messageContent: string = message.cleanContent;

        // Strip the prefix and split on spaces.
        messageContent = messageContent.slice(this._parentBot.getPrefix().length, message.cleanContent.length)
        return messageContent.split(' ');
    }
}
