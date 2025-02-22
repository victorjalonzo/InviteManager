import { IRewardInput } from "../application/IRoleRewardInput.js"
import { ChatInputCommandInteraction, Guild, Role } from "discord.js"
import { EmbedResult } from "../../shared/intraestructure/EmbedResult.js";
import { InlineBlockText } from "../../shared/utils/textFormating.js";
import { ICreateRoleRewardDTO } from "../application/ICreateRoleRewardDTO.js";

export class RoleRewardCommandActions {
    constructor (private service: IRewardInput) {}

    execute = async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'list') return await this.list(interaction)
        if (subcommand === 'create') return await this.create(interaction)
        if (subcommand === 'delete') return await this.delete(interaction)

        throw new Error(`Unknow subcommand ${subcommand}`)
    }

    create = async (interaction: ChatInputCommandInteraction) => {
        try {
            const role = interaction.options.getRole('role', true)
            const invites = interaction.options.getInteger('invites', true)
            const guild = <Guild>interaction.guild

            const dto: ICreateRoleRewardDTO = {
                roleId: role.id,
                guildId: guild.id,
                invitesRequired: invites,
            }

            const reward = await this.service.create(dto)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
            
            const title = 'Reward created'
            let description = `The reward role has been successfully created\n\n`
            + `**Reward**: <@&${reward.roleId}>\n**Required Invites**: ${reward.invitesRequired}`
            
            return await EmbedResult.success({title, description, thumbnail: "gift", interaction})
        }
        catch (e) {
            return await EmbedResult.fail({description: String(e), interaction})
        }
    }

    delete = async (interaction: ChatInputCommandInteraction) => {
        try {
            const role = <Role>interaction.options.getRole('role')
            const guild = <Guild>interaction.guild

            const reward = await this.service.delete(role.id, guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))
            
            const title = 'Reward deleted'
            let description = `The reward has been deleted successfully.\n\n`
            + `**Reward**: <@&${reward.roleId}>\n**Required Invites**: ${reward.invitesRequired}`

            return await EmbedResult.success({title, thumbnail: "gift", description, interaction})
        }
        catch (e) {
            return await EmbedResult.fail({description: String(e), interaction})
        }
    }

    list = async (interaction: ChatInputCommandInteraction) => {
        try {
            const guild = <Guild>interaction.guild

            const rewards = await this.service.getAll(guild.id)
            .then(r => r.isSuccess() ? r.value : Promise.reject(r.error))

            const title = "Rewards list"
            const description = !rewards.length 
                ? "There are no roles as rewards created yet" 
                : rewards.map(reward => 
                    `Reward: <@&${reward.roleId}>\nRequired Invites: **${reward.invitesRequired}**\n\n`)
                    .join('') 

            return await EmbedResult.info({title, description, interaction})
        }
        catch (e) {
            return await EmbedResult.fail({description: String(e), interaction})
        }
    }
}