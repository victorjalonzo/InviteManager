import { AttachmentBuilder, Guild, Role, User } from "discord.js"
import { BoldText } from "../../shared/utils/textFormating.js"
import { IReward } from "../../Reward/domain/IRoleReward.js"
import { InviteRewardCard } from "./ImageGenerator/InviteRewardCard.js"
import { InviteCard } from "./ImageGenerator/InviteCard.js"

interface Response {
    content: string
    files: AttachmentBuilder[]
}

export class InviteResponseBuilder {
    static createRoleRewardCard = async (
        guild: Guild,
        user: User,
        currentInvites: number,
        avatarImage: Buffer | null,
        rewardRoles: IReward[]
      ): Promise<Response> => {
  
        const result = new InviteResponseBuilder()._determineChallenge(currentInvites, rewardRoles)
        const reward = <IReward>result.reward
        const role = <Role>await guild.roles.fetch(reward.id)

        const files: AttachmentBuilder[] = []
  
        const content = result.isChallengeCompleted
        ? `**All current role challenges have been completed.**`
        : `${result.invitesRequiredLeft < result.invitesRequired 
          ? `You only need **${result.invitesRequiredLeft} more invites**` 
          : `You need **${result.invitesRequiredLeft} invites**`
          }` 
          + ` to earn the role <@&${reward.id}> as reward`
  
        const attachment = await InviteRewardCard.generate({
          username: user.username,
          avatarImage: avatarImage,
          currentInvites: currentInvites,
          invitesRequired: <number>result.invitesRequired,
          roleRewardName: role.name
        })

        files.push(attachment)

        return {content, files}
      }

    static createCard = async (
        user: User,
        currentInvites: number,
        avatarImage: Buffer | null
      ): Promise<Response> => {
        const files: AttachmentBuilder[] = []

        const content = `You have ` + `${currentInvites > 1 || currentInvites == 0
          ? BoldText(`${currentInvites} invites`) 
          : BoldText(`${currentInvites} invite`)}.`
  
        const attachment = await InviteCard.generate({
          username: user.username,
          avatarImage: avatarImage,
          currentInvites: currentInvites
        })

        files.push(attachment)
  
        return {content, files}
      }

      _determineChallenge = (
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
          reward
        };
      };
}