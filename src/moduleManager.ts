import * as fs from 'fs'
import * as path from 'path'

import { Bot } from './bot'
import { CommandInterface } from './typedefs'

export class ModuleManager {

    private _parentBot: Bot;
    private _command_directory: string;
    private _commandLookupTable: Map<string, CommandInterface> = new Map<string, CommandInterface>();

    constructor(parentBot: Bot, command_directory: string) {
        this._command_directory = command_directory
        this._parentBot = parentBot;
    }

    public async getListOfLoadedCommands() {
        var toReturn: string[] = [];
        await this._commandLookupTable.forEach(async (command, key) => {
            toReturn.push(key)
        });
        return toReturn;
    }

    public async fetchCommand(commandName: string): Promise<CommandInterface> {
        var success:Boolean = false;

        return new Promise(async (resolve, reject) => {
            this._commandLookupTable.forEach((command, key) => {
                if (key == commandName) {
                    success = true;
                    resolve(command);
                } 
            });
            if (!success) {
                this._parentBot.getLogger().error("A non-existing command name was passed from the messageHandler to the moduleManager!");
                reject();
            }
        });

        
    }

    public async loadModules(){
        var listOfCommandFilePaths = this.walk(this.getFullPathFromString(this._command_directory));

        await listOfCommandFilePaths.forEach(async (file) => {

            const module = await import(file);
            const command = new module.default() as CommandInterface;

            this._commandLookupTable.set(command.constructor.name.toLowerCase(), command);
        });

    }

    private getFullPathFromString(toConvert: string): string {
        return path.resolve(process.cwd(), toConvert)
    }

    private walk = (dir: string) => {
        var results: string[] = [];
        var list: string[] = fs.readdirSync(dir);
        list.forEach((file) => {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) { 
                /* Recurse into a subdirectory */
                results = results.concat(this.walk(file));
            } else { 
                let fileName: string[] = file.split('.');
                if (fileName.pop() === 'js') {
                    /* Is a JS file. */
                    results.push(file);
                }
            }
        });
        return results;
    }
}

    

    