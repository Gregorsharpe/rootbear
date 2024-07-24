import type { CommandInteractionOption } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';

import type { Bot } from '@/bot';

export default {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Choose between the options provided.')
    .addStringOption((option) =>
      option
        .setName('choices')
        .setDescription('<thing1> <thing2> .. <thingX>')
        .setRequired(true),
    ),
  async execute(bot: Bot, interaction: any) {
    const options: CommandInteractionOption[] = [...interaction.options.data];
    const choices: string | undefined = options.find(
      (o) => o.name === 'choices',
    )?.value as string;

    const listOfChoices = choices.split(/[\s,]+/); // Spaces or commas.

    if (listOfChoices.length === 1) {
      await interaction.reply(`Tough call, but I'd pick ${listOfChoices[0]}.`);
    } else {
      const choice =
        listOfChoices[Math.floor(Math.random() * listOfChoices.length)];
      await interaction.reply(`I'd pick ${choice}.`);
    }
  },
};
