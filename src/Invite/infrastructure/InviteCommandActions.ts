import { IMemberInput } from "../../Member/domain/IMemberInput.js";
import { ChatInputCommandInteraction, Guild, User } from "discord.js";
import { BoldText, InlineBlockText } from "../../shared/utils/textFormating.js";
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { IRewardInput } from "../../Reward/application/IRoleRewardInput.js";
import { IReward } from "../../Reward/domain/IRoleReward.js";
import { getBufferFromURL } from "../../shared/utils/AttachmentBuffer.js";
import {InviteResponseBuilder as Builder} from "./InviteResponseBuilder.js"
import { logger } from "../../shared/utils/logger.js";
import { InviteRewardCard } from "./ImageGenerator/InviteRewardCard.js";
import { InviteCard } from "./ImageGenerator/InviteCard.js";

export class InviteCommandActions {
    constructor(
        private memberService: IMemberInput, 
        private rewardRoleService: IRewardInput
    ) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        try {
            await interaction.deferReply()
            
            const guild = <Guild>interaction.guild
            const user = interaction.options.getUser('user') ?? interaction.user

            const avatarImage = user.displayAvatarURL()
            ? await getBufferFromURL(user.displayAvatarURL())
            : null

            const currentInvites = await this.memberService.getInviteMembersCount(user.id, guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const roleRewards = await this.rewardRoleService.getAll(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const response = roleRewards.length
                ? await Builder.createRoleRewardCard(guild, user, currentInvites, avatarImage, roleRewards)
                : await Builder.createCard(user, currentInvites, avatarImage)

            const {content, files} = response
            return await interaction.editReply({content, files})
        }
        catch (e) {
            logger.error(e)
            return await EmbedResult.fail({description: InlineBlockText(String(e)), interaction})
        }

    }

    _showInviteCardForRoleReward = async (
      user: User,
      interaction: ChatInputCommandInteraction,
      currentInvites: number,
      avatarImage: Buffer | null,
      rewardRoles: IReward[]
    ) => {
      const result = await this.determineChallenge(currentInvites, rewardRoles)
      const reward = <IReward>result.reward

      const description = result.isChallengeCompleted
      ? `**All current role challenges have been completed.**`
      : `${result.invitesRequiredLeft < result.invitesRequired 
        ? `You only need **${result.invitesRequiredLeft} more invites**` 
        : `You need **${result.invitesRequiredLeft} invites**`
        }` 
        + ` to earn the role <@&${reward.roleId}> as reward`

      const attachment = await InviteRewardCard.generate({
        username: user.username,
        avatarImage: avatarImage,
        currentInvites: currentInvites,
        invitesRequired: <number>result.invitesRequired,
        roleRewardName: "XXX"
      })

      return await interaction.editReply({content: description, files: [attachment]})
    }

    _showInviteCard = async (
      user: User,
      interaction: ChatInputCommandInteraction,
      currentInvites: number,
      avatarImage: Buffer | null
    ) => {
      const description = `You have ` + `${currentInvites > 1 || currentInvites == 0
        ? BoldText(`${currentInvites} invites`) 
        : BoldText(`${currentInvites} invite`)}.`

      const attachment = await InviteCard.generate({
        username: user.username,
        avatarImage: avatarImage,
        currentInvites: currentInvites
      })

      return await interaction.editReply({content: description, files: [attachment]})
    }

    determineChallenge = async (
        currentInvites: number,
        challengeRewards: IReward[]
      ) => {
      
        let isChallengeActive = false;
        let isChallengeCompleted = false;
        let reward: IReward | undefined = undefined;
        
        let invitesRequired = currentInvites;
        let invitesRequiredLeft: number = 0
      
        if (challengeRewards.length !== 0) {
          const sortedChallengeRewards = challengeRewards.sort(
            (a, b) => a.invitesRequired - b.invitesRequired
          );
      
          isChallengeActive = true;
      
          for (const [index, challengeReward] of sortedChallengeRewards.entries()) {
            if (challengeReward.invitesRequired > currentInvites) {
              invitesRequired = challengeReward.invitesRequired;
              reward = challengeReward;
              break;
            }
      
            if (index === sortedChallengeRewards.length - 1) {
              invitesRequired = challengeReward.invitesRequired;
              reward = challengeReward;
              isChallengeCompleted = true;
            }
          }
        }

        invitesRequiredLeft = <number>invitesRequired - currentInvites
      
        return {
          isChallengeActive,
          isChallengeCompleted,
          invitesRequired,
          invitesRequiredLeft,
          currentInvites,
          reward,
        };
      };
}