export interface IRepository <T> {
    create(data: Record<string, any>): Promise<T>
    update(filters: Record<string, any>, data: Record<string, any>): Promise<T | null>
    updateAll(filter: Record<string, any>, data: Partial<T>): Promise<T[]> 
    delete(filters: Record<string, any>, populate?: string[] | string): Promise<T | null>
    deleteAll(filters: Record<string, any>, populate?: string[] | string): Promise<T[]>
    get(filters?: Record<string, any>, populate?: string[] | string): Promise<T | null>
    getAll(filters?: Record<string, any>, populate?: string[] | string): Promise<T[]>
}