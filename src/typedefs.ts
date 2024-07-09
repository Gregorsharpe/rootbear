import type { SlashCommandBuilder } from 'discord.js';

import type { Bot } from './bot';

export interface BotConfig {
  CLIENT_ID: string | undefined;
  TOKEN: string | undefined;
  VERSION: string | undefined;
  TEST_SERVER_ID: string | undefined;
}

export interface CommandDefinition {
  data: SlashCommandBuilder;
  execute(bot: Bot, interaction: any): void;
}
