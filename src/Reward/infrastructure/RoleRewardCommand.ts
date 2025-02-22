import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const RoleRewardCommand = new SlashCommandCallable()

RoleRewardCommand
    .setName('reward')
    .setDescription('Reward roles to members based on their invite count.')

    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create a reward')

            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role that will be given to a member when they reach the required number of invites')
                .setRequired(true)
            )

            .addIntegerOption(option => option
                .setName('invites')
                .setDescription('The number of invites required to earn the reward.')
                .setRequired(true)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('delete')
            .setDescription('Delete a reward associated with a role.')

            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role of the reward')
                .setRequired(true)
            )
    )

    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('Show the list of all rewards')
    )

RoleRewardCommand.setDMPermission(false)
RoleRewardCommand.setDefaultMemberPermissions(8)

export { RoleRewardCommand }