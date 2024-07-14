import type {
  ChatInputCommandInteraction,
  CommandInteractionOption,
} from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';

import type { Bot } from '@/bot';

export default {
  data: new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Flip a coin, or more than one!')
    .addIntegerOption((option) =>
      option.setName('coins').setDescription('The number of coins to flip.'),
    )
    .addUserOption((option) => option.setName('user').setDescription('?!?')),
  async execute(bot: Bot, interaction: ChatInputCommandInteraction) {
    const options: CommandInteractionOption[] = [...interaction.options.data];
    const numberOfCoins: string | undefined = options.find(
      (o) => o.name === 'coins',
    )?.value as string;
    const targetedUserId: string | undefined = options.find(
      (o) => o.name === 'user',
    )?.value as string;

    if (targetedUserId) {
      const targetedUser =
        await interaction.guild.members.fetch(targetedUserId);
      const targetedUserName =
        targetedUser.user.globalName ?? targetedUser.user.displayName;
      let results: string = '';
      if (interaction.client.user.displayName === targetedUserName) {
        results += "You think you're funny?!\n";
        results = `${results}(╯°□°）╯︵ ${flipString(
          interaction.user.username,
        )}\n`;
      } else {
        results = `${results}(╯°□°）╯︵ ${flipString(
          targetedUserName.toLowerCase(),
        )}\n`;
      }
      await interaction.reply(results);
    } else if (numberOfCoins !== undefined) {
      const results = [];
      for (let i = 0; i < parseInt(numberOfCoins, 10); i += 1) {
        results.push(flipCoin());
      }
      await interaction.reply(results.join(' | '));
    } else {
      await interaction.reply(`${flipCoin()}!`);
    }
  },
};

const flipCoin = (): string => {
  return Math.round(Math.random()) ? 'Heads' : 'Tails';
};

function flipString(aString: string) {
  const flipTable: { [key: string]: string } = {
    a: '\u0250',
    b: 'q',
    c: '\u0254',
    d: 'p',
    e: '\u01DD',
    f: '\u025F',
    g: '\u0183',
    h: '\u0265',
    i: '\u0131',
    j: '\u027E',
    k: '\u029E',
    l: '\u0283',
    m: '\u026F',
    n: 'u',
    r: '\u0279',
    t: '\u0287',
    v: '\u028C',
    w: '\u028D',
    y: '\u028E',
    '.': '\u02D9',
    '[': ']',
    '(': ')',
    '{': '}',
    '?': '\u00BF',
    '!': '\u00A1',
    "'": ',',
    '<': '>',
    _: '\u203E',
    ';': '\u061B',
    '\u203F': '\u2040',
    '\u2045': '\u2046',
    '\u2234': '\u2235',
    '\r': '\n',
  };

  const last = aString.length - 1;
  const result = new Array(aString.length);
  for (let i = last; i >= 0; i -= 1) {
    const c = aString.charAt(i);
    const r = flipTable[c];
    result[last - i] = r !== undefined ? r : c;
  }
  return result.join('');
}
