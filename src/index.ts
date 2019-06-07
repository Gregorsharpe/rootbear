import { Bot } from './bot';
import { BotConfig } from './typedefs'

let configFile = require('./../config/bot-config.json');

new Bot().start(configFile)