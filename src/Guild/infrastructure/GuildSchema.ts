import { Schema, model, Document } from 'mongoose';
import { IGuild } from '../domain/IGuild.js'; 

const guildSchema = new Schema<IGuild & Document>({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    createdAt: { type: Date, required: true },
});

export const GuildModel = model<IGuild & Document>('Guilds', guildSchema);