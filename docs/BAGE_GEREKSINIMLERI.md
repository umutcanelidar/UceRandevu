# BAGE – RANDEVU & İŞLETME YÖNETİM SİSTEMİ
## Müşteri Sistem Gereksinimleri ve Yönetim Notları (Orijinal Doküman Özeti)

Bu belge, müşterinin masaüstündeki `BAGE_Randevu_ve_Isletme_Sistemi_Gereksinimleri_v2 (1).docx` dosyasından çıkarılmış resmi proje gereksinimleridir.

---

### 1. Randevu Sistemi
* Personel / takım bazlı randevu yönetimi.
* Randevu oluştururken hizmet/işlem seçilebilmeli ve işlemin süresi otomatik olarak takvime yansıtılmalı.
  * *Örnek:* 11:00'de başlayan 1 saatlik bir işlem için sistem 12:00'ye kadar olan süreyi otomatik olarak kapatmalı.
* Randevu saatleri işlem süresine göre otomatik planlanmalı.
* Randevu geçmişi ve müşterinin daha önce aldığı işlemler görüntülenebilmeli.
* Müşterinin randevu geçmişi, iptal bilgileri ve işlemleri tek ekranda görülebilmeli.
* Müşterinin **doğum günü** bilgisi kaydedilmeli ve görüntülenebilmeli.
* Gün içinde iptal oluştuğunda bekleme listesindeki uygun müşteriye ulaşılabilmeli.

---

### 2. Ciro ve Finans Takibi
* **Gün sonu ciro takibi** yapılmalı.
* **Personel bazlı** gün sonu cirosu görülebilmeli.
* Günlük, haftalık ve aylık ciro raporları oluşturulmalı.
* **Hedef ciro** tanımlanabilmeli ve güncel ciro ile karşılaştırılabilmeli.
* **Bugünkü beklenen ciro** ayrıca gösterilmeli (planlanan randevulardan gelecek potansiyel).
* Aylık toplam ciro ve ilgili dönem karşılaştırmaları görülebilmeli.
* Müşteriden alınan ödeme şekli (**Nakit / Kart / Havale** vb.) kaydedilmeli.
* **Kapora bilgisi** müşterinin kaydında görünmeli; kapora var/yok durumu kolayca kontrol edilebilmeli.
* Kapora ve paket ödemeleri/uygulamaları sistem üzerinden takip edilebilmeli.
* **Giderler:**
  * Giderler sisteme kaydedilebilmeli (tarih, kategori, açıklama, ödeme yöntemi/banka).
  * Günlük, haftalık ve aylık gider raporları alınabilmeli.
  * Günlük toplam gider otomatik hesaplanmalı.
  * Aylık gider toplamı, aylık ciro ve **NET KALAN TUTAR (Kâr)** birlikte gösterilmeli.

---

### 3. Müşteri Yönetimi (CRM)
* Müşteri bilgilerinin kaydı kalıcı olmalı.
* Müşteri profiline detaylı bilgi ve not eklenebilmeli.
* Müşterinin geçmiş randevuları, aldığı işlemler, ödemeleri ve kapora bilgileri görüntülenebilmeli.
* Müşterinin kaç kez geldiği ve ne zaman geldiği görülebilmeli.
* Müşteri geçmişinden hangi işlemleri aldığı takip edilebilmeli.
* Müşteri bilgilerine ihtiyaç halinde ek alanlar/notlar eklenebilmeli.

---

### 4. Paketler ve Ürün Satışı (POS)
* **Paket Satışı:**
  * Paket satın alan müşteriye paket bilgisi otomatik olarak müşteri hesabına tanımlanmalı.
  * Paket kullanıldığında ilgili işlem paket hakkından otomatik düşmeli (Örn: 5 seansın 1'i kullanıldı, kalan: 4).
  * Paketlerin kalan kullanım hakkı ve geçmiş kullanımları görülebilmeli.
* **Ürün Satışı (Perakende):**
  * Ürün satışı ayrı olarak takip edilebilmeli (bakım kremleri, yağlar, ojeler vb.).
  * Ürün satışında hangi ürünün, kim tarafından (personel) ve hangi ödeme yöntemiyle satıldığı görülebilmeli.
  * Ürün satışları günlük/haftalık/aylık ciro raporlarına dahil edilebilmeli.

---

### 5. Personel Yetkilendirme & Roller
* Personel yalnızca kendi randevularını görebilecek şekilde yetkilendirilebilmeli.
* Yönetici (Admin) ve Personel (Staff) yetkileri birbirinden ayrılmalı.
* Fiyat listesi yönetici yetkisi olmadan değiştirilememeli.
* Kullanıcı/rol yetkileri gerektiğinde açılıp kapatılabilmeli.

---

### 6. İşlem ve Hizmet Tanımları (BAGE Salon)
* BAGE'deki tüm işlemler sisteme tanımlanabilmeli.
* Örnek hizmetler: Manikür, pedikür, kalıcı oje, jel güçlendirme, kaş/kirpik işlemleri, cilt bakımı vb.
* Her hizmet için fiyat ve işlem süresi ayrı ayrı tanımlanabilmeli.
* İşlemlerin süreleri takvimde slot kapatmak için otomatik kullanılmalı.
* Fiyat değişiklikleri yalnızca yönetici tarafından yapılabilmeli.

---

### 7. Raporlama ve İstatistikler
* Günlük özet raporu: Gelen müşteri sayısı, günlük ciro, iptal sayısı ve yeni randevu sayısı.
* Haftalık ve aylık özet raporları.
* Randevularda ve ciroda artış/azalış trend grafikleri (1–30 günlük dönem).
* En yoğun günler ve en sakin günler analizi.
* Beklenen ciro ile gerçekleşen ciro karşılaştırma çubuğu.

---

### 8. Bekleme Listesi (Waitlist)
* Gün içinde bir randevu iptal olduğunda bekleme listesindeki müşteriler listelenmeli.
* Uygun müşteriye boşalan saat için kolayca ulaşılabilmeli (WhatsApp / Telefon).
* Bekleme listesinde müşterinin tercih ettiği işlem ve uygun olduğu saatler tutulabilmeli.

---

### 9. Yönetim Paneli Dashboard (Ana Ekran)
* Bugünkü randevular
* Bugünkü beklenen ciro
* Bugünkü gerçekleşen ciro
* Hedef ciro ilerleme çubuğu
* Gelen müşteri sayısı
* İptaller
* Yeni randevular
* Bekleme listesindeki müşteriler (hızlı aksiyon)
* Paketler ve kalan haklar özeti
* Ürün satışları özeti
* Günlük / Haftalık / Aylık mini trend grafikleri

---

### 10. Müşterinin Yeni Eklediği Kritik Gereksinimler (Sektörel Özel İstekler)
1. **Malzeme Stokları (Salon Envanteri):**
   - Salon içinde kullanılan sarf malzemeleri ve ürün stokları (örneğin jel, kalıcı oje, aseton, pamuk, tırnak törpüsü, eldiven vb.).
   - Kalan stok miktarı, kritik stok uyarı eşiği (Örn: 3 adedin altına inince "Stok Azaldı" uyarısı).
2. **45 Gün Gelmeyen Müşteri Alarmı (Müşteri Tutundurma & Geri Kazanım):**
   - Son ziyaretinden bu yana 45 gün geçmiş müşterilerin otomatik filtrelenmesi.
   - Salonun bu müşterileri tek ekranda görüp "Sizi Özledik / Bakım Zamanı" şeklinde WhatsApp hatırlatması atabilmesi.
3. **Personel Veri Gizliliği (Müşteri Bilgisi Maskeleme):**
   - Personel kendi ekranında müşterinin tam soyismini ve telefon numarasını görememeli (Örn: "Ayşe K***" veya "A*** Y***").
   - Personelin müşteriyi dışarıya çekmesini / müşteri çalmasını engellemek için sektör standardı güvenlik önlemi.
   - Yalnızca Yönetici (Admin) müşterinin tam adını ve telefon numarasını görebilir.
4. **Personel İzinli Gün Kapatma:**
   - Personelin haftalık izin günleri veya özel izinleri takvimde doğrudan bloke edilmeli.
   - İzinli günde o personele sistem üzerinden randevu verilememeli.
5. **Müşteri Uzman Değişikliği:**
   - Randevuyu alan müşterinin işlem uzmanı kolayca değiştirilebilmeli (Dropdown ile başka bir personele tek tıkla devir).
   - Hem randevu geçmişinde hem de takvimde otomatik güncellenmeli.
