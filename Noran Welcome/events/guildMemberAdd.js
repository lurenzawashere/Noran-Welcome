const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'guildMemberAdd',

  async execute(member, client) {
    try {
      const channel = member.guild.channels.cache.get(config.welcomeChannel);
      if (!channel) return;

      // Banner URL'sini kontrol et
      const bannerUrl = config.welcomeBanner?.trim();
      console.log('Banner URL:', bannerUrl); // Debug için

      // Hoşgeldin mesajı
      const welcomeEmbed = new EmbedBuilder()
        .setColor("#623cec")
        .setTitle('<a:starr:1365599071968034887> Yeni Üye Katıldı!')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .setDescription(`
          > <:hii:1365601456819802174> ${member}! \`${member.guild.name}\` **ailesine katıldığın için teşekkürler!**
          
          > <a:arrow:1365602061126729799> **Lütfen** <#${config.rulesChannel || '1365589332072730667'}> **kanalını okuyarak sunucu kurallarını öğren!**
        `)
        .setFooter({ 
          text: `${member.guild.name}`, 
          iconURL: member.guild.iconURL() 
        })
        .setTimestamp();

      // Banner varsa ekle
      if (bannerUrl && bannerUrl.length > 0) {
        welcomeEmbed.setImage(bannerUrl);
      }

      await channel.send({ 
        content: `${member}`,
        embeds: [welcomeEmbed] 
      });

      // Log mesajı (eğer log kanalı varsa)
      if (config.logChannel) {
        const logChannel = member.guild.channels.cache.get(config.logChannel);
        if (logChannel) {
          const accountAge = Date.now() - member.user.createdTimestamp;
          const days = Math.floor(accountAge / (1000 * 60 * 60 * 24));
          const memberCount = member.guild.memberCount;
          
          const suffix = memberCount.toString().endsWith('1') ? 'inci' :
                      memberCount.toString().endsWith('2') ? 'nci' :
                      memberCount.toString().endsWith('3') ? 'üncü' :
                      memberCount.toString().endsWith('4') ? 'üncü' :
                      memberCount.toString().endsWith('5') ? 'inci' :
                      memberCount.toString().endsWith('6') ? 'ncı' :
                      memberCount.toString().endsWith('7') ? 'nci' :
                      memberCount.toString().endsWith('8') ? 'inci' :
                      memberCount.toString().endsWith('9') ? 'uncu' :
                      'ıncı';

          let trustLevel;
          if (days < 7) {
            trustLevel = "🚨 Çok Şüpheli (1 haftadan yeni)";
          } else if (days < 30) {
            trustLevel = "⚠️ Şüpheli (1 aydan yeni)";
          } else if (days < 90) {
            trustLevel = "🔍 Normal (3 aydan yeni)";
          } else {
            trustLevel = "✅ Güvenilir (3+ ay)";
          }

          const logEmbed = new EmbedBuilder()
            .setColor("#623cec")
            .setTitle('📝 Yeni Üye Log')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`
              **👤 Kullanıcı Bilgileri**
              > **ID:** \`${member.id}\`
              > **Kullanıcı Adı:** \`${member.user.username}\`
              > **Tag:** \`${member.user.tag}\`
              
              **📊 Sunucu Bilgileri**
              > **Üye Sırası:** \`${memberCount}${suffix}\`
              > **Katılma Tarihi:** <t:${Math.floor(Date.now() / 1000)}:F>
              
              **🔍 Hesap Detayları**
              > **Hesap Yaşı:** \`${days} gün\`
              > **Oluşturulma:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>
              > **Güvenlik:** ${trustLevel}
            `)
            .setFooter({ 
              text: `${member.guild.name} • Log Sistemi`, 
              iconURL: member.guild.iconURL() 
            })
            .setTimestamp();

          await logChannel.send({ embeds: [logEmbed] });
        }
      }

      // Rol verme
      if (config.welcomeRole) {
        const role = member.guild.roles.cache.get(config.welcomeRole);
        if (role) {
          await member.roles.add(role).catch(error => {
            console.error('Rol verme hatası:', error);
          });
        }
      }

    } catch (error) {
      console.error('Hoşgeldin mesajı gönderilirken hata oluştu:', error);
    }
  }
}
