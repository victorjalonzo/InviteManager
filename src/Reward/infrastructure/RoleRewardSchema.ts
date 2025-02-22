import { Schema, model, Document} from 'mongoose'
import {IReward } from '../domain/IRoleReward.js';

const roleRewardSchema = new Schema <IReward & Document>({
    id: { type: String, required: true },
    roleId: { type: String, required: true },
    invitesRequired: { type: Number, required: true },
    guildId: { type: String, required: true }
})

export const RoleRewardModel = model('RoleRewards', roleRewardSchema)