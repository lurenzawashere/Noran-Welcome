const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// Komutları çek
try {
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    try {
      const command = require(`./commands/${file}`);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.error(`[UYARI] ${file} komutu gerekli "data" veya "execute" özelliklerine sahip değil.`);
      }
    } catch (error) {
      console.error(`[HATA] ${file} komutu yüklenirken hata oluştu:`, error);
    }
  }
} catch (error) {
  console.error('[HATA] Komutlar yüklenirken hata oluştu:', error);
}

// Slash komutlara bas
client.once(Events.ClientReady, async () => {
  try {
    if (!config.guildId) {
      console.error('[HATA] Guild ID yapılandırması bulunamadı!');
      return;
    }

    const guild = client.guilds.cache.get(config.guildId);
    if (!guild) {
      console.error('[HATA] Belirtilen sunucu bulunamadı!');
      return;
    }

    await guild.commands.set(client.commands.map(cmd => cmd.data));
    console.log('Slash komutlar başarıyla güncellendi!');

  } catch (error) {
    console.error('[HATA] Slash komutlar güncellenirken hata oluştu:', error);
  }
});

// Komutları çalıştır
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`[HATA] ${interaction.commandName} komutu bulunamadı!`);
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(`[HATA] ${interaction.commandName} komutu çalıştırılırken hata oluştu:`, error);
    await interaction.reply({ 
      content: 'Komut çalıştırılırken bir hata oluştu!', 
      ephemeral: true 
    }).catch(console.error);
  }
});

// Olayları çek
try {
  const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    try {
      const event = require(`./events/${file}`);
      if ('name' in event && 'execute' in event) {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
      } else {
        console.error(`[UYARI] ${file} eventi gerekli "name" veya "execute" özelliklerine sahip değil.`);
      }
    } catch (error) {
      console.error(`[HATA] ${file} eventi yüklenirken hata oluştu:`, error);
    }
  }
} catch (error) {
  console.error('[HATA] Eventler yüklenirken hata oluştu:', error);
}

// Bot bağlantı hatası
client.on('error', error => {
  console.error('[HATA] Discord bağlantı hatası:', error);
});

// Bot yeniden bağlanma
client.on('reconnecting', () => {
  console.log('[BİLGİ] Bot yeniden bağlanıyor...');
});

if (!config.token) {
  console.error('[HATA] Bot tokeni bulunamadı!');
  process.exit(1);
}

client.login(config.token).catch(error => {
  console.error('[HATA] Bot giriş yapamadı:', error);
  process.exit(1);
});
