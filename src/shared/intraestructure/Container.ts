import { Database } from "./Database.js";
import { MongoRepository } from "./MongoRepository.js";
import { SlashCommandCallable } from '../../shared/intraestructure/SlashCommandCallable.js';

import { GuildModel } from "../../Guild/infrastructure/GuildSchema.js";
import { GuildService } from "../../Guild/application/GuildService.js";
import { GuildEventController } from "../../Guild/infrastructure/GuildEventController.js";

import { memberModel } from "../../Member/infrastructure/MemberSchema.js";
import { MemberService } from "../../Member/application/MemberService.js";
import { MemberEventController } from "../../Member/infrastructure/MemberController.js";

import { RoleRewardModel } from "../../Reward/infrastructure/RoleRewardSchema.js";
import { RoleRewardCommand } from '../../Reward/infrastructure/RoleRewardCommand.js';
import { RoleRewardCommandActions } from "../../Reward/infrastructure/RoleRewardCommandActions.js";
import { RoleRewardService } from "../../Reward/application/RoleRewardService.js";
import { RoleRewardEventController } from "../../Reward/infrastructure/RoleRewardEventController.js";

import { InviteCommand } from '../../Invite/infrastructure/InviteCommand.js';
import { InviteCommandActions } from "../../Invite/infrastructure/InviteCommandActions.js";
import { InviteEventController } from "../../Invite/infrastructure/InviteEventController.js";
await Database.connect()

const Repository = MongoRepository

const guildRepository = new Repository(GuildModel);
const guildService = new GuildService(guildRepository);
const guildController = new GuildEventController(guildService);

const memberRepository = new Repository(memberModel);
const memberService = new MemberService(memberRepository);
const memberEventController = new MemberEventController(memberService, guildService);

const roleRewardRespository = new Repository(RoleRewardModel);
const roleRewardService = new RoleRewardService(roleRewardRespository);
const roleRewardCommandAction = new RoleRewardCommandActions(roleRewardService);
const roleRewardEventController = new RoleRewardEventController(roleRewardService, guildService, memberService);
RoleRewardCommand.setCallback(roleRewardCommandAction.execute);

const inviteCommandActions = new InviteCommandActions(memberService, roleRewardService);
const inviteEventController = new InviteEventController(memberService, roleRewardService);
InviteCommand.setCallback(inviteCommandActions.execute);

export const Services = {
    guildService,
    memberService,
    roleRewardService
}

export const Controllers = {
    guildController,
    memberEventController,
    roleRewardEventController,
    inviteEventController
}

export const Commands: SlashCommandCallable[] = [ 
    InviteCommand, 
    RoleRewardCommand
]

export const CommandActions = {
    roleRewardCommandAction
}