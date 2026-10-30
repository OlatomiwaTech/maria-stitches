-- Public RPCs are directly callable with the publishable key, so enforce the same
-- bounds in PostgreSQL as in the web routes and normalize phone-based rate limits.
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
  v_request_count integer;
  v_phone text;
begin
  if p_customer_name is null or char_length(btrim(p_customer_name)) not between 2 and 100 then raise exception 'INVALID_CUSTOMER_NAME'; end if;
  if p_customer_phone is null or char_length(btrim(p_customer_phone)) not between 7 and 24 then raise exception 'INVALID_CUSTOMER_PHONE'; end if;
  v_phone := regexp_replace(btrim(p_customer_phone), '[^0-9]', '', 'g');
  if length(v_phone) = 11 and left(v_phone, 1) = '0' then v_phone := '234' || substr(v_phone, 2); end if;
  if v_phone !~ '^[1-9][0-9]{7,14}$' then raise exception 'INVALID_CUSTOMER_PHONE'; end if;
  if char_length(coalesce(p_note, '')) > 1000 then raise exception 'INVALID_NOTE'; end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) not between 1 and 30 then raise exception 'INVALID_ITEMS'; end if;
  if p_idempotency_key is null then raise exception 'INVALID_IDEMPOTENCY_KEY'; end if;
  if (select count(distinct item.value->>'variant_id') from jsonb_array_elements(p_items) item) <> jsonb_array_length(p_items) then raise exception 'DUPLICATE_VARIANT'; end if;

  select * into v_order from public.order_requests where idempotency_key = p_idempotency_key;
  if found then
    select coalesce(jsonb_agg(jsonb_build_object('name', oi.product_name, 'size', oi.size, 'color', oi.color, 'quantity', oi.quantity, 'unit_price_ngn', oi.unit_price_ngn) order by oi.created_at), '[]'::jsonb)
      into v_items from public.order_items oi where oi.order_request_id = v_order.id;
    return jsonb_build_object('reference', v_order.reference, 'total_estimate_ngn', v_order.total_estimate_ngn, 'items', v_items, 'status', v_order.status);
  end if;

  insert into public.public_submission_limits (form_kind, subject_hash, window_started_at, request_count)
    values ('order', encode(extensions.digest(v_phone, 'sha256'), 'hex'), now(), 1)
    on conflict (form_kind, subject_hash) do update set
      window_started_at = case when public.public_submission_limits.window_started_at < now() - interval '1 hour' then now() else public.public_submission_limits.window_started_at end,
      request_count = case when public.public_submission_limits.window_started_at < now() - interval '1 hour' then 1 else public.public_submission_limits.request_count + 1 end
    returning request_count into v_request_count;
  if v_request_count > 5 then raise exception 'RATE_LIMITED'; end if;

  insert into public.order_requests (idempotency_key, customer_name, customer_phone, note)
    values (p_idempotency_key, btrim(p_customer_name), v_phone, nullif(btrim(p_note), ''))
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
declare
  v_enquiry public.custom_enquiries%rowtype;
  v_request_count integer;
  v_phone text;
begin
  if p_customer_name is null or char_length(btrim(p_customer_name)) not between 2 and 100 then raise exception 'INVALID_CUSTOMER_NAME'; end if;
  if p_customer_phone is null or char_length(btrim(p_customer_phone)) not between 7 and 24 then raise exception 'INVALID_CUSTOMER_PHONE'; end if;
  v_phone := regexp_replace(btrim(p_customer_phone), '[^0-9]', '', 'g');
  if length(v_phone) = 11 and left(v_phone, 1) = '0' then v_phone := '234' || substr(v_phone, 2); end if;
  if v_phone !~ '^[1-9][0-9]{7,14}$' then raise exception 'INVALID_CUSTOMER_PHONE'; end if;
  if p_category_label is null or char_length(btrim(p_category_label)) not between 2 and 100 then raise exception 'INVALID_CATEGORY'; end if;
  if p_description is null or char_length(btrim(p_description)) not between 10 and 2000 then raise exception 'INVALID_DESCRIPTION'; end if;
  if char_length(coalesce(p_preferred_size, '')) > 40 then raise exception 'INVALID_SIZE'; end if;
  if char_length(coalesce(p_notes, '')) > 1000 then raise exception 'INVALID_NOTES'; end if;
  if p_inspiration_path is not null and p_inspiration_path !~ '^pending/[0-9a-fA-F-]{36}\.(jpg|jpeg|png|webp)$' then raise exception 'INVALID_INSPIRATION_PATH'; end if;
  if p_inspiration_path is not null and not exists (select 1 from storage.objects o where o.bucket_id = 'custom-inspiration' and o.name = p_inspiration_path) then raise exception 'INSPIRATION_NOT_FOUND'; end if;

  insert into public.public_submission_limits (form_kind, subject_hash, window_started_at, request_count)
    values ('custom', encode(extensions.digest(v_phone, 'sha256'), 'hex'), now(), 1)
    on conflict (form_kind, subject_hash) do update set
      window_started_at = case when public.public_submission_limits.window_started_at < now() - interval '1 hour' then now() else public.public_submission_limits.window_started_at end,
      request_count = case when public.public_submission_limits.window_started_at < now() - interval '1 hour' then 1 else public.public_submission_limits.request_count + 1 end
    returning request_count into v_request_count;
  if v_request_count > 5 then raise exception 'RATE_LIMITED'; end if;

  insert into public.custom_enquiries (customer_name, customer_phone, category_label, description, preferred_size, desired_date, inspiration_path, notes)
    values (btrim(p_customer_name), v_phone, btrim(p_category_label), btrim(p_description), nullif(btrim(p_preferred_size), ''), p_desired_date, p_inspiration_path, nullif(btrim(p_notes), ''))
    returning * into v_enquiry;
  return jsonb_build_object('id', v_enquiry.id, 'reference', v_enquiry.reference, 'status', v_enquiry.status);
end;
$$;
