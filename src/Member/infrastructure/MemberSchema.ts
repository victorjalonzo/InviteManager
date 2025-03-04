import { Schema, model, Document } from 'mongoose';
import { IMember } from '../domain/IMember.js';

const memberSchema = new Schema<IMember & Document>({
    id: { type: String, required: true },
    username: { type: String, required: true },
    discriminator: { type: String, required: true },
    guildId: { type: String, required: true },
    guild: { type: Schema.Types.ObjectId, ref: "Guilds", required: true},
    avatarURL: { type: String, default: null },
    invitedById: { type: String, default: null },
    invitedBy: { type: Schema.Types.ObjectId, ref: "Members", default: null },
});

memberSchema.methods.setInvitedBy = function (inviter: IMember) {
    this.invitedBy = inviter;
    this.invitedById = inviter.id;
};

export const memberModel = model<IMember & Document>('Members', memberSchema);