import {
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';

import type { Bot } from '@/bot';
import { ACTIONS, request } from '@/util/7daysTelnet';

enum SUBCOMMAND {
  OPEN = 'open',
  CLOSE = 'close',
  STATUS = 'status',
}

export default {
  data: new SlashCommandBuilder()
    .setName('7days')
    .setDescription(
      'Open, close, and view status of the connected 7d2d server.',
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName(SUBCOMMAND.CLOSE)
        .setDescription('Close the server, preventing players from joining.'),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName(SUBCOMMAND.OPEN)
        .setDescription('Open the server, allowing players to join.'),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName(SUBCOMMAND.STATUS)
        .setDescription('Determine the current status of the server.'),
    ),
  async execute(bot: Bot, interaction: any) {
    const { options } = interaction;
    const userID = interaction.user.id;
    const subcommand = options.getSubcommand();

    const authorizedUsers = bot.getConfig().SEVEN_DAYS_ADMINS.split(',');

    if (
      (subcommand === SUBCOMMAND.CLOSE || subcommand === SUBCOMMAND.OPEN) &&
      !authorizedUsers.includes(userID)
    ) {
      await interaction.reply(`You do not have access to this command.`);
    } else if (subcommand === SUBCOMMAND.CLOSE) {
      request(bot, ACTIONS.CLOSE).then((result) => {
        request(bot, ACTIONS.KICKALL).then(() => {
          interaction.reply(result);
        });
      });
    } else if (subcommand === SUBCOMMAND.OPEN) {
      request(bot, ACTIONS.OPEN).then((result) => interaction.reply(result));
    } else if (subcommand === SUBCOMMAND.STATUS) {
      Promise.all([
        request(bot, ACTIONS.STATUS),
        request(bot, ACTIONS.PLAYERS),
        request(bot, ACTIONS.CONFIG),
        request(bot, ACTIONS.STATS),
        request(bot, ACTIONS.TIME),
      ]).then((responses) => {
        const data: any = {};
        responses.forEach((response: any) => {
          Object.keys(response).forEach((k: string) => {
            data[k] = response[k];
          });
        });

        const embedResult = new EmbedBuilder()
          .setColor('DarkGreen')
          .setTitle(data.gamePref.ServerName)
          .setDescription(data.gamePref.ServerDescription)
          .setThumbnail(
            'https://7daystodie.com/wp-content/uploads/2016/04/cropped-7dtd_site_icon-32x32.png',
          )
          .addFields(
            {
              name: 'Status',
              value: data.status.charAt(0).toUpperCase() + data.status.slice(1),
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
            {
              name: 'Players',
              value: `${data.playersOnline}/${data.gamePref.ServerMaxPlayerCount}`,
              inline: true,
            },
          )
          .addFields(
            {
              name: 'Time',
              value: `Day ${data.day} - ${data.time}`,
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
            {
              name: 'Horde Night',
              value: `Day ${data.gameStats.BloodMoonDay} (${parseInt(data.gameStats.BloodMoonDay, 10) - parseInt(data.day, 10)} days remain)`,
              inline: true,
            },
          )
          .addFields({ name: '\u200B', value: '\u200B', inline: false })
          .setTimestamp()
          .setFooter({
            text: 'Maintained by @Waveformal',
          });
        interaction.reply({ embeds: [embedResult] });
      });
    } else {
      interaction.reply(
        'Attempted to process invalid subcommand, something is VERY wrong.',
      );
    }
  },
};
