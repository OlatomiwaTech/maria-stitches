export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  sourceUrl: string;
  photographer: string | null;
  license: string;
};

export type ProductVariant = {
  id: string;
  size: string;
  color: string | null;
  stockQuantity: number;
  available: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  priceNgn: number;
  isDemo: boolean;
  published: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
};

export type CartLine = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  color: string | null;
  unitPriceNgn: number;
  quantity: number;
  isDemo: boolean;
};
