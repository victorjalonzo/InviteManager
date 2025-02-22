import { EmbedBuilder, StringSelectMenuInteraction } from 'discord.js';
import { ChatInputCommandInteraction, ButtonInteraction } from 'discord.js';
import { AttachmentBuilder } from 'discord.js';

import { Asset } from './Asset.js';

interface Author {
    name: string
    icon?: string
    iconURL?: string
}

interface Field {
    name: string
    value: string
    inline?: boolean
}

interface Options {
    author?: Author
    color?: number,
    title?: string,
    description?: string
    thumbnail?: string
    image?: AttachmentBuilder
    interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectMenuInteraction
    fields?: Field[]
}

export class EmbedResult {
    static async success ({title, description, thumbnail, image, fields, interaction}: Options) {
        return await new EmbedResult().base({
            color: 0x3cb11f,
            author: {name: 'Success', icon: 'success'},
            title,
            description,
            thumbnail,
            image,
            fields,
            interaction
        })
    }

    static async fail ({title, description, thumbnail, interaction}: Options) {
        return await new EmbedResult().base({
            color: 0xee3030,
            author: {name: 'Failed', icon: 'failed'},
            title,
            description,
            thumbnail,
            interaction
        })
    }

    static async info ({title, description, thumbnail, image, interaction}: Options) {
        return await new EmbedResult().base({
            color: 0x48a2a8,
            author: {name: 'Info', icon: 'info'},
            title,
            description,
            thumbnail,
            image,
            interaction
        })
    }

    static custom ({author, color, title, description, thumbnail, fields, interaction}: Options) {
        return new EmbedResult().base({author, color,title,description,thumbnail, fields, interaction})
    }

    async base ({author, color, title, description, thumbnail, image, fields, interaction}: Options) {
        let embed = new EmbedBuilder()

        const files: AttachmentBuilder[] = []

        if (author) {
            if (author.icon) {
                const {attachment, attachmentURL } = await Asset.get(author.icon)
                author.iconURL = attachmentURL
                files.push(attachment)
            }

            embed.setAuthor({ name: author.name, iconURL: author.iconURL })
        }
            
        if (color) embed.setColor(color)
        if (title) embed.setTitle(title)
        if (description) embed.setDescription(description)

        if (thumbnail) {
            if (thumbnail.includes('http')) {
                embed.setThumbnail(thumbnail)   
            }
            else {
                const {attachment, attachmentURL } = await Asset.get(thumbnail)
                embed.setThumbnail(attachmentURL)
                files.push(attachment)
            }
        }

        if (image) {
            files.push(image)
            embed.setImage(`attachment://${image.name}`)
        }

        if (fields?.length) {
            fields.forEach(field => {
                embed.addFields({ name: field.name, value: field.value, inline: field.inline })
            })
        }

        if (interaction.deferred) return await interaction.editReply({
            embeds: [embed], files, components: []
        })
        
        return await interaction.reply({
            embeds: [embed], 
            files, components: [], 
            ephemeral: true
        })
    }
}