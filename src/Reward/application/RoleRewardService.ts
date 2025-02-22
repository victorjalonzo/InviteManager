import { IRepository } from "../../shared/domain/IRepository.js";
import { IReward } from "../domain/IRoleReward.js";
import { IRewardInput } from "./IRoleRewardInput.js";  
import { Result } from "../../shared/domain/Result.js";

import { RoleRewardNotFound} from "../domain/RoleRewardExceptions.js";
import { ICreateRoleRewardDTO } from "./ICreateRoleRewardDTO.js";

export class RoleRewardService implements IRewardInput {
    constructor(
        private repository: IRepository<IReward>
    ) {}

    async create(dto: ICreateRoleRewardDTO): Promise<Result<IReward>> {
        try {
            const data: IReward = {
                id: dto.roleId,
                roleId: dto.roleId,
                guildId: dto.guildId,
                invitesRequired: dto.invitesRequired,
                createdAt: new Date()
            }
            return await this.repository.create(data)
            .then(r => Result.success(r))
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async get (id: string, guildId: string): Promise<Result<IReward>> {
        try {
            const reward = await this.repository.get({ id: id, guildId: guildId });
            if (!reward) throw new RoleRewardNotFound()
            return Result.success(reward);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async getAll(guildId: string): Promise<Result<IReward[]>> {
        try {
            const rewardList = await this.repository.getAll({ guildId: guildId });
            return Result.success(rewardList);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async delete(id: string, guildId: string): Promise<Result<IReward>> {
        try {
            return await this.repository.delete({ id, guildId })
            .then(r => r ? Result.success(r) : Promise.reject(new RoleRewardNotFound()))
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }

    async deleteAll (guildId: string): Promise<Result<IReward[]>> {
        try {
            const rewardList = await this.repository.deleteAll({ guildId: guildId });
            return Result.success(rewardList);
        }
        catch (e) {
            return Result.failure(String(e));
        }
    }
}