import { getLogger } from 'log4js';

import { Bot } from '@/bot';
import { getEnvFile } from '@/util/helpers';

import type { BotConfig } from './typedefs';
import { deployCommands, loadCommands } from './util/commandManagement';

const { env } = process;
const config: BotConfig = getEnvFile();

// Replace .env values with system env values if they exist.
if ('CLIENT_ID' in env) config.CLIENT_ID = env.CLIENT_ID;
if ('TOKEN' in env) config.TOKEN = env.TOKEN;
if ('VERSION' in env) config.VERSION = env.VERSION;
if ('TEST_SERVER_ID' in env) config.TEST_SERVER_ID = env.TEST_SERVER_ID;

if ('SEVEN_DAYS_TELNET_SERVER_ADDRESS' in env)
  config.SEVEN_DAYS_TELNET_SERVER_ADDRESS =
    env.SEVEN_DAYS_TELNET_SERVER_ADDRESS;
if ('SEVEN_DAYS_TELNET_PORT' in env)
  config.SEVEN_DAYS_TELNET_PORT = env.SEVEN_DAYS_TELNET_PORT;
if ('SEVEN_DAYS_TELNET_PASSWORD' in env)
  config.SEVEN_DAYS_TELNET_PASSWORD = env.SEVEN_DAYS_TELNET_PASSWORD;
if ('SEVEN_DAYS_ADMINS' in env)
  config.SEVEN_DAYS_ADMINS = env.SEVEN_DAYS_ADMINS;
if (process.argv[2] === '--publishCommands') {
  const logger = getLogger('PUBLISH');
  logger.level = 'ALL';
  logger.info('Publish commands mode, the bot will not be started.');
  const commands = loadCommands(logger);
  deployCommands(logger, config, commands, true);
} else {
  new Bot(config).start();
}
