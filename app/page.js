'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import { productApi } from '@/lib/api';

const CATEGORIES = ['Todos', 'Eletrônicos', 'Roupas', 'Casa', 'Esportes', 'Livros'];

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchTerm = searchParams.get('search') || '';
  const category   = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    setPage(0);
  }, [searchTerm, category]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        let data;
        if (category && category !== 'Todos') {
          const list = await productApi.getByCategory(category);
          data = { content: list, totalPages: 1 };
        } else {
          data = await productApi.list({ page, size: 12, sort: sortBy, term: searchTerm || undefined });
        }
        if (!cancelled) {
          setProducts(data.content || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [searchTerm, category, page, sortBy]);

  function setCategory(cat) {
    const params = new URLSearchParams(searchParams);
    if (cat === 'Todos') params.delete('category');
    else params.set('category', cat);
    params.delete('search');
    router.push(`/?${params}`);
  }

  const activeCategory = category || 'Todos';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="font-display text-6xl sm:text-8xl text-ink-50 leading-none mb-4"
            style={{fontFamily:'Cormorant Garamond, serif', fontWeight:300}}>
          {searchTerm ? (
            <><span className="text-gold-400">"{searchTerm}"</span></>
          ) : (
            <>Descubra o <em className="text-gold-400">extraordinário</em></>
          )}
        </h1>
        <p className="text-ink-300 tracking-widest uppercase text-xs">
          {searchTerm ? `Resultados para "${searchTerm}"` : 'Curadoria de produtos premium'}
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`text-xs tracking-widest uppercase px-4 py-2 border transition-all ${
                activeCategory === cat
                  ? 'bg-gold-500 border-gold-500 text-ink-900'
                  : 'border-ink-500 text-ink-300 hover:border-gold-500 hover:text-gold-400'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal size={14} className="text-ink-400" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="bg-ink-700 border border-ink-500 text-ink-200 text-xs px-3 py-2 focus:outline-none focus:border-gold-500">
            <option value="name">Nome</option>
            <option value="price,asc">Menor preço</option>
            <option value="price,desc">Maior preço</option>
            <option value="createdAt,desc">Mais recentes</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-4xl text-ink-600 mb-2" style={{fontFamily:'Cormorant Garamond, serif'}}>Nenhum produto encontrado</p>
          <p className="text-ink-400 text-sm">Tente uma busca diferente</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p}
              style={{ animationDelay: `${i * 50}ms`, animation: 'fadeUp 0.5s ease forwards', opacity: 0 }} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
            className="p-2 border border-ink-500 text-ink-300 hover:border-gold-500 hover:text-gold-400 transition-all disabled:opacity-30">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-ink-300 tracking-widest uppercase">
            Página {page + 1} de {totalPages}
          </span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
            className="p-2 border border-ink-500 text-ink-300 hover:border-gold-500 hover:text-gold-400 transition-all disabled:opacity-30">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="h-screen bg-ink-900" />}>
      <HomeContent />
    </Suspense>
  );
}
