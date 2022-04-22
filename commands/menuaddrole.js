const { Client, GuildMember, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, Role, TextChannel } = require("discord.js");

module.exports = {
    category: 'Configuration',
    description: 'Ajoute un auto role a un message auto role.',

    permissions: ['ADMINISTRATOR'],

  //  minArgs: 3,
    maxArgs: 5,
    expeptedArgs: '<channel> <messageID> <role>',
    expectedArgsTypes: ['CHANNEL', 'STRING', 'ROLE'],

    slash: 'both',
    
    guildOnly: true,

    init: (client) => {
        client.on('interactionCreate', interaction => {
            if(!interaction.isSelectMenu()){
                return
            }

            const { customId, values, member } = interaction

            if(customId === 'auto_roles' && member instanceof GuildMember){
                const component = interaction.component
                const removed = component.options.filter((option) => {
                    return !values.includes(option.value)
                })

                for(const id of removed){
                    member.roles.remove(id.value)
                }
                
                for(const id of values){
                    member.roles.add(id)
                }

                interaction.reply({
                    content: 'Roles mis a jour !',
                    ephemeral: true
                })
            }
        })
    },

    callback: async ({ message, interaction, args, client }) => {

    const channel = (
        message 
            ? message.mentions.channels.first() 
            : interaction.options.getChannel('channel')
        )
        if(!channel || channel.type !== 'GUILD_TEXT'){
            return 'Mentionne un salon.'
        }

        const messageId = args[1]

        const role = (message ? message.mentions.roles.first() : interaction.options.getRole('role'))
        if(!role){
            return 'Role inconnu!'
        }

        const targetMessage = await channel.messages.fetch(messageId, {
            cache: true,
            force: true
        })

        if(!targetMessage){
            return 'message ID Inconnu'
        }

    if(interaction){
        if(role.position >= interaction.guild.me.roles.highest.position){
            return 'Je ne peux pas ajouter un role qui est au dessus du miens.'
        }
    }else{
        if(role.position >= message.guild.me.roles.highest.position){
            return 'Je ne peux pas ajouter un role qui est au même endroit que le miens.'
        } 
    }

        if(targetMessage.author.id !== client.user?.id){
            return `Mets un message qui viens de <@${client.user?.id}>`
        }

        let row = targetMessage.components[0]
        if(!row){
            row = new MessageActionRow()
        }

        const option = {
            label: role.name,
            value: role.id
        }

        let menu = row.components[0]
        if(menu){
            for(const o of menu.options){
                /*if(o.value === option[0].value){
                    return{
                        custom: true,
                        content: `<@$&${o.value}> fait déjà partie de ce menu.`,
                        allowedMentions: {
                            roles: []
                        },
                        ephemeral: true
                    }
                }*/
            }

            menu.addOptions(option)
            menu.setMaxValues(menu.options.length)
        }else{
            row.addComponents(
                new MessageSelectMenu()
                .setCustomId('auto_roles')
                .setMinValues(0)
                .setMaxValues(1)
                .setPlaceholder('Choisissez vos roles...')
                .addOptions(option)
            )
        }

        targetMessage.edit({
            components: [row]
        })

        return{
            custom: true,
            content: `J'ai ajouté <@&${role.id}> au menu auto role.`,
            allowedMentions: {
                roles: []
            },
            ephemeral: true
        }
    }
}