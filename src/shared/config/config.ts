import dotenv from 'dotenv'

dotenv.config()

export const Config = {
    domain: process.env.SERVER_DOMAIN,
    host: process.env.SERVER_HOST,

    discord: {
        token: process.env.DISCORD_BOT_TOKEN,
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
    },

    database: {
        name: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.SERVER_HOST,
        port: process.env.DATABASE_PORT,
        provider: process.env.DATABASE_PROVIDER,

        get url(){
            return `${this.provider}://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`
        }
    },

    asset: {
        path: 'assets/'
    }
}

