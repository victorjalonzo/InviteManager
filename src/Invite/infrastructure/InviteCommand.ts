import { SlashCommandCallable } from "../../shared/intraestructure/SlashCommandCallable.js"

const InviteCommand = new SlashCommandCallable()

InviteCommand
    .setName('invite')
    .setDescription('Show your current number of invites')

    .addUserOption(option => option
        .setName('user')
        .setDescription('The user')
        .setRequired(false)
    )

InviteCommand.setDMPermission(false)

export { InviteCommand }