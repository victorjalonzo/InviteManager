import { IMemberInput } from "../domain/IMemberInput.js";
import { Guild as DiscordGuild, GuildMember } from "discord.js";
import { MemberTransformer } from "../infrastructure/MemberTransformer.js";
import { logger } from "../../shared/utils/logger.js";
import { IGuildInput } from "../../Guild/application/IGuildInput.js";
import { IMember } from "../domain/IMember.js";
import { Result } from "../../shared/domain/Result.js";
import { GuildHasNoMembers } from "../../Guild/domain/GuildExceptions.js";
import { refreshLog } from "../../shared/utils/RefreshLog.js";
import { MemberAlreadyExistsError } from "../domain/MemberExceptions.js";

export class MemberEventController {
    constructor(
        private service: IMemberInput,
        private guildService: IGuildInput
    ) {}

    async refresh (guild: DiscordGuild, guildMembers: GuildMember[]): Promise<void> {
        const membersCreated: IMember[] = []
        const membersUpdated: IMember[] = []

        try {
            const [guildRecordResult, memberRecordsResult] = await Promise.all([
                await this.guildService.get(guild.id),
                await this.service.getAll(guild.id)
            ])

            if (!guildRecordResult.isSuccess() || !memberRecordsResult.isSuccess()) {
                throw guildRecordResult.error || memberRecordsResult.error
            }

            const guildRecord = guildRecordResult.value
            const memberRecords = memberRecordsResult.value

            if (guildMembers.length == 0) throw new GuildHasNoMembers()

            for (const guildMember of guildMembers) {
                const match = memberRecords.find((m) => m.id == guildMember.id)
                
                const memberParsed = MemberTransformer.parse(guildMember, guildRecord)

                let result: Result<IMember>

                if (match) {
                    result = await this.service.update(memberParsed)
                    if (!result.isSuccess()) throw result.error

                    membersUpdated.push(result.value)
                }
                else {
                    result = await this.service.create(memberParsed)
                    if (!result.isSuccess()) throw result.error

                    membersCreated.push(result.value)
                }
            }
        }
        catch (e) {
            if (!(e instanceof GuildHasNoMembers)) logger.warn(e)
        }

        logger.info("Members data: up to date.")
    }

    async create(member: GuildMember): Promise<void> {
        try {
            const guildRecord = await this.guildService.get(member.guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const parsedMember = MemberTransformer.parse(member, guildRecord)
            const memberRecord = await this.service.create(parsedMember)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            logger.info(`Member ${memberRecord.username} (${memberRecord.id}) has been registered.`)
        }
        catch (e) {
            if (e instanceof MemberAlreadyExistsError) return
            logger.warn(e)
        }
    }

    async update(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
            const guildCachedResult = await this.guildService.get(oldMember.guild.id)
            if (!guildCachedResult.isSuccess()) throw guildCachedResult.error
            
            const guildCached = guildCachedResult.value

        if (!guildCached) throw new Error(`The guild ${oldMember.guild.id} was not cached`)

        const newParsedMember = MemberTransformer.parse(newMember, guildCached)

        try {
            const result = await this.service.update(newParsedMember)

            if (!result.isSuccess()) throw result.error
            const record = result.value

            logger.info(`The member ${record.username} (${record.id}) was updated`)
        }
        catch (e) {
            logger.warn(e)
        }
    }

    async delete(member: GuildMember): Promise<void> {
        try {
            const filter = { id: member.id, guildId: member.guild.id }
            const result = await this.service.delete(filter)

            if (!result.isSuccess()) throw result.error
            const record = result.value

            logger.info(`The member ${record.username} (${record.id}) was deleted`)
        }

        catch (e) {
            logger.warn(e)
        }
    }   
}