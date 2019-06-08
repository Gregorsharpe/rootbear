import { Bot } from './bot';
import { BotConfig } from './typedefs'

let configFile = require('./../config/bot-config.json') as BotConfig;

new Bot(configFile).start()
