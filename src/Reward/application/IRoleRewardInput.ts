import { Result } from "../../shared/domain/Result.js";
import { IReward } from "../domain/IRoleReward.js";
import { ICreateRoleRewardDTO } from "./ICreateRoleRewardDTO.js";

export interface IRewardInput {
    create: (dto: ICreateRoleRewardDTO) => Promise<Result<IReward>>
    get: (id: string, guildId: string) => Promise<Result<IReward>>
    getAll: (guildId: string) => Promise<Result<IReward[]>>
    delete: (id: string, guildId: string) => Promise<Result<IReward>>
    deleteAll: (guildId: string) => Promise<Result<IReward[]>>
}