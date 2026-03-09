'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toaster';

export default function ProductCard({ product, style }) {
  const { addItem } = useCart();
  const toast = useToast();

  function handleAdd(e) {
    e.preventDefault();
    addItem(product, 1);
    toast?.('Produto adicionado ao carrinho');
  }

  const price = Number(product.price).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL',
  });

  return (
    <Link href={`/products/${product.id}`}
      className="group block bg-ink-800 border border-ink-600 hover:border-gold-500/50 transition-all duration-300"
      style={style}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-ink-700">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={40} className="text-ink-500" />
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-ink-900/70 flex items-center justify-center">
            <span className="text-xs tracking-widest text-ink-300 uppercase">Esgotado</span>
          </div>
        )}
        {product.category && (
          <span className="absolute top-3 left-3 text-xs tracking-widest uppercase bg-ink-900/80 px-2 py-1 text-gold-400">
            {product.category}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-ink-100 group-hover:text-gold-400 transition-colors truncate mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-ink-300 truncate mb-3">{product.description || '\u00a0'}</p>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg text-gold-400" style={{fontFamily:'Cormorant Garamond, serif'}}>
            {price}
          </span>
          <button onClick={handleAdd} disabled={product.stock === 0}
            className="bg-ink-600 hover:bg-gold-500 hover:text-ink-900 text-ink-200 p-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <ShoppingBag size={14} />
          </button>
        </div>
        <p className="text-xs text-ink-400 mt-1">{product.stock} em estoque</p>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-ink-800 border border-ink-600">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-full" />
        <div className="h-6 skeleton rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}
