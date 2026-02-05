# TrendAgency Social Media Dashboard

Bu proje, birden fazla müşteri ve sosyal medya platformu için haftalık performans verilerini takip etmek üzere Next.js kullanılarak hazırlanmış bir web uygulamasıdır. Kullanıcı yönetimi, veri girişi, geçmiş performans grafikleri ve Excel yükleme fonksiyonları içerir.

## Özellikler

- **Supabase Auth** ile kullanıcı girişi.
- Rol bazlı yetkilendirme (görüntüleme ve düzenleme).
- Müşteri ve platform yönetimi (yeni müşteriler veya platformlar ekleyebilirsiniz).
- Haftalık performans verilerini manuel veya Excel ile toplu yükleme.
- Son sekiz haftanın performansını gösteren grafikler.
- TrendAgency logosunda bulunan renk paleti kullanılmıştır (`#3F3D6F`, `#F9ECDC`, `#D1BA7D`, `#0E584B`, `#D46A4A`).

## Kurulum

1. **Depoyu kopyalayın veya GitHub’da oluşturup kodları aktarın.** Bu dosyaları bir GitHub reposuna ekleyin.
2. **Vercel’de yeni bir proje oluşturun** ve GitHub deposunu bağlayın.
3. **Supabase projesi oluşturun** ve aşağıdaki tablolara sahip olun. SQL komutlarını Supabase SQL Editor üzerinden çalıştırın:

```sql
-- Müşteriler tablosu
create table if not exists clients (
  id uuid default uuid_generate_v4() primary key,
  name text not null
);

-- Platformlar tablosu
create table if not exists platforms (
  id uuid default uuid_generate_v4() primary key,
  name text not null
);

-- Performans verileri
create table if not exists metrics (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references clients(id),
  platform text not null,
  week_start date not null,
  value numeric,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Kullanıcı yetkileri
create table if not exists user_permissions (
  user_id uuid references auth.users(id),
  client_id uuid references clients(id),
  can_view boolean default true,
  can_edit boolean default false,
  primary key (user_id, client_id)
);

-- İlk platformlar
insert into platforms (name) values ('X'), ('IG'), ('TikTok'), ('YouTube') on conflict do nothing;

-- Örnek müşteriler
insert into clients (name) values
  ('eFIBA'),
  ('EuroLeague Türkiye'),
  ('EuroCup'),
  ('TrendBasket')
on conflict do nothing;
```

4. **Row-Level Security (RLS)** etkinleştirin ve aşağıdaki policy’leri ekleyin:

```sql
-- Metrics tablosu: kullanıcı yalnızca yetkili olduğu müşterilerin verilerini görebilir veya yazabilir
alter table metrics enable row level security;

create policy "select metrics based on permissions" on metrics
for select
using (
  exists (
    select 1 from user_permissions up
      where up.user_id = auth.uid()
        and up.client_id = metrics.client_id
        and up.can_view = true
  )
);

create policy "insert metrics based on permissions" on metrics
for insert
with check (
  exists (
    select 1 from user_permissions up
      where up.user_id = auth.uid()
        and up.client_id = new.client_id
        and up.can_edit = true
  )
);

-- user_permissions tablosu: yalnızca admin kullanıcılar tarafından yönetilir
alter table user_permissions enable row level security;

create policy "admin manage permissions" on user_permissions
for all
using (auth.jwt() ->> 'role' = 'admin')
with check (auth.jwt() ->> 'role' = 'admin');
```

Admin kullanıcı ataması için Supabase panelinde ilk kullanıcıya `role` alanını "admin" olarak ekleyebilirsiniz.

5. **Çevresel Değişkenler**: Vercel projesi ayarlarında aşağıdaki anahtarları ekleyin:

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase projenizin URL'si
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon anahtarı

6. **Verileri Excel'den yüklemek**: Excel dosyanızda aşağıdaki başlıklar olmalıdır: `client_id` veya `client`, `platform`, `week_start` (YYYY-MM-DD formatında) ve `value`. Bu dosyayı **Veri Girişi** sayfasından yükleyebilirsiniz.

## Kullanım

- Uygulamayı açtığınızda giriş sayfası görünecektir. Admin hesabı yoksa Supabase panelinden kullanıcı oluşturup `role` alanını "admin" olarak ayarlayın.
- Admin kullanıcı yönetim panelinden diğer kullanıcılara müşteri ve yetki atayabilir.
- Kullanıcılar **Veri Girişi** sayfasından haftalık verilerini girebilir veya Excel ile yükleyebilir.
- Dashboard sayfasında son sekiz haftanın performansı grafik olarak gösterilir. Müşteri ve platform seçimlerini üstten değiştirebilirsiniz.

## Tasarım

Uygulama TrendAgency marka kimliğine göre özelleştirilmiştir. Renk paleti: `primary` (**#3F3D6F**), `secondary` (**#F9ECDC**), `accent` (**#D1BA7D**), `neutral` (**#0E584B**) ve `error` (**#D46A4A**) renkleri kullanılmıştır.
