import { BaseInteraction, Client, Guild } from 'discord.js'
import { CommandHandler } from './CommandHandler.js';
import { TextChannel } from 'discord.js';
import { logger } from '../../shared/utils/logger.js';
import { Controllers } from '../../shared/intraestructure/Container.js';

interface IProps {
  client: Client
  token: string | undefined
}

export class DiscordAdapter {
    private client: Client;
    private token: string | undefined;
    private commandHandler: CommandHandler;
    private controllers: typeof Controllers
  
    constructor({client, token}: IProps) {

      if (!client) throw new Error('Missing client');
      if (!token) throw new Error('Missing bot token');

      this.token = token;
      this.client = client;
      this.commandHandler = new CommandHandler({client: this.client, token: this.token});
      this.controllers = Controllers
    }

    async start(): Promise<void> {
        await this.client.login(this.token)
        logger.info(`Discord client connected: ${this.client.user?.tag} (${this.client.user?.id})`);
        await this.setupEventHandlers();
    }

    async registerCommands(guildId: string): Promise<void> {
      await this.commandHandler.registerCommands(guildId);
    }

    async refresh (guild: Guild): Promise<void> {
      try {
        logger.info(`Refreshing ${guild.name} (${guild.id}):`)

        await this.controllers.guildController.createOrUpdateCache(guild)

        const roles = await guild.roles.fetch().then(r => r.toJSON()).catch(_ => [])
        const members = await guild.members.fetch().then(r => r.toJSON()).catch(_ => [])

        await this.controllers.roleRewardEventController.refresh(guild, roles)
        await this.controllers.memberEventController.refresh(guild, members)

        await this.registerCommands(guild.id)
  
        console.log("\n")
      }
      catch (e) {
        logger.error(e)
      }
    }
  
    async setupEventHandlers(): Promise<void> {
        this.client.on('ready', async () => {
            const guildManager = this.client.guilds
            await this.controllers.guildController.refresh(guildManager)

            console.log("\n")
            for (const guild of guildManager.cache.values()) {
              await this.refresh(guild)
            }
        })

        this.client.on('interactionCreate', async (interaction: BaseInteraction) => {
          if (interaction.isChatInputCommand()) return await this.commandHandler.handle(interaction);

          return logger.warn(`Unknow interaction received... ${interaction}`)
      });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;

            if (message.channel instanceof TextChannel) {
              const content = message.content
              if (content.startsWith('!')) {
                if (content.startsWith("!invite")) {
                  return await this.controllers.inviteEventController.checkInvites(message)
                }
              }
            }
        })

        this.client.on('guildMemberAdd', async (member) => {
            if (member.user.id == this.client.user?.id) {
              await this.refresh(member.guild)
            }

            await this.controllers.memberEventController.create(member)
            await this.controllers.roleRewardEventController.assignRoleOnInviteGoal(member)
            await this.controllers.inviteEventController.increaseInviteCount(member)
        })

        this.client.on('inviteCreate', async (invite) => {
          if (!invite.guild) return
          logger.info(`An invite has been created: ${invite.code} in ${invite.guild.name} (${invite.guild.id}) by ${invite.inviter?.username} (${invite.inviter?.id})`)
          const guild = await this.client.guilds.fetch(invite.guild.id)
          return await this.controllers.guildController.createOrUpdateCache(guild)
        })

        this.client.on("inviteDelete", async (invite) => {
          if (!invite.guild) return
          logger.info(`An invite has been deleted: ${invite.code} in ${invite.guild.name} (${invite.guild.id})`)
          const guild = await this.client.guilds.fetch(invite.guild.id)
          return await this.controllers.guildController.createOrUpdateCache(guild)
        })

        this.client.on('roleDelete', async (role) => {
          await this.controllers.roleRewardEventController.delete(role)
        })
    }
  }