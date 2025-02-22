import { Collection, Guild, GuildMember, Invite, Message, TextChannel, User } from "discord.js";
import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { cache } from "../../shared/intraestructure/Cache.js";
import { logger } from "../../shared/utils/logger.js";

import {
    UserJoinedWithoutInviterError,
    DuplicateUserInviteError,
    InviterNotFoundError
}
from "../domain/inviteExceptions.js"
import { ICachedGuild } from "../../shared/intraestructure/ICachedGuild.js";
import { IGuildInput } from "../../Guild/application/IGuildInput.js";
import { getBufferFromURL } from "../../shared/utils/AttachmentBuffer.js";
import { IRewardInput } from "../../Reward/application/IRoleRewardInput.js";
import {InviteResponseBuilder as Builder} from "./InviteResponseBuilder.js"

export class InviteEventController {
    constructor (
        private memberService: IMemberInput,
        private roleRewardService: IRewardInput
    ) {}

    checkInvites = async (message: Message) => {
        try {
            const guild = <Guild>message.guild
            const user = (message.member as GuildMember).user

            const avatarImage = user.displayAvatarURL()
            ? await getBufferFromURL(user.displayAvatarURL())
            : null

            const currentInvites = await this.memberService.getInviteMembersCount(user.id, guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const roleRewards = await this.roleRewardService.getAll(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
              
            const response =roleRewards.length
                ? await Builder.createRoleRewardCard(guild, user, currentInvites, avatarImage, roleRewards)
                : await Builder.createCard(user, currentInvites, avatarImage)
            
            await message.react("✅")

            const {content, files} = response
            return await (message.channel as TextChannel).send({content, files})
        }
        catch (e) {
            logger.error(e)
        }
    }

    increaseInviteCount = async (member: GuildMember) => {
        try {
            const guild = member.guild
    
            try {
                const memberRecord = await this.memberService.get(member.id, guild.id)
                .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
                
                if (memberRecord.invitedBy) throw new DuplicateUserInviteError()
        
                //Get the old invite data from the cached guild and the new one
                const guildCached = <ICachedGuild>cache.get(guild.id)

                const newInviteData = await guild.invites.fetch()
                const oldInviteData = <Collection<string, Invite>>guildCached.inviteData
                
                //Find the inviter by the invite code updated in the new invite data
                let inviter: User | null | undefined = undefined
        
                for (const [code, oldInvite] of oldInviteData.entries()) {
                    const newInvite = newInviteData.get(code)
                    if (!newInvite) continue

                    if (newInvite.uses == null || oldInvite.uses == null) continue
                    if (newInvite.uses <= oldInvite.uses) continue
        
                    inviter = newInvite.inviter
                    if (!inviter) break
                }
        
                //If there is no inviter, end the function
                if (inviter === undefined) throw new UserJoinedWithoutInviterError()
                if (inviter === null) throw new InviterNotFoundError()
    
                //Get the inviter record
                const inviterRecord = await this.memberService.get(inviter.id, guild.id)
                .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
        
                //Update the member record object with the inviter data
                memberRecord.invitedBy = inviterRecord
                memberRecord.invitedById = inviter.id
        
                //Update the member record
                await this.memberService.update(memberRecord)
                .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
    
                logger.info(`${member.user.username} (${member.user.id}) just joined. They were invited by ${inviter.username} (${inviter.id})`)

                if (guild.systemChannel) {
                    await guild.systemChannel.send(`<@${member.user.id}> just joined. They were invited by <@${inviter.id}>`)
                }
            }
            catch (e) {
                if (!(e instanceof DuplicateUserInviteError) && !(e instanceof UserJoinedWithoutInviterError)) throw e

                if (e instanceof DuplicateUserInviteError) {
                    logger.info(`${member.user.username} (${member.user.id}) rejoined`)

                    if (guild.systemChannel) {
                        await guild.systemChannel.send(`<@${member.user.id}> rejoined`)
                    }
                }
                if (e instanceof UserJoinedWithoutInviterError) {
                    logger.info(`${member.user.username} (${member.user.id}) just joined without invite.`)

                    if (guild.systemChannel) {
                        await guild.systemChannel.send(`<@${member.user.id}> just joined.`)
                    }
                }
            }
        }
        catch (e) {
            return logger.error(e)
        }
    }
}