import { Collection, REST, Routes } from 'discord.js';
import type { Logger } from 'log4js';

import type { BotConfig, CommandDefinition } from '@/typedefs';

const fs = require('node:fs');
const path = require('node:path');

export function loadCommands(logger: Logger): Collection<any, any> {
  const foldersPath = path.join(__dirname, '../commands');
  const commandFolders = fs.readdirSync(foldersPath);
  const commands: Collection<any, any> = new Collection();

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file: any) => file.endsWith('.ts'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      let commandFile: any;
      try {
        // Necessary to allow dynamic importing of commands, which is the entire point.
        // eslint-disable-next-line import/no-dynamic-require, global-require
        commandFile = require(filePath);
      } catch (e) {
        logger.error(`Failed to load command module at \`${filePath}\`: ${e}`);
      }
      const command: CommandDefinition = commandFile.default;
      if (command && 'data' in command && 'execute' in command) {
        commands.set(command.data.name, command);
      } else {
        logger.warn(
          `The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }
  logger.info(
    `Loaded ${commands.size} commands: ${commands.map((c) => c.data.name).join(', ')}`,
  );
  return commands;
}

export function deployCommands(
  logger: Logger,
  config: BotConfig,
  commands: Collection<any, any>,
  global: boolean = false,
): void {
  const rest = new REST().setToken(config.TOKEN);
  // Update endpoint expects a list of JSON ojbects.
  const commandList: any[] = Array.from(commands.values()).map((c) =>
    c.data.toJSON(),
  );

  (async () => {
    try {
      logger.info(
        `Started refreshing ${commandList.length} application (/) commands.`,
      );

      let data: any;
      if (global) {
        // Global refresh, can take up to an hour to propagate.
        data = await rest.put(Routes.applicationCommands(config.CLIENT_ID), {
          body: commandList,
        });
      } else {
        // Refreshing the test guild is nearly instant.
        data = await rest.put(
          Routes.applicationGuildCommands(
            config.CLIENT_ID,
            config.TEST_SERVER_ID,
          ),
          { body: commandList },
        );
      }

      logger.info(
        `Successfully reloaded ${data.length} application (/) commands ${global ? 'globally' : 'on the dev server'}.`,
      );
    } catch (error) {
      logger.error(`Error deploying commands: ${error}`);
    }
  })();
}
