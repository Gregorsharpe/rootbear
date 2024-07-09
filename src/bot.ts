import type { Interaction } from 'discord.js';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import type { Logger } from 'log4js';
import { getLogger } from 'log4js';

import { interactionHandler } from '@/interactionHandler';
import type { BotConfig } from '@/typedefs';
import { deployCommands, loadCommands } from '@/util/commandManagement';
import { isValidString } from '@/util/helpers';

export class Bot {
  private config!: BotConfig;

  private client!: Client;

  private commands!: Collection<any, any>;

  private logger!: Logger;

  constructor(config: BotConfig) {
    this.config = config;
    this.logger = getLogger('Bot');
    this.logger.level = 'ALL';
    this.commands = new Collection();
  }

  public start() {
    // Ensure the provided config is valid.
    if (!isValidString(this.config?.CLIENT_ID))
      throw new Error(`Unable to parse CLIENT_ID: ${this.config.CLIENT_ID}`);
    if (!isValidString(this.config?.TOKEN))
      throw new Error(`Unable to parse TOKEN: ${this.config.TOKEN}`);
    if (!isValidString(this.config?.VERSION))
      throw new Error(`Unable to parse VERSION: ${this.config.VERSION}`);

    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.commands = loadCommands(this.logger);

    this.client.once(Events.ClientReady, (readyClient) => {
      this.logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
      if (isValidString(this.config.TEST_SERVER_ID)) {
        deployCommands(this.logger, this.config, this.commands);
      }
    });

    this.client.login(this.config.TOKEN).catch((error) => {
      this.logger.error(error);
    });

    this.client.on(Events.InteractionCreate, async (interaction: Interaction) =>
      interactionHandler(this, interaction, this.commands),
    );
  }

  public getVersion() {
    return this.config.VERSION;
  }

  public getLogger() {
    return this.logger;
  }

  public getCommands() {
    return this.commands;
  }
}
