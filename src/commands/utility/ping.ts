import { SlashCommandBuilder } from 'discord.js';

import type { Bot } from '@/bot';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(bot: Bot, interaction: any) {
    await interaction.reply('Pong!');
  },
};
