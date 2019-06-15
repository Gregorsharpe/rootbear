import { Bot } from './bot';
import { BotConfig } from './typedefs'

/*
    The first file executed when the project starts, serves
    exclusively as a stub to pull in the config file and
    start up an instance of the bot.
*/

let configFile = require('./../config/bot-config.json') as BotConfig;

new Bot(configFile).start()
