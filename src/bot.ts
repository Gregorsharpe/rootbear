import * as Discord from 'discord.js'
import * as Log4js from 'log4js'

import { BotConfig } from './typedefs'
import { MessageHandler } from './messageHandler'

export class Bot {

    private _config: BotConfig | undefined;
    private _prefix!: String;
    private _botToken!: string | undefined;
    private _version!: String;
    private _client!: Discord.Client;
    private _logger!: Log4js.Logger
    private _handler!: MessageHandler

    constructor(config: BotConfig) {
        this._config = config;

        this._logger = Log4js.getLogger('Bot');
        this._logger.level = 'debug';

        this._handler = new MessageHandler(this);
    }

    public start() {

        // Ensure the provided config is valid.
        if (!this._config || !this._config.prefix || !this._config.version) { throw new Error('Config invalid, unable to start!'); }

        this._client = new Discord.Client;
        this._prefix = this._config.prefix;
        this._version = this._config.version;
        this._botToken = process.env.botToken;

        // Ensure a token has been provided.
        if (!this._botToken) { throw new Error('Bot Token not found, unable to start!'); }

        // Handles all Bot init and startup.
        this._client.on('ready', () => {
            this._logger.info(`Logged in as ${this._client.user.tag}.`);
        });
    
        // Callback for message handler.
        this._client.on('message', async (message) => {
            this._handler.handleMessage(message)
        });

        this._client.login(this._botToken).catch(reason => {
            this._logger.info(reason);
        });
    }

    public getClient() {
        return this._client;
    }

    public getLogger() {
        return this._logger;
    }

    public getPrefix() {
        return this._prefix;
    }

    public getUsername() {
        return this.getClient().user.username;
    }

    public getVersion() {
        return this._version;
    }

}

