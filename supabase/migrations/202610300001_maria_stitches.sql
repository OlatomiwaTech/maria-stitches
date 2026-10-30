create extension if not exists pgcrypto with schema extensions;

create sequence if not exists public.order_reference_seq start 1;
create sequence if not exists public.custom_reference_seq start 1;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text not null,
  price_ngn bigint not null check (price_ngn > 0),
  is_demo boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text not null,
  source_url text,
  photographer text,
  license text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  color text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  unique (product_id, size, color)
);

create table if not exists public.order_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('MS-' || lpad(nextval('public.order_reference_seq')::text, 6, '0')),
  idempotency_key uuid not null unique,
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  customer_phone text not null check (char_length(customer_phone) between 7 and 24),
  note text,
  total_estimate_ngn bigint not null default 0 check (total_estimate_ngn >= 0),
  status text not null default 'awaiting_whatsapp' check (status in ('awaiting_whatsapp','confirmed','in_production','ready_for_pickup','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_request_id uuid not null references public.order_requests(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  product_name text not null,
  product_slug text not null,
  size text not null,
  color text,
  quantity integer not null check (quantity between 1 and 10),
  unit_price_ngn bigint not null check (unit_price_ngn > 0),
  line_total_ngn bigint not null check (line_total_ngn > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.custom_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('MC-' || lpad(nextval('public.custom_reference_seq')::text, 6, '0')),
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  customer_phone text not null check (char_length(customer_phone) between 7 and 24),
  category_id uuid references public.categories(id) on delete set null,
  category_label text not null,
  description text not null check (char_length(description) between 10 and 2000),
  preferred_size text,
  desired_date date,
  inspiration_path text,
  notes text,
  status text not null default 'pending' check (status in ('pending','contacted','accepted','declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  business_name text not null default 'Maria Stitches',
  tagline text not null default 'Style, beautifully stitched.',
  whatsapp_number text not null default '2348033646143',
  location text not null default 'Sango Ota, Ogun State, Nigeria',
  pickup_instructions text not null default 'Customer pickup only. Exact arrangements are shared after an order is confirmed.',
  announcement text,
  contact_email text,
  instagram_url text,
  brand_settings jsonb not null default '{"espresso":"#2B1D1A","ivory":"#F7F2E9","burgundy":"#7A263A","beige":"#E8DED1","champagne":"#B9975B"}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists products_category_published_idx on public.products(category_id, is_published, created_at desc);
create index if not exists variants_product_available_idx on public.product_variants(product_id, is_available, stock_quantity);
create index if not exists order_requests_status_created_idx on public.order_requests(status, created_at desc);
create index if not exists custom_enquiries_status_created_idx on public.custom_enquiries(status, created_at desc);
create index if not exists order_items_order_idx on public.order_items(order_request_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists order_requests_set_updated_at on public.order_requests;
create trigger order_requests_set_updated_at before update on public.order_requests for each row execute function public.set_updated_at();
drop trigger if exists custom_enquiries_set_updated_at on public.custom_enquiries;
create trigger custom_enquiries_set_updated_at before update on public.custom_enquiries for each row execute function public.set_updated_at();
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin');
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.order_requests enable row level security;
alter table public.order_items enable row level security;
alter table public.custom_enquiries enable row level security;
alter table public.site_settings enable row level security;

revoke all on public.profiles, public.categories, public.products, public.product_images,
  public.product_variants, public.order_requests, public.order_items, public.custom_enquiries,
  public.site_settings from anon, authenticated;

grant select on public.categories, public.products, public.product_images, public.product_variants, public.site_settings to anon, authenticated;
grant select on public.profiles, public.order_requests, public.order_items, public.custom_enquiries to authenticated;
grant update on public.categories, public.products, public.product_images, public.product_variants, public.order_requests, public.custom_enquiries, public.site_settings to authenticated;
grant insert, delete on public.categories, public.products, public.product_images, public.product_variants to authenticated;

create policy categories_public_read on public.categories for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy categories_admin_insert on public.categories for insert to authenticated with check ((select public.is_admin()));
create policy categories_admin_update on public.categories for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy categories_admin_delete on public.categories for delete to authenticated using ((select public.is_admin()));

create policy products_public_read on public.products for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy products_admin_insert on public.products for insert to authenticated with check ((select public.is_admin()));
create policy products_admin_update on public.products for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy products_admin_delete on public.products for delete to authenticated using ((select public.is_admin()));

create policy product_images_public_read on public.product_images for select to anon, authenticated using (
  exists (select 1 from public.products p where p.id = product_id and p.is_published) or (select public.is_admin())
);
create policy product_images_admin_insert on public.product_images for insert to authenticated with check ((select public.is_admin()));
create policy product_images_admin_update on public.product_images for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy product_images_admin_delete on public.product_images for delete to authenticated using ((select public.is_admin()));

create policy variants_public_read on public.product_variants for select to anon, authenticated using (
  exists (select 1 from public.products p where p.id = product_id and p.is_published) or (select public.is_admin())
);
create policy variants_admin_insert on public.product_variants for insert to authenticated with check ((select public.is_admin()));
create policy variants_admin_update on public.product_variants for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy variants_admin_delete on public.product_variants for delete to authenticated using ((select public.is_admin()));

create policy profile_self_read on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy orders_admin_read on public.order_requests for select to authenticated using ((select public.is_admin()));
create policy orders_admin_update on public.order_requests for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy order_items_admin_read on public.order_items for select to authenticated using ((select public.is_admin()));
create policy custom_enquiries_admin_read on public.custom_enquiries for select to authenticated using ((select public.is_admin()));
create policy custom_enquiries_admin_update on public.custom_enquiries for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy site_settings_public_read on public.site_settings for select to anon, authenticated using (id = true);
create policy site_settings_admin_update on public.site_settings for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

create or replace function public.create_order_request(
  p_customer_name text,
  p_customer_phone text,
  p_note text,
  p_items jsonb,
  p_idempotency_key uuid
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_order public.order_requests%rowtype;
  v_item jsonb;
  v_variant public.product_variants%rowtype;
  v_product public.products%rowtype;
  v_quantity integer;
  v_total bigint := 0;
  v_items jsonb := '[]'::jsonb;
begin
  if p_customer_name is null or char_length(btrim(p_customer_name)) not between 2 and 100 then raise exception 'INVALID_CUSTOMER_NAME'; end if;
  if p_customer_phone is null or char_length(btrim(p_customer_phone)) not between 7 and 24 then raise exception 'INVALID_CUSTOMER_PHONE'; end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) not between 1 and 30 then raise exception 'INVALID_ITEMS'; end if;
  if p_idempotency_key is null then raise exception 'INVALID_IDEMPOTENCY_KEY'; end if;
  if (select count(distinct item.value->>'variant_id') from jsonb_array_elements(p_items) item) <> jsonb_array_length(p_items) then raise exception 'DUPLICATE_VARIANT'; end if;

  select * into v_order from public.order_requests where idempotency_key = p_idempotency_key;
  if found then
    select coalesce(jsonb_agg(jsonb_build_object('name', oi.product_name, 'size', oi.size, 'color', oi.color, 'quantity', oi.quantity, 'unit_price_ngn', oi.unit_price_ngn) order by oi.created_at), '[]'::jsonb)
      into v_items from public.order_items oi where oi.order_request_id = v_order.id;
    return jsonb_build_object('reference', v_order.reference, 'total_estimate_ngn', v_order.total_estimate_ngn, 'items', v_items, 'status', v_order.status);
  end if;

  insert into public.order_requests (idempotency_key, customer_name, customer_phone, note)
    values (p_idempotency_key, btrim(p_customer_name), btrim(p_customer_phone), nullif(btrim(p_note), ''))
    returning * into v_order;

  for v_item in select value from jsonb_array_elements(p_items) loop
    if coalesce(v_item->>'quantity', '') !~ '^[1-9][0-9]*$' then raise exception 'INVALID_QUANTITY'; end if;
    v_quantity := (v_item->>'quantity')::integer;
    if v_quantity > 10 then raise exception 'INVALID_QUANTITY'; end if;
    select pv.* into v_variant from public.product_variants pv where pv.id = (v_item->>'variant_id')::uuid for update;
    if not found or not v_variant.is_available or v_variant.stock_quantity < v_quantity then raise exception 'UNAVAILABLE_VARIANT'; end if;
    select p.* into v_product from public.products p where p.id = v_variant.product_id and p.is_published;
    if not found then raise exception 'UNAVAILABLE_PRODUCT'; end if;
    if v_product.is_demo then raise exception 'DEMO_PRODUCT'; end if;

    insert into public.order_items (order_request_id, product_id, variant_id, product_name, product_slug, size, color, quantity, unit_price_ngn, line_total_ngn)
      values (v_order.id, v_product.id, v_variant.id, v_product.name, v_product.slug, v_variant.size, v_variant.color, v_quantity, v_product.price_ngn, v_product.price_ngn * v_quantity);
    v_total := v_total + v_product.price_ngn * v_quantity;
    v_items := v_items || jsonb_build_array(jsonb_build_object('name', v_product.name, 'size', v_variant.size, 'color', v_variant.color, 'quantity', v_quantity, 'unit_price_ngn', v_product.price_ngn));
  end loop;

  update public.order_requests set total_estimate_ngn = v_total where id = v_order.id returning * into v_order;
  return jsonb_build_object('reference', v_order.reference, 'total_estimate_ngn', v_order.total_estimate_ngn, 'items', v_items, 'status', v_order.status);
exception when unique_violation then
  select * into v_order from public.order_requests where idempotency_key = p_idempotency_key;
  if not found then raise; end if;
  select coalesce(jsonb_agg(jsonb_build_object('name', oi.product_name, 'size', oi.size, 'color', oi.color, 'quantity', oi.quantity, 'unit_price_ngn', oi.unit_price_ngn) order by oi.created_at), '[]'::jsonb)
    into v_items from public.order_items oi where oi.order_request_id = v_order.id;
  return jsonb_build_object('reference', v_order.reference, 'total_estimate_ngn', v_order.total_estimate_ngn, 'items', v_items, 'status', v_order.status);
end;
$$;

create or replace function public.create_custom_enquiry(
  p_customer_name text,
  p_customer_phone text,
  p_category_label text,
  p_description text,
  p_preferred_size text,
  p_desired_date date,
  p_inspiration_path text,
  p_notes text
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_enquiry public.custom_enquiries%rowtype;
begin
  if p_customer_name is null or char_length(btrim(p_customer_name)) not between 2 and 100 then raise exception 'INVALID_CUSTOMER_NAME'; end if;
  if p_customer_phone is null or char_length(btrim(p_customer_phone)) not between 7 and 24 then raise exception 'INVALID_CUSTOMER_PHONE'; end if;
  if p_category_label is null or char_length(btrim(p_category_label)) not between 2 and 100 then raise exception 'INVALID_CATEGORY'; end if;
  if p_description is null or char_length(btrim(p_description)) not between 10 and 2000 then raise exception 'INVALID_DESCRIPTION'; end if;
  if p_inspiration_path is not null and p_inspiration_path !~ '^pending/[0-9a-fA-F-]{36}\.(jpg|jpeg|png|webp)$' then raise exception 'INVALID_INSPIRATION_PATH'; end if;
  if p_inspiration_path is not null and not exists (select 1 from storage.objects o where o.bucket_id = 'custom-inspiration' and o.name = p_inspiration_path) then raise exception 'INSPIRATION_NOT_FOUND'; end if;
  insert into public.custom_enquiries (customer_name, customer_phone, category_label, description, preferred_size, desired_date, inspiration_path, notes)
    values (btrim(p_customer_name), btrim(p_customer_phone), btrim(p_category_label), btrim(p_description), nullif(btrim(p_preferred_size), ''), p_desired_date, p_inspiration_path, nullif(btrim(p_notes), ''))
    returning * into v_enquiry;
  return jsonb_build_object('id', v_enquiry.id, 'reference', v_enquiry.reference, 'status', v_enquiry.status);
end;
$$;

revoke all on function public.create_order_request(text,text,text,jsonb,uuid) from public;
revoke all on function public.create_custom_enquiry(text,text,text,text,text,date,text,text) from public;
grant execute on function public.create_order_request(text,text,text,jsonb,uuid) to anon, authenticated;
grant execute on function public.create_custom_enquiry(text,text,text,text,text,date,text,text) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 8388608, array['image/jpeg','image/png','image/webp']),
       ('custom-inspiration', 'custom-inspiration', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy product_images_admin_upload on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and (select public.is_admin()));
create policy product_images_admin_read on storage.objects for select to authenticated using (bucket_id = 'product-images' and (select public.is_admin()));
create policy product_images_admin_update on storage.objects for update to authenticated using (bucket_id = 'product-images' and (select public.is_admin())) with check (bucket_id = 'product-images' and (select public.is_admin()));
create policy product_images_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'product-images' and (select public.is_admin()));
create policy custom_inspiration_public_upload on storage.objects for insert to anon with check (bucket_id = 'custom-inspiration' and name ~ '^pending/[0-9a-fA-F-]{36}\.(jpg|jpeg|png|webp)$');
create policy custom_inspiration_admin_read on storage.objects for select to authenticated using (bucket_id = 'custom-inspiration' and (select public.is_admin()));

