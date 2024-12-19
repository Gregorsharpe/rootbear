import net from 'net';

import type { Bot } from '@/bot';

const STEAM_ID = 'steam_76561198034649430';

export interface Properties {
  [key: string]: string;
}

export enum ACTIONS {
  STATUS,
  PLAYERS,
  CONFIG,
  STATS,
  TIME,
  OPEN,
  CLOSE,
  KICKALL,
}

export const request = async (bot: Bot, action: ACTIONS) => {
  const config = bot.getConfig();
  const client = new net.Socket();
  let waitingForResponse = false;

  client.connect(
    parseInt(config.SEVEN_DAYS_TELNET_PORT, 10),
    config.SEVEN_DAYS_TELNET_SERVER_ADDRESS,
    () => {},
  );

  const responseHandler = (
    data: any,
    command: string,
    callback: Function,
    resolve: Function,
    reject: Function,
  ) => {
    const response = data
      .toString()
      .replaceAll('\u0000', '')
      .replaceAll('\\u0000', '');
    const responseLines = response
      .split(/\r?\n/)
      .filter((s: string) => s !== '');
    if (response === 'Please enter password:') {
      client.write(`${config.SEVEN_DAYS_TELNET_PASSWORD}\r\n`);
    } else if (responseLines.length > 0) {
      if (waitingForResponse) {
        callback(responseLines, resolve, reject);
      } else if (
        responseLines.includes(
          "Press 'help' to get a list of all commands. Press 'exit' to end session.",
        )
      ) {
        waitingForResponse = true;
        client.write(`${command}\r\n`);
      }
    }
  };

  const actionWrapper = async (command: string, callback: Function) => {
    return new Promise((resolve, reject) => {
      client.on('data', (data) => {
        try {
          responseHandler(data, command, callback, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
  };

  if (action === ACTIONS.STATUS) {
    return actionWrapper(
      'whitelist list',
      (responseLines: string[], resolve: Function, _: Function) => {
        if (responseLines.includes('Whitelist only mode active.')) {
          resolve({ status: 'closed' });
          client.destroy();
        } else if (
          responseLines.includes(
            'No users or groups on whitelist, whitelist only mode not enabled.',
          )
        ) {
          resolve({ status: 'open' });
          client.destroy();
        }
      },
    );
  }

  if (action === ACTIONS.PLAYERS) {
    return actionWrapper(
      'listplayers',
      (responseLines: string[], resolve: Function, _: Function) => {
        responseLines.forEach((line) => {
          if (line.includes('in the game')) {
            client.destroy();
            resolve({
              playersOnline: line
                .replace('Total of ', '')
                .replace(' in the game', ''),
            });
          }
        });
      },
    );
  }

  if (action === ACTIONS.CONFIG) {
    const props: Properties = {};
    return actionWrapper(
      'getgamepref',
      (responseLines: string[], resolve: Function, _: Function) => {
        responseLines.forEach((line) => {
          const firstSplit = line.split('.');
          if (firstSplit.length === 2) {
            const [key, value] = firstSplit[1].split('=');
            if (value !== undefined) {
              props[key.trim()] = value.trim();
              if (line.includes('GamePref.ServerMaxPlayerCount')) {
                client.destroy();
                resolve({ gamePref: props });
              }
            }
          }
        });
      },
    );
  }

  if (action === ACTIONS.STATS) {
    const props: Properties = {};
    return actionWrapper(
      'getgamestat',
      (responseLines: string[], resolve: Function, _: Function) => {
        responseLines.forEach((line) => {
          const firstSplit = line.split('.');
          if (firstSplit.length === 2) {
            const [key, value] = firstSplit[1].split('=');
            if (value !== undefined) {
              props[key.trim()] = value.trim();
              if (line.includes('GameStat.BloodMoonDay')) {
                client.destroy();
                resolve({ gameStats: props });
              }
            }
          }
        });
      },
    );
  }

  if (action === ACTIONS.TIME) {
    return actionWrapper(
      'gettime gt',
      (responseLines: string[], resolve: Function, _: Function) => {
        responseLines.forEach((line) => {
          if (line.includes('Day')) {
            client.destroy();
            const [day, time] = line
              .replace('Day ', '')
              .replace(/\s/g, '')
              .split(',');
            resolve({ day, time });
          }
        });
      },
    );
  }

  if (action === ACTIONS.OPEN) {
    return actionWrapper(
      `whitelist remove ${STEAM_ID}`,
      (responseLines: string[], resolve: Function, _: Function) => {
        if (responseLines.includes('Whitelist only mode has been DISABLED!')) {
          resolve('Server has been opened.');
          client.destroy();
        }
      },
    );
  }
  if (action === ACTIONS.CLOSE) {
    return actionWrapper(
      `whitelist add ${STEAM_ID} LOCK`,
      (responseLines: string[], resolve: Function, _: Function) => {
        if (responseLines.includes('Whitelist only mode has been ACTIVATED!')) {
          resolve('Server has been closed.');
          client.destroy();
        }
      },
    );
  }
  if (action === ACTIONS.KICKALL) {
    return actionWrapper(
      `kickall Server_has_been_closed.`,
      (responseLines: string[], resolve: Function, _: Function) => {
        resolve(true);
        client.destroy();
      },
    );
  }
  return Promise.reject(
    new Error('Unexpected error occured while trying to contact the server.'),
  );
};
