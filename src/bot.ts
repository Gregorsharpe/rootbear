import * as Discord from 'discord.js'
import * as Log4js from 'log4js'

import { BotConfig } from './typedefs'

export class Bot {

    private _config: BotConfig | undefined;
    private _client!: Discord.Client;
    private _logger!: Log4js.Logger

    constructor(config: BotConfig) {
        this._config = config;

        this._logger = Log4js.getLogger('Bot');
        this._logger.level = 'debug';
    }

    public start() {

        // Ensure the provided config is valid.
        if (!this._config || !this._config.token) { throw new Error('Config invalid, unable to start!'); }

        this._client = new Discord.Client;

        // Handles all Bot init and startup.
        this._client.on('ready', () => {
            this._logger.info(`Logged in as ${this._client.user.tag}.`);
        });
    
        // Callback for message handler.
        this._client.on('message', async (message) => {
            // Ensure we never reply to ourselves.
            if (message.author.id !== this._client.user.id) {
                if (message.cleanContent == "ping") {
                    message.reply("pong");
                }
            }
        });
    
        this._client.login(this._config.token);
    }

}

