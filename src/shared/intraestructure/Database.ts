import { Config } from '../config/config.js'
import mongoose from 'mongoose'
import { logger } from '../utils/logger.js'

export class Database {
    static async connect(): Promise<typeof mongoose | mongoose.Connection> {
        if (mongoose.connection.readyState === 1) return mongoose.connection.asPromise()

        await mongoose.connect(Config.database.url!, {
            authSource: 'admin'
        })

        logger.info(`Database client connected: ${Config.database.url}`)

        return mongoose.connection.asPromise()
    }
}