const { ActivityType } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        try {
            console.log(`Bot aktif: ${client.user.tag}`);
            
            if (!config.guildId) {
                console.error('[HATA] Guild ID yapılandırması bulunamadı!');
                return;
            }

            const guild = client.guilds.cache.get(config.guildId);
            if (!guild) {
                console.error('[HATA] Belirtilen sunucu bulunamadı!');
                return;
            }

            // Bot durumunu güncelle
            function updateStatus() {
                const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
                client.user.setPresence({
                    activities: [{
                        name: `✨ ${totalMembers} üye | ${client.guilds.cache.size} sunucu`,
                        type: ActivityType.Watching
                    }],
                    status: 'online'
                });
            }

            // İlk durumu ayarla
            updateStatus();
            // Her 5 dakikada bir durumu güncelle
            setInterval(updateStatus, 5 * 60 * 1000);

        } catch (error) {
            console.error('[HATA] Bot başlatılırken hata oluştu:', error);
        }
    },
}; 