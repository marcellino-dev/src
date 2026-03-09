'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Minus, Plus, Tag, Package } from 'lucide-react';
import { productApi } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toaster';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi.getById(id)
      .then(setProduct)
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="aspect-square skeleton" />
      <div className="space-y-4">
        <div className="h-8 skeleton rounded w-3/4" />
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-2/3" />
        <div className="h-10 skeleton rounded w-1/3 mt-6" />
      </div>
    </div>
  );

  if (!product) return null;

  const price = Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function handleAdd() {
    addItem(product, qty);
    toast?.(`${qty}x "${product.name}" adicionado ao carrinho`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-ink-300 hover:text-gold-400 transition-colors text-sm tracking-widest uppercase mb-10">
        <ArrowLeft size={14} /> Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Image */}
        <div className="relative aspect-square bg-ink-800 overflow-hidden">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag size={80} className="text-ink-600" />
            </div>
          )}
          {product.category && (
            <span className="absolute top-4 left-4 text-xs tracking-widest uppercase bg-ink-900/80 px-3 py-1.5 text-gold-400 border border-gold-500/30">
              {product.category}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-4xl sm:text-5xl text-ink-50 leading-tight mb-4"
              style={{fontFamily:'Cormorant Garamond, serif', fontWeight:300}}>
            {product.name}
          </h1>

          {product.description && (
            <p className="text-ink-300 leading-relaxed mb-8">{product.description}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mb-8 text-xs text-ink-400">
            {product.category && (
              <span className="flex items-center gap-1"><Tag size={12} /> {product.category}</span>
            )}
            <span className="flex items-center gap-1">
              <Package size={12} />
              {product.stock > 0 ? `${product.stock} disponíveis` : 'Esgotado'}
            </span>
          </div>

          {/* Price */}
          <div className="font-display text-5xl text-gold-400 mb-8"
               style={{fontFamily:'Cormorant Garamond, serif'}}>
            {price}
          </div>

          {/* Qty + Add */}
          {product.stock > 0 ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-ink-500">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 py-3 text-ink-300 hover:text-gold-400 transition-colors">
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-ink-100">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="px-4 py-3 text-ink-300 hover:text-gold-400 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={handleAdd}
                className="flex-1 btn-gold flex items-center justify-center gap-2">
                <ShoppingBag size={16} />
                Adicionar ao carrinho
              </button>
            </div>
          ) : (
            <p className="text-red-400 text-sm tracking-widest uppercase">Produto esgotado</p>
          )}
        </div>
      </div>
    </div>
  );
}
