'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, total, count } = useCart();

  const formatted = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center animate-fade-in">
      <ShoppingBag size={64} className="text-ink-600 mx-auto mb-6" />
      <h2 className="font-display text-4xl text-ink-400 mb-4"
          style={{fontFamily:'Cormorant Garamond, serif', fontWeight:300}}>
        Seu carrinho está vazio
      </h2>
      <p className="text-ink-400 mb-8 text-sm">Explore nossa curadoria de produtos</p>
      <Link href="/" className="btn-gold inline-flex items-center gap-2">
        Continuar comprando <ArrowRight size={14} />
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
      <div className="flex items-end justify-between mb-10">
        <h1 className="font-display text-5xl text-ink-50"
            style={{fontFamily:'Cormorant Garamond, serif', fontWeight:300}}>
          Carrinho <em className="text-gold-400">({count})</em>
        </h1>
        <button onClick={clearCart} className="text-xs text-ink-400 hover:text-red-400 transition-colors tracking-widest uppercase">
          Limpar tudo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => {
            const price = (item.price * item.qty).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            return (
              <div key={item.id} className="flex gap-4 bg-ink-800 border border-ink-600 p-4">
                <div className="relative w-20 h-20 bg-ink-700 shrink-0">
                  {item.imageUrl
                    ? <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={24} className="text-ink-500" /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink-100 truncate mb-1">{item.name}</p>
                  {item.category && <p className="text-xs text-ink-400 mb-3">{item.category}</p>}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-ink-500">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}
                        className="px-2 py-1 text-ink-300 hover:text-gold-400 transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs text-ink-100">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}
                        className="px-2 py-1 text-ink-300 hover:text-gold-400 transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)}
                      className="text-ink-400 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="font-display text-xl text-gold-400 shrink-0"
                     style={{fontFamily:'Cormorant Garamond, serif'}}>
                  {price}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-ink-800 border border-ink-600 p-6 h-fit">
          <h2 className="font-display text-2xl text-ink-100 mb-6"
              style={{fontFamily:'Cormorant Garamond, serif'}}>Resumo</h2>
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between text-ink-300">
              <span>Subtotal ({count} itens)</span>
              <span>{formatted}</span>
            </div>
            <div className="flex justify-between text-ink-300">
              <span>Frete</span>
              <span className="text-green-400">Grátis</span>
            </div>
            <hr className="border-ink-600" />
            <div className="flex justify-between text-ink-100 font-medium text-base">
              <span>Total</span>
              <span className="font-display text-gold-400 text-xl"
                    style={{fontFamily:'Cormorant Garamond, serif'}}>{formatted}</span>
            </div>
          </div>
          <button className="w-full btn-gold flex items-center justify-center gap-2">
            Finalizar compra <ArrowRight size={14} />
          </button>
          <Link href="/" className="block text-center mt-4 text-xs text-ink-400 hover:text-gold-400 transition-colors tracking-widest uppercase">
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
