'use client';

import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import type { Category, Product } from '@/lib/types';

export function ProductGrid({ products, categories, whatsappNumber, initialCategory = 'all' }: { products: Product[]; categories: Category[]; whatsappNumber: string; initialCategory?: string }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const results = products.filter((product) => (category === 'all' || product.category.slug === category)
      && (!normalizedQuery || `${product.name} ${product.category.name} ${product.description}`.toLowerCase().includes(normalizedQuery))
      && (!minPrice || product.priceNgn >= Number(minPrice))
      && (!maxPrice || product.priceNgn <= Number(maxPrice)));
    if (sort === 'price-asc') results.sort((a, b) => a.priceNgn - b.priceNgn);
    if (sort === 'price-desc') results.sort((a, b) => b.priceNgn - a.priceNgn);
    if (sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));
    return results;
  }, [products, query, category, sort, minPrice, maxPrice]);

  return <>
    <div className="shop-tools" aria-label="Filter products">
      <label className="sr-only" htmlFor="product-search">Search styles</label><input id="product-search" className="field-control" type="search" placeholder="Search styles" value={query} onChange={(event) => setQuery(event.target.value)} />
      <label className="sr-only" htmlFor="category-filter">Category</label><select id="category-filter" className="field-control" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select>
      <label className="sr-only" htmlFor="min-price">Minimum price in naira</label><input id="min-price" className="field-control" type="number" min="0" placeholder="Min ₦" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
      <label className="sr-only" htmlFor="max-price">Maximum price in naira</label><input id="max-price" className="field-control" type="number" min="0" placeholder="Max ₦" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
      <label className="sr-only" htmlFor="sort-products">Sort products</label><select id="sort-products" className="field-control" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A to Z</option></select>
    </div>
    <p className="results-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'style' : 'styles'}</p>
    {filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard product={product} whatsappNumber={whatsappNumber} key={product.id} />)}</div> : <div className="empty-state">No styles match your search. Try another name or category.</div>}
  </>;
}
