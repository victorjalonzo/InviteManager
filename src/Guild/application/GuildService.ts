import { IGuildInput } from "./IGuildInput.js";
import { IRepository } from "../../shared/domain/IRepository.js";
import { IGuild } from "../domain/IGuild.js";
import { Result } from "../../shared/domain/Result.js";

import { 
    GuildRecordUpdateError,
    GuildRecordNotFoundError,
    GuildRecordDeletionError
} from "../domain/GuildExceptions.js";
import { ICreateGuildDTO } from "./ICreateGuildDTO.js";

export class GuildService implements IGuildInput {
    constructor(private repository: IRepository<IGuild>) {}

    create = async (dto: ICreateGuildDTO): Promise<Result<IGuild>> => {
        try {
            const data: IGuild = {
                id: dto.id,
                name: dto.name,
                createdAt: new Date()
            }

            return await this.repository.create(data)
            .then(r => Result.success(r))
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    get = async (id: string): Promise<Result<IGuild>> => {
        try {
            const guildRecord = await this.repository.get({id});
            if (!guildRecord) throw new GuildRecordNotFoundError()
    
            return Result.success(guildRecord);
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    update = async (guild:IGuild): Promise<Result<IGuild>> =>{
        try {
            const filters = { id: guild.id }
            const guildRecordUpdated = await this.repository.update(filters, guild);
            
            if (!guildRecordUpdated) throw new GuildRecordUpdateError()

            return Result.success(guildRecordUpdated);
        }
        catch (e) {
            return Result.failure(e)
        }
    }

    delete = async (id: string): Promise<Result<Record<string, any>>> => {
        try {
            const guildDeleted = await this.repository.delete({id});

            if (!guildDeleted) throw new GuildRecordDeletionError()

            return Result.success(guildDeleted)
        }
        catch (e) {
            return Result.failure(e)
        }
    }   
}