import * as Discord from 'discord.js'

import { BotConfig } from './typedefs'

export class Bot {

    private _client: Discord.Client;
    private _config: BotConfig;

    public start(config: BotConfig) {
        this._client = new Discord.Client;
        this._config = config;
    
        // Handles all Bot init and startup.
        this._client.on('ready', () => {
            console.log(`Logged in as ${this._client.user.tag}!`);
        });
    
        // Callback for message handler.
        this._client.on('message', async (message) => {
            // Ensure we never reply to ourselves.
            if (message.author.id !== this._client.user.id) {
                if (message.cleanContent == "ping") {
                    message.reply("pong!");
                }
            }
        });
    
        this._client.login(this._config.token);
    }

}

