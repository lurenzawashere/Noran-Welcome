# Noran Welcome Bot

Discord sunucunuz için özel tasarlanmış, modern ve kullanıcı dostu hoşgeldin botu. Yeni üyelerinizi sıcak bir şekilde karşılayın ve sunucunuzu daha canlı hale getirin!

## 🌟 Özellikler

- **Özelleştirilebilir Hoşgeldin Mesajları**
  - Kişiselleştirilmiş mesajlar
  - Banner desteği
  - Emoji entegrasyonu
  - Dinamik değişkenler

- **Gelişmiş Güvenlik Sistemi**
  - Hesap yaşı kontrolü
  - Güvenlik seviyesi göstergesi
  - Şüpheli hesapları tespit etme

- **Detaylı Log Sistemi**
  - Üye katılım kayıtları
  - Hesap detayları
  - Güvenlik durumu
  - Rol verme logları

- **Otomatik Rol Verme**
  - Yeni üyelere otomatik rol atama
  - Özelleştirilebilir rol seçenekleri

## 🚀 Kurulum

1. `config.json` dosyasını düzenleyin:
   ```json
   {
     "token": "BOT_TOKENINIZ",
     "guildId": "SUNUCU_ID",
     "welcomeChannel": "HOŞGELDIN_KANAL_ID",
     "welcomeMessage": "{member} sunucumuza katıldı! Şu anda {member_count} kişiyiz.\nHesap oluşturulma tarihi: {created_at}\nGüvenlik durumu: {trust_level}",
     "welcomeRole": "VERILECEK_ROL_ID",
     "rulesChannel": "KURALLAR_KANAL_ID",
     "welcomeBanner": "BANNER_URL",
     "logChannel": "LOG_KANAL_ID",
     "emojis": {
       "star": "YILDIZ_EMOJI_ID",
       "hi": "MERHABA_EMOJI_ID",
       "arrow": "OK_EMOJI_ID",
       "verify": "ONAY_EMOJI_ID"
     }
   }
   ```

2. Gerekli ID'leri bulmak için:
   - Discord'da Ayarlar > Gelişmiş > Geliştirici Modu'nu açın
   - Sunucu/Kanal/Rol/Emoji'ye sağ tıklayıp "ID'yi Kopyala"yı seçin

3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

4. Botu başlatın:
   ```bash
   node katedral.js
   ```

## 💡 Özelleştirme

### Hoşgeldin Mesajı
Mesajınızı aşağıdaki değişkenlerle özelleştirin:
- `{member}`: Kullanıcı etiketi
- `{member_count}`: Sunucu üye sayısı
- `{created_at}`: Hesap oluşturulma tarihi
- `{trust_level}`: Güvenlik durumu

### Banner ve Emojiler
- `welcomeBanner`: Hoşgeldin mesajında görünecek banner URL'si
- `emojis`: Sunucunuza özel emojileri kullanın

## 🔒 Güvenlik

- Bot tokeninizi kimseyle paylaşmayın
- Geliştirici Modu kapalı olan hesaplara ID'leri göstermeyin
- Log kanalını sadece yetkililerin görebileceği şekilde ayarlayın

## 📊 Bot Durumu

Bot, toplam üye ve sunucu sayısını otomatik olarak gösterir:
- Her 5 dakikada bir güncellenir
- "İzliyor" durumunda görüntülenir
- Online durumda çalışır

## 🤝 Destek

Sorularınız ve önerileriniz için: [Discord Sunucumuz](https://discord.gg/link)

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın. 