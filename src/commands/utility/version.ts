import { SlashCommandBuilder } from 'discord.js';

import type { Bot } from '@/bot';

export default {
  data: new SlashCommandBuilder()
    .setName('version')
    .setDescription('Get the current version of the bot.'),
  async execute(bot: Bot, interaction: any) {
    await interaction.reply(`Running v${bot.getVersion()}`);
  },
};
