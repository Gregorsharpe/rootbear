import * as Discord from 'discord.js'

import { Bot } from '../../bot'
import { CommandInterface } from '../../typedefs'

export default class Help implements CommandInterface {

    public help(): {elevatorPitch:string, description: string} {
        return {
            elevatorPitch: "Show the help dialog.",
            description: `Display all commands, or help <command> for more detailed info.`
        }
    }

    public process(bot: Bot, message: Discord.Message) {
        this.getHelp(bot.getHandler().dissectMessaageContent(message)[1], bot).then(result => {
            message.reply(result);
        })
    }

    private async getHelp(command: string = "all", bot: Bot): Promise<string> {

        let moduleManager = bot.getHandler().getModuleManager();

        return new Promise<string>(async (resolve, reject) => {
            if (command == "all") {
                /* In order to line up the descriptor parts of each help line, we pad by the longest command name length.
                   +2 for the whitespace break that denotes a Module vs Command.
                   +1 so there's always at least one space between the end of a command and the hyphen. */
                let helpPadding: number = moduleManager.getLongestCommandNameLength() + 2 + 1;

                var helpString: string = "```\n";
                var remainingCounter: number = (await moduleManager.getListOfLoadedCommands()).length;

                moduleManager.getCommandLookupTable().then(result => {
                    result.forEach((commandModule, commandModuleKey) => {
                        helpString = helpString + commandModuleKey + ':\n';
    
                        commandModule.forEach((command, commandKey) => {
                            helpString = helpString + this.prettyPrintCommandSignature(command, helpPadding);
                            remainingCounter = remainingCounter - 1;
    
                            if (remainingCounter == 0) {
                                helpString = helpString + "```";
                                resolve(helpString);
                            }
                        });
                    });
                });
            }
            else {
                let flattenedTable: Map<string, CommandInterface> = await this.getFlatCommandLookupTable(bot);
                if (flattenedTable.has(command)) {
                    moduleManager.fetchCommand(command).then( result => {
                        resolve(result.help().description);
                    });
                }
                else {
                    resolve("I couldn't find a command matching: `" + command + "`");
                }
            }
        });
    }

    private prettyPrintCommandSignature(command: CommandInterface, padding: number) {
        return this.padStringToSize(command.constructor.name, padding, " ") + " - " + command.help().elevatorPitch + '\n';
    }

    private async getFlatCommandLookupTable(bot: Bot) {
        var flattenedTable: Map<string, CommandInterface> = new Map<string, CommandInterface>();
        var commandLookupTable: Map<string, Map<string, CommandInterface>> = await bot.getHandler().getModuleManager().getCommandLookupTable();
        
        commandLookupTable.forEach((commandModule, commandModuleKey) => {
            commandModule.forEach((command, commandKey) => {
                flattenedTable.set(commandKey, command);
            });
        });
        return flattenedTable;
    }

    private padStringToSize(input: string, desiredLength: number, paddingCharacter: string) {
        if (input.length >= desiredLength) return input;
        return input + paddingCharacter.repeat(desiredLength - input.length)
    }
}