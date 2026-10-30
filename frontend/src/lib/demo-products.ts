import type { Category, Product } from '@/lib/types';

const categories: Category[] = [
  { id: 'demo-cat-dresses', name: 'Dresses and Gowns', slug: 'dresses-and-gowns', description: 'Dresses for celebrations, special days and everything in between.' },
  { id: 'demo-cat-two-piece', name: 'Two-Piece Outfits', slug: 'two-piece-outfits', description: 'Coordinated sets with a confident, considered fit.' },
  { id: 'demo-cat-native', name: 'Native and Traditional Wear', slug: 'native-traditional-wear', description: 'Contemporary tailoring inspired by Nigerian style.' },
  { id: 'demo-cat-shirts', name: 'Trousers and Shirts', slug: 'trousers-and-shirts', description: 'Everyday separates, made to feel personal.' },
  { id: 'demo-cat-children', name: "Children's Clothing", slug: 'childrens-clothing', description: 'Thoughtful looks for little ones and family occasions.' },
];

const samples = [
  ['evening-ankara-gown', 'Evening Ankara Gown', 42000, 'dresses-and-gowns', 'A flowing occasion silhouette with a defined waist and room to move.', 'photo-1595777457583-95e059d581b8'],
  ['soft-pleat-midi', 'Soft Pleat Midi Dress', 36500, 'dresses-and-gowns', 'A softly pleated midi shape for celebrations and everyday dressing.', 'photo-1539008835657-9e8e9680c956'],
  ['sculpted-wrap-dress', 'Sculpted Wrap Dress', 39000, 'dresses-and-gowns', 'A wrap-inspired line with a clean neckline and an adjustable feel.', 'photo-1515886657613-9f3515b0c78f'],
  ['garden-party-gown', 'Garden Party Gown', 48000, 'dresses-and-gowns', 'An expressive longline look for a day made to be remembered.', 'photo-1539109136881-3be0616acf4b'],
  ['city-coord-set', 'City Co-ord Set', 46000, 'two-piece-outfits', 'A relaxed matching set designed to work together or apart.', 'photo-1529139574466-a303027c1d8b'],
  ['structured-two-piece', 'Structured Two-Piece', 52000, 'two-piece-outfits', 'A tailored jacket and trouser pairing with a modern profile.', 'photo-1483985988355-763728e1935b'],
  ['weekend-co-ord', 'Weekend Co-ord', 34000, 'two-piece-outfits', 'An easy two-piece set for a polished, comfortable day.', 'photo-1525507119028-ed4c629a60a3'],
  ['heritage-boubou', 'Heritage Boubou', 55000, 'native-traditional-wear', 'A graceful traditional silhouette with generous movement.', 'photo-1509631179647-0177331693ae'],
  ['modern-kaftan', 'Modern Kaftan', 44000, 'native-traditional-wear', 'A clean kaftan shape that brings ease to occasion dressing.', 'photo-1503342217505-b0a15ec3261c'],
  ['aso-oke-inspired-set', 'Aso Oke-Inspired Set', 62000, 'native-traditional-wear', 'A statement set inspired by rich woven textures and tradition.', 'photo-1534528741775-53994a69daeb'],
  ['relaxed-linen-shirt', 'Relaxed Linen Shirt', 28000, 'trousers-and-shirts', 'A relaxed shirt shape to wear tucked, layered or loose.', 'photo-1598033129183-c4f50c736f10'],
  ['tapered-tailored-trouser', 'Tapered Tailored Trouser', 32000, 'trousers-and-shirts', 'A clean tapered trouser with a versatile, high-waist fit.', 'photo-1596755094514-f87e34085b2c'],
  ['classic-shirt-and-trouser', 'Classic Shirt & Trouser', 50000, 'trousers-and-shirts', 'A considered pairing for workdays and occasions.', 'photo-1521572163474-6864f9cf17ab'],
  ['little-celebration-dress', 'Little Celebration Dress', 26000, 'childrens-clothing', 'A playful occasion style for family celebrations.', 'photo-1503919005314-30d93d07d823'],
  ['mini-match-set', 'Mini Match Set', 29500, 'childrens-clothing', 'A matching set created for movement and memorable photos.', 'photo-1519238263530-99bdd11df2ea'],
] as const;

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

export const demoProducts: Product[] = samples.map(([slug, name, priceNgn, categorySlug, description, image], index) => {
  const category = categories.find((item) => item.slug === categorySlug)!;
  const imageUrl = `https://images.unsplash.com/${image}?auto=format&fit=crop&w=1000&q=82`;
  return {
    id: `demo-${slug}`,
    name,
    slug,
    description,
    category,
    priceNgn,
    isDemo: true,
    published: true,
    images: [{
      id: `demo-image-${index + 1}`,
      url: imageUrl,
      alt: `${name} sample fashion photograph. Illustrative only, not a Maria Stitches product photograph.`,
      sourceUrl: imageUrl,
      photographer: null,
      license: 'Unsplash License; verify image details before production use',
    }],
    variants: sizeOptions.map((size) => ({ id: `demo-variant-${slug}-${size.toLowerCase()}`, size, color: null, stockQuantity: 0, available: true })),
  };
});

export { categories as demoCategories };
