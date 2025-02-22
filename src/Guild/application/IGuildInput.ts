import { IGuild } from "../domain/IGuild.js"
import { Result } from "../../shared/domain/Result.js"
import { ICreateGuildDTO } from "./ICreateGuildDTO.js"

export interface IGuildInput {
    create (guild: ICreateGuildDTO): Promise<Result<IGuild>>
    get (id: string): Promise<Result<IGuild>>
    update (guild: IGuild): Promise<Result<IGuild>>
    delete (id: string): Promise<Result<Record<string, any>>>
}