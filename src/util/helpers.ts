import { getLogger } from 'log4js';

import type { BotConfig } from '@/typedefs';
import fs = require('node:fs');

export function getEnvFile(): BotConfig {
  const logger = getLogger('ENV Startup');
  logger.level = 'ALL';
  try {
    const data = fs.readFileSync('.env', 'utf8');
    logger.info('.env found, loading it.');
    const envFile = JSON.parse(data);
    return {
      CLIENT_ID: envFile.CLIENT_ID,
      TOKEN: envFile.TOKEN,
      VERSION: envFile.VERSION,
      TEST_SERVER_ID: envFile.TEST_SERVER_ID,

      SEVEN_DAYS_TELNET_SERVER_ADDRESS:
        envFile.SEVEN_DAYS_TELNET_SERVER_ADDRESS,
      SEVEN_DAYS_TELNET_PORT: envFile.SEVEN_DAYS_TELNET_PORT,
      SEVEN_DAYS_TELNET_PASSWORD: envFile.SEVEN_DAYS_TELNET_PASSWORD,
      SEVEN_DAYS_ADMINS: envFile.SEVEN_DAYS_ADMINS,
    };
  } catch (err: any) {
    if (!err.message.includes('no such file or directory')) {
      logger.error('Failed to load .env file: ', err);
      process.exit(1);
    }
    return {
      CLIENT_ID: undefined,
      TOKEN: undefined,
      VERSION: undefined,
      TEST_SERVER_ID: undefined,

      SEVEN_DAYS_TELNET_SERVER_ADDRESS: undefined,
      SEVEN_DAYS_TELNET_PORT: undefined,
      SEVEN_DAYS_TELNET_PASSWORD: undefined,
      SEVEN_DAYS_ADMINS: undefined,
    };
  }
}

export function isValidString(s: any): boolean {
  return s !== null && s !== undefined && typeof s === 'string' && s.length > 0;
}
