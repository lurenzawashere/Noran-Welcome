const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logsetup')
    .setDescription('Hoşgeldin log sistemini açıp kapatır')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const config = require('../config.json');

    try {
      // Eğer log kanalı varsa kapat, yoksa aç
      if (config.logChannel) {
        // Log kanalını ve kategorisini sil
        const logChannel = interaction.guild.channels.cache.get(config.logChannel);
        if (logChannel) {
          const category = logChannel.parent;
          await logChannel.delete();
          // Kategoriyi sil
          if (category) {
            await category.delete();
          }
        }
        delete config.logChannel;
        require('fs').writeFileSync('./config.json', JSON.stringify(config, null, 2));

        await interaction.reply({
          content: '<:verify:1365604616225689600> **Log sistemi devre dışı bırakıldı!**',
          ephemeral: true
        });
      } else {
        // Kategori oluştur
        const category = await interaction.guild.channels.create({
          name: 'Noran Welcome',
          type: 4, // Category
          position: 0, // En üstte
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionFlagsBits.ViewChannel]
            },
            {
              id: interaction.guild.roles.everyone.id,
              deny: [PermissionFlagsBits.ViewChannel]
            }
          ]
        });

        // Log kanalını oluştur ve kategoriye ekle
        const logChannel = await interaction.guild.channels.create({
          name: 'welcome-log',
          type: 0, // Text channel
          parent: category,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
            },
            {
              id: interaction.guild.roles.everyone.id,
              deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
            },
            {
              id: interaction.guild.roles.cache.find(r => r.permissions.has(PermissionFlagsBits.Administrator)).id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
            }
          ]
        });

        // Config'e log kanalı ID'sini ekle
        config.logChannel = logChannel.id;
        require('fs').writeFileSync('./config.json', JSON.stringify(config, null, 2));

        await interaction.reply({
          content: `<:verify:1365604616225689600> **Log sistemi aktifleştirildi! Log kanalı:** ${logChannel}`,
          ephemeral: true
        });
      }
    } catch (error) {
      console.error('Log setup hatası:', error);
      await interaction.reply({
        content: '❌ Bir hata oluştu!',
        ephemeral: true
      });
    }
  }
}; 