-- Every item below is illustrative sample data, not a confirmed Maria Stitches product.
-- Do not change is_demo to false until an administrator replaces the sample facts and image.
insert into public.categories (name, slug, description, sort_order) values
  ('Dresses and Gowns', 'dresses-and-gowns', 'Sample dresses for celebrations and everyday style.', 1),
  ('Two-Piece Outfits', 'two-piece-outfits', 'Sample co-ordinated outfits.', 2),
  ('Native and Traditional Wear', 'native-traditional-wear', 'Sample native and traditional-inspired looks.', 3),
  ('Trousers and Shirts', 'trousers-and-shirts', 'Sample separates and tailored pairings.', 4),
  ('Children''s Clothing', 'childrens-clothing', 'Sample clothing for children.', 5)
on conflict (slug) do nothing;

insert into public.products (category_id, name, slug, description, price_ngn, is_demo, is_published)
select c.id, p.name, p.slug, p.description, p.price_ngn, true, true
from (values
  ('dresses-and-gowns','Evening Ankara Gown','evening-ankara-gown','Illustrative sample style. Design, fabric and availability are not confirmed.',42000),
  ('dresses-and-gowns','Soft Pleat Midi Dress','soft-pleat-midi','Illustrative sample style. Design, fabric and availability are not confirmed.',36500),
  ('dresses-and-gowns','Sculpted Wrap Dress','sculpted-wrap-dress','Illustrative sample style. Design, fabric and availability are not confirmed.',39000),
  ('dresses-and-gowns','Garden Party Gown','garden-party-gown','Illustrative sample style. Design, fabric and availability are not confirmed.',48000),
  ('two-piece-outfits','City Co-ord Set','city-coord-set','Illustrative sample style. Design, fabric and availability are not confirmed.',46000),
  ('two-piece-outfits','Structured Two-Piece','structured-two-piece','Illustrative sample style. Design, fabric and availability are not confirmed.',52000),
  ('two-piece-outfits','Weekend Co-ord','weekend-coord','Illustrative sample style. Design, fabric and availability are not confirmed.',34000),
  ('native-traditional-wear','Heritage Boubou','heritage-boubou','Illustrative sample style. Design, fabric and availability are not confirmed.',55000),
  ('native-traditional-wear','Modern Kaftan','modern-kaftan','Illustrative sample style. Design, fabric and availability are not confirmed.',44000),
  ('native-traditional-wear','Aso Oke-Inspired Set','aso-oke-inspired-set','Illustrative sample style. Design, fabric and availability are not confirmed.',62000),
  ('trousers-and-shirts','Relaxed Linen Shirt','relaxed-linen-shirt','Illustrative sample style. Design, fabric and availability are not confirmed.',28000),
  ('trousers-and-shirts','Tapered Tailored Trouser','tapered-tailored-trouser','Illustrative sample style. Design, fabric and availability are not confirmed.',32000),
  ('trousers-and-shirts','Classic Shirt and Trouser','classic-shirt-and-trouser','Illustrative sample style. Design, fabric and availability are not confirmed.',50000),
  ('childrens-clothing','Little Celebration Dress','little-celebration-dress','Illustrative sample style. Design, fabric and availability are not confirmed.',26000),
  ('childrens-clothing','Mini Match Set','mini-match-set','Illustrative sample style. Design, fabric and availability are not confirmed.',29500)
) as p(category_slug, name, slug, description, price_ngn)
join public.categories c on c.slug = p.category_slug
on conflict (slug) do nothing;

insert into public.product_images (product_id, image_url, alt_text, source_url, photographer, license, sort_order)
select p.id,
  'https://images.unsplash.com/' || s.photo || '?auto=format&fit=crop&w=1000&q=82',
  s.name || ' sample fashion photograph. Illustrative only; not a Maria Stitches product photo.',
  'https://images.unsplash.com/' || s.photo,
  null,
  'Unsplash License; photographer attribution not supplied in this seed file, verify before production use.',
  0
from (values
  ('evening-ankara-gown','Evening Ankara Gown','photo-1595777457583-95e059d581b8'),
  ('soft-pleat-midi','Soft Pleat Midi Dress','photo-1539008835657-9e8e9680c956'),
  ('sculpted-wrap-dress','Sculpted Wrap Dress','photo-1515886657613-9f3515b0c78f'),
  ('garden-party-gown','Garden Party Gown','photo-1539109136881-3be0616acf4b'),
  ('city-coord-set','City Co-ord Set','photo-1529139574466-a303027c1d8b'),
  ('structured-two-piece','Structured Two-Piece','photo-1483985988355-763728e1935b'),
  ('weekend-coord','Weekend Co-ord','photo-1525507119028-ed4c629a60a3'),
  ('heritage-boubou','Heritage Boubou','photo-1509631179647-0177331693ae'),
  ('modern-kaftan','Modern Kaftan','photo-1503342217505-b0a15ec3261c'),
  ('aso-oke-inspired-set','Aso Oke-Inspired Set','photo-1534528741775-53994a69daeb'),
  ('relaxed-linen-shirt','Relaxed Linen Shirt','photo-1598033129183-c4f50c736f10'),
  ('tapered-tailored-trouser','Tapered Tailored Trouser','photo-1596755094514-f87e34085b2c'),
  ('classic-shirt-and-trouser','Classic Shirt and Trouser','photo-1521572163474-6864f9cf17ab'),
  ('little-celebration-dress','Little Celebration Dress','photo-1503919005314-30d93d07d823'),
  ('mini-match-set','Mini Match Set','photo-1519238263530-99bdd11df2ea')
) as s(slug, name, photo)
join public.products p on p.slug = s.slug
where not exists (select 1 from public.product_images i where i.product_id = p.id);

insert into public.product_variants (product_id, size, color, stock_quantity, is_available)
select p.id, sizes.size, 'Illustrative sample', 5, true
from public.products p
cross join (values ('XS'),('S'),('M'),('L'),('XL')) as sizes(size)
where p.is_demo
on conflict do nothing;
