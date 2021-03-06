import * as fs from 'fs'
import * as path from 'path'
import * as Log4js from 'log4js'

import { Bot } from './bot'
import { CommandInterface } from './typedefs'

export class ModuleManager {

    private _parentBot: Bot;
    private _logger!: Log4js.Logger
    private _command_directory: string;
    private _commandLookupTable: Map<string, Map<string, CommandInterface>> = new Map<string, Map<string, CommandInterface>>();
    private _numLoadedCommands: number = 0;
    private _longestCommandNameLength: number = 0;

    constructor(parentBot: Bot, command_directory: string) {
        this._command_directory = command_directory
        this._parentBot = parentBot;
        this._logger = parentBot.getLogger();
    }

    public async getCommandLookupTable() {
        return this._commandLookupTable;
    }

    public async getListOfLoadedCommands() {
        var toReturn: string[] = [];
        this._commandLookupTable.forEach((commandModule, commandModuleKey) => {
            commandModule.forEach((command, commandKey) => {
                toReturn.push(commandKey);
            });
        });

        return toReturn;
    }

    public async fetchCommand(commandName: string): Promise<CommandInterface> {
        var success:Boolean = false;

        return new Promise<CommandInterface>(async (resolve, reject) => {
            this._commandLookupTable.forEach((commandModule, commandModuleKey) => {
                commandModule.forEach((command, commandKey) => {
                    if (commandKey == commandName) {
                        success = true;
                        resolve(command);
                    } 
                });
            });

            if (!success) {
                this._logger.error("A non-existing command name was passed from the messageHandler to the moduleManager!");
                reject("Something went wrong. Please try again, or contact support.");
            }
        });

    }

    public async loadModules() {
        var listOfCommandFilePaths: Array<SourcedCommand> = this.walk(this.getFullPathFromString(this._command_directory));

        await listOfCommandFilePaths.forEach(async (sourcedCommand) => {

            const commandModule = await import(sourcedCommand.getCommandPath());
            const command = new commandModule.default() as CommandInterface;

            /* Ensure the command's module has been instantiated to avoid calling set on an undefined var. */
            if (this._commandLookupTable.get(sourcedCommand.getCommandModuleName()) == undefined) {
                this._commandLookupTable.set(sourcedCommand.getCommandModuleName(), new Map<string, CommandInterface>());
            }

            let lowercasedCommand: string = command.constructor.name.toLowerCase();
            if (lowercasedCommand.length > this._longestCommandNameLength) this._longestCommandNameLength = lowercasedCommand.length;
            
            /* Populate the currently empty commandLookupTable entry with the name and command reference. */
            this._commandLookupTable.get(sourcedCommand.getCommandModuleName()).set(lowercasedCommand, command);
        });
    }

    private getFullPathFromString(toConvert: string): string {
        return path.resolve(process.cwd(), toConvert)
    }

    private walk = (dir: string, commandModule?: string): Array<SourcedCommand> => {
        var results: Array<SourcedCommand> = [];
        var list: string[] = fs.readdirSync(dir);
        list.forEach((file) => {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) { 
                /* Recurse into a subdirectory */
                results = results.concat(this.walk(file, file.split('/').pop()));
            } else { 
                let fileName: string[] = file.split('.');
                if (fileName.pop() === 'js') {
                    /* Is a JS file. */
                    if (commandModule != undefined) {
                        results.push(new SourcedCommand(commandModule, file));
                        this._numLoadedCommands++;
                    }
                }
            }
        });
        return results;
    }

    public getLongestCommandNameLength() {
        return this._longestCommandNameLength;
    }
}
    
class SourcedCommand {
    private _commandModuleName: string;
    private _commandPath: string;

    constructor(commandModuleName:string, commandPath: string) {
        this._commandModuleName = commandModuleName;
        this._commandPath = commandPath;
    }

    public getCommandModuleName(): string {
        return this._commandModuleName;
    }

    public getCommandPath(): string {
        return this._commandPath;
    }

}
    