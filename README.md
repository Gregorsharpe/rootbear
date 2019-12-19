# rootbear

A modular Discord companion that is being constructed with the goals of providing a platform for general server utility, entertainment and skill growth as a programmer.

## How can I run this bot?

Rootbear is primarily written in Typescript, and packaged inside a Docker container. The exact process for spinning up a rootbear-docker container will be detailed here once the project has exited the alpha stages.

## What is left to do?

### _General TODO_

- Should help commands have the ability to detect improper arguments and reply with a guide on how to use the command? If so, that should probably be a separate field on the command interface. The prefix could be appended at print time.
  
- Figure out how to persist volatile storage. Storing JSON to disk, REDIS docker container?

- Interactions with other bots.

- Work with someone to map out environment setup for a contributor.

- Improve this README.

- Build proper docker containers and deploy them on a server.

### _Commands currently implemented_:

* 'General'

	  * **Ping** - Checks if rootbear is alive, should return with a "Pong!"
	  * **Choose** - Randomly select one answer from 1 - x given options. (If 0-1 are given, sassy responses are mandatory.)
	  * **Roll** - Roll an X sided die, defaults to 100. User can provide max input for one or more dice. "roll 20 40 6" might return [10] [36] [1]
	  * **Version** - Returns the bot's internal version number, mostly used for debugging.
	  * **Flip** - Flip a coin, or a user. Special interaction for flipping the bot, more possibly required for owners / admins, etc.

### _Commands remaining to be implemented_:

*  'General'  - (Things featured on most bots.)

	  * **RPS** - Not used often, but could be a candidate for interacting with other bots.
	  * **Hug** - Potentially a combination of hug, love, and similar commands. Lots of happy and reassuring responses required. Positive affirmations?
	  * **Userinfo** - Fetch any interesting information from the discord.js User datatype.
	  * **Serverinfo** - Same as the above, but for server.

* 'Generic' -  Previously an 'addon' module for rootbear.

	* **Insult** - Pulls random words from lists defined in local config and joins them together to create insults. The lists themselves are totally custom and the creativity / severity of the insults vary entirely depending on who populates the lists.
	* **What's new / Changelogs** - Pull the last X (default 10) updates to the bot and display them. Previously a text file of changes was maintained, but it'd be much more interesting to pull directly from github!
	* **Wipeslate / Clear** - Removes your last X messages.
	*  **Topic** - Allows users to set channel topics even if they don't have admin permissions. This is useful for providing programmatic control over what sorts of topics can be set, and a blacklist can be implemented to stifle those who abuse their newfound power.
	* **Watch / Alert** - Previously allowed a user to set a watchdog on another player's rich-presence status, and recieve a DM when it changed. Was originally supposed to make lining up schedules for games easier, but it probably needs to be workshopped for both usage and use cases.
  
* 'League of Legends' - Module containing all commands to do with the MOBA by Riot Games.

	* At a base level, this module will first require a number of data sources to be investigated and pulled in. The most prominent of these would be the Riot API itself, along with any secondary APIs deemed useful. These APIs should have their own interface layers to abstract the implementation of each API from the League module itself, allowing any rewrites due to API changes to be restricted to the respective interface.
	* The Discord account-linking functionality would be leveraged to get a user's summoner name to be used as their API lookup. A number of data structures from the Riot API may also need to be modeled if the state is similar to the last time this was attempted.
	* Getting the state of a summoner's game, and checking to see if they're playing with anyone from the server could be useful.
	* Calculating reccomended bans could be useful. It could be a composite result pulled from highest winrate champions and the user's match history along with any other datapoints available.
	* Something similar to the above, but instead attempting to determine a user's best champions.
    * Given that only a subset of the dev server cares about League and fewer still care about ranked, at the current time no leaderboards / rank features will be implemented.

* 'Owner' - Commands relating exclusively to the management of the bot itself.

	* **WhatIsMyIP** - Less related to server management, but sits at an owner level as a backup for dynamic IP and DNS issues.
	* **Prefix** - Change the bot's prefix from discord rather than modifying it directly.
	* **Nickname** - Change the bot's nickname.
	* **Status** - Change the bot's status / currently played game.
	* **Contact** - Send a message to the owner.
	* **BotInfo**- Git repo,botversion,      other dev info.
	* **Uptime** - Uptime.

	* Server management? Joining, listing and leaving servers via commands?
	* Currently I don't see any benefit to modifying the list of loaded commands through add/remove/update, but it could become useful in the future so this will serve as a stub reminder.
	

### _Further ideas for interactions_:

* Create music / youtube / soundcloud integration for the bot.

* Alias subsystem, allowing users to define their own aliases / macros on existing commands. Take the 'choice' command, and predefine arguments for it under the name "PickShacoSkin" or something along those lines. Store in JSON or REDIS?

* Permission levels within the bot for managing more sensitive commands? 
	* Adding, removing and modifying permission levels on a per user basis. Commands would need to be updated with a 'permission' property that defaulted to a value, and could be manually set to only respond to users with proper access.
	* An admin mode / version of wipeslate for cleaning up user spam.
	* Primary server management features including kick, ban, mute and the like will not be implemented, as Discord admins already have simpler ways to perform those tasks.

- Poll subsystem? Will people actually use it? (Consider slackbot-like poll using 'reaction' emojis as responses. Have the bot put one point in each, then count the first choice from each user? Or invalidate multi-choice users.

- Economy system involving daily coin increases, the ability to gamble with them, wager, leaderboards, etc.
