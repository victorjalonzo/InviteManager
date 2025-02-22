import { IGuildInput } from "../application/IGuildInput.js";
import { Guild as DiscordGuild, GuildManager } from "discord.js";
import { logger } from "../../shared/utils/logger.js";
import { IGuild } from "../domain/IGuild.js";
import { cache } from "../../shared/intraestructure/Cache.js";
import { GuildRecordNotFoundError } from "../domain/GuildExceptions.js";
import { ICreateGuildDTO } from "../application/ICreateGuildDTO.js";

export class GuildEventController {
    constructor (private service: IGuildInput) {}

    refresh = async (guildManager: GuildManager): Promise<void> => {
        const guildUpdated: IGuild[] = []
        const guildCreated: IGuild[] = []

        try {
            const collection = guildManager.cache

            for (const guildId of collection.keys()) {
                const guild = <DiscordGuild>collection.get(guildId)
                const result = await this.service.get(guildId)

                if (!result.isSuccess()) {
                    if (!(result.error instanceof GuildRecordNotFoundError)) throw result.error

                    const dto: ICreateGuildDTO = {
                        id: guild.id,
                        name: guild.name
                    }

                    const guildRecord = await this.service.create(dto)
                    .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
                    
                    guildCreated.push(guildRecord)
                }
            }
        }
        catch (e) {
            logger.error(e)
        }

        logger.info("Guilds data: up to date.")
    }
    
    createOrUpdateCache = async (guild: DiscordGuild): Promise<void> => {
        const guildRecord = await this.service.get(guild.id)
        .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

        const inviteData = await guild.invites.fetch()
        const cacheInviteData = new Map()

        for (const [code, invite] of inviteData.entries()) {
            cacheInviteData.set(code, {
                code: code,
                inviter: invite.inviter,
                uses: invite.uses
            })
        }

        guildRecord.inviteData = cacheInviteData
        cache.createOrUpdate(guildRecord)

        logger.info(`Invite data up to date.`)
    }

    createRecord = async (guild: DiscordGuild): Promise<Partial<IGuild> | undefined> => {
        try {
            const dto: ICreateGuildDTO = {
                id: guild.id,
                name: guild.name
            }

            const guildCreatedRecord = await this.service.create(dto)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            logger.info(`The guild ${guildCreatedRecord.name} (${guildCreatedRecord.id}) was created`)

            return guildCreatedRecord
        }
        catch (e) {
            logger.warn(e)
        }   
    }
}