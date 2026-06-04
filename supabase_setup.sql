-- ================================================
-- WC FARM — Supabase Database Setup
-- วางโค้ดนี้ใน Supabase → SQL Editor → Run
-- ================================================

-- 1. ผู้ใช้งาน
create table if not exists users (
  id bigserial primary key,
  phone text unique not null,
  name text not null,
  role text not null default 'staff',
  active boolean default true,
  password text,
  created_at timestamptz default now()
);

-- 2. เบอร์ติดต่อ
create table if not exists contacts (
  id bigserial primary key,
  name text not null,
  role text,
  phone text,
  "group" text,
  created_at timestamptz default now()
);

-- 3. บันทึกเข้า-ออก
create table if not exists visitors (
  id bigserial primary key,
  name text not null,
  role text,
  type text not null,
  date date not null,
  time text,
  note text,
  created_by text,
  created_at timestamptz default now()
);

-- 4. ยาและวัคซีน
create table if not exists med_records (
  id bigserial primary key,
  type text not null,
  name text not null,
  pen text,
  quantity text,
  date date not null,
  by_user text,
  note text,
  created_at timestamptz default now()
);

-- 5. อาหาร
create table if not exists feed_records (
  id bigserial primary key,
  feed_type text not null,
  pen text,
  amount text,
  date date not null,
  time text,
  by_user text,
  created_at timestamptz default now()
);

-- 6. รายงานปัญหา
create table if not exists issues (
  id bigserial primary key,
  date date not null,
  reporter text not null,
  category text not null,
  detail text not null,
  status text default 'รอดำเนินการ',
  created_at timestamptz default now()
);

-- 7. ส่งของ (รถขนส่งอาหาร)
create table if not exists deliveries (
  id bigserial primary key,
  date date not null,
  driver text,
  vehicle text,
  item text not null,
  quantity text,
  unit text default 'กระสอบ',
  note text,
  created_at timestamptz default now()
);

-- ================================================
-- เปิด Row Level Security (อนุญาต anon ทำ CRUD)
-- ================================================
alter table users enable row level security;
alter table contacts enable row level security;
alter table visitors enable row level security;
alter table med_records enable row level security;
alter table feed_records enable row level security;
alter table issues enable row level security;
alter table deliveries enable row level security;

-- Policy: อนุญาต anon key อ่าน/เขียน/แก้ไข/ลบทุกตาราง
do $$
declare
  tbl text;
begin
  foreach tbl in array array['users','contacts','visitors','med_records','feed_records','issues','deliveries']
  loop
    execute format('create policy "allow_all_%s" on %I for all to anon using (true) with check (true)', tbl, tbl);
  end loop;
end $$;

-- ================================================
-- ข้อมูลเริ่มต้น — ทีมงาน
-- ================================================
insert into users (phone, name, role, active, password) values
  ('0649899824', 'วัง',      'admin',      true, null),
  ('0980529186', 'พี่ติ่ง',   'staff',      true, null),
  ('0940835393', 'พี่นาย',    'staff',      true, null),
  ('0655856513', 'นันท์',     'staff',      true, null),
  ('0808383073', 'เต',        'staff',      true, null),
  ('0937721659', 'นา',        'staff',      true, null),
  ('0963383400', 'ดา',        'staff',      true, null),
  ('0952644938', 'พล',        'staff',      true, null),
  ('0817654400', 'พี่หมง',    'contractor', true, null),
  ('0998680400', 'ต้นกล้า',   'contractor', true, null),
  ('0622240812', 'พี่เยาว์',  'staff',      true, null)
on conflict (phone) do nothing;

insert into contacts (name, role, phone, "group") values
  ('วัง',      'เจ้าของฟาร์ม',      '064-989-9824', 'ผู้บริหาร'),
  ('พี่ติ่ง',  'หัวหน้าทีมเลี้ยง',  '098-052-9186', 'หัวหน้าทีมเลี้ยง'),
  ('พี่นาย',   'หัวหน้าทีมเลี้ยง',  '094-083-5393', 'หัวหน้าทีมเลี้ยง'),
  ('ว่าง',     'ประจำเล้า 1',        '',             'ทีมเลี้ยง'),
  ('นันท์',    'ประจำเล้า 2',        '065-585-6513', 'ทีมเลี้ยง'),
  ('เต',       'ประจำเล้า 3',        '080-838-3073', 'ทีมเลี้ยง'),
  ('นา',       'ประจำเล้า 4',        '093-772-1659', 'ทีมเลี้ยง'),
  ('ดา',       'ประจำเล้า 5',        '096-338-3400', 'ทีมเลี้ยง'),
  ('พล',       'ประจำเล้า 6',        '095-264-4938', 'ทีมเลี้ยง'),
  ('พี่หมง',   'ทีมช่าง',            '081-765-4400', 'ทีมช่าง'),
  ('ต้นกล้า',  'ทีมช่าง',            '099-868-0400', 'ทีมช่าง'),
  ('พี่เยาว์', 'แม่ครัวแม่บ้าน',     '062-224-0812', 'แม่ครัวแม่บ้าน');
