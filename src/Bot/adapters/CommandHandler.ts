import { SlashCommandCallable } from '../../shared/intraestructure/SlashCommandCallable.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client, ChatInputCommandInteraction } from 'discord.js';
import { Commands } from '../../shared/intraestructure/Container.js';
import { logger } from '../../shared/utils/logger.js';

export class CommandHandler {
  private commands: SlashCommandCallable[]
  private client: Client;
  private token: string;

  constructor({client, token}: {client:Client, token: string}) {
    this.token = token;
    this.client = client;

    this.commands = Commands;
  }

  async registerCommands(guildId: string): Promise<void> {
      const commands = this.commands.map(command => (command.toJSON()));

      try {
        await this.register({commands: commands, guildId: guildId});
        logger.info('Successfully registered commands.');
        
      } catch (error) {
        logger.warn(error);
      }
  }

  async deleteAllGlobalCommands(): Promise<void> {
    const rest = new REST({ version: '10' }).setToken(this.token);
  
    try {
      await rest.put(Routes.applicationGuildCommands(this.client.user!.id, "1133581281523945553"), { body: [] });
      console.log('Deleted all global commands.');
    } catch (error) {
      console.error('Error deleting global commands:', error);
    }
  }

  async register ({commands, guildId}: {commands: Record<string, any>[], guildId?: string}): Promise<unknown> {
    const rest = new REST({ version: '10' }).setToken(this.token);
    let route;

    if (guildId) {
      route = Routes.applicationGuildCommands(this.client.user!.id, guildId);
    } 
    else {
      route = Routes.applicationCommands(this.client.user!.id);
    }
    
    return await rest.put(route, { body: commands});
  }

  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = this.commands.find(cmd => cmd.name === interaction.commandName);
    if (command) {
      await command.execute(interaction);
    }
  }
}