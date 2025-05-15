const { EmbedBuilder } = require('discord.js');
const config = require('./config.json');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            // Config dosyasından gerekli bilgileri al
            const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannel);
            const welcomeRole = member.guild.roles.cache.get(config.welcomeRole);
            const rulesChannel = member.guild.channels.cache.get(config.rulesChannel);
            const logChannel = member.guild.channels.cache.get(config.logChannel);

            // Rol verme
            if (welcomeRole) {
                await member.roles.add(welcomeRole);
            }

            // Banner URL'sini kontrol et
            const bannerUrl = config.welcomeBanner?.trim();
            console.log('Banner URL:', bannerUrl); // Debug için

            // Hoşgeldin mesajı oluştur
            const welcomeEmbed = new EmbedBuilder()
                .setColor('#2b2d31')
                .setTitle('Yeni Bir Dost Geldi!')
                .setDescription(config.welcomeMessage
                    .replace('{member}', member.toString())
                    .replace('{member_count}', member.guild.memberCount)
                    .replace('{created_at}', `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`)
                    .replace('{trust_level}', member.user.bot ? 'Bot' : 'Güvenli')
                )
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                .setFooter({ text: `${member.guild.name}`, iconURL: member.guild.iconURL() })
                .setTimestamp();

            // Banner varsa ekle
            if (bannerUrl && bannerUrl.length > 0) {
                welcomeEmbed.setImage(bannerUrl);
            }

            // Hoşgeldin mesajını gönder
            if (welcomeChannel) {
                const message = await welcomeChannel.send({ embeds: [welcomeEmbed] });
                console.log('Gönderilen mesaj:', message.embeds[0].toJSON()); // Debug için
            }

            // Log kaydı
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setTitle('Yeni Üye Katıldı')
                    .setDescription(`
                        **Kullanıcı:** ${member.user.tag} (${member.user.id})
                        **Hesap Oluşturulma:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:D>
                        **Katılma Tarihi:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>
                        **Bot Durumu:** ${member.user.bot ? 'Bot' : 'Kullanıcı'}
                        **Verilen Rol:** ${welcomeRole ? welcomeRole.name : 'Yok'}
                    `)
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            }

        } catch (error) {
            console.error('Hoşgeldin mesajı gönderilirken hata oluştu:', error);
        }
    },
}; 