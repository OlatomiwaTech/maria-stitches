export interface CollectionItem {
  title: string;
  description: string;
  badge: string;
  accent: string;
}

export const collections: CollectionItem[] = [
  {
    title: "Signature Eveningwear",
    description: "Elevated silhouettes for unforgettable occasions.",
    badge: "New Arrivals",
    accent: "from-[#5b1028] via-[#8B1E3F] to-[#c78e31]",
  },
  {
    title: "Everyday Luxe",
    description: "Soft tailoring and refined essentials for daily dressing.",
    badge: "Best Seller",
    accent: "from-[#171212] via-[#55423a] to-[#c6a96a]",
  },
  {
    title: "Girls' Edit",
    description: "Playful, polished pieces designed for growing style.",
    badge: "Featured",
    accent: "from-[#402e32] via-[#8a4d5b] to-[#d4af37]",
  },
];
