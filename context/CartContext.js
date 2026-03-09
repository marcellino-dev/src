'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  function persist(newItems) {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  }

  function addItem(product, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      const updated = existing
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { ...product, qty }];
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }

  function removeItem(id) {
    persist(items.filter(i => i.id !== id));
  }

  function updateQty(id, qty) {
    if (qty < 1) return removeItem(id);
    persist(items.map(i => i.id === id ? { ...i, qty } : i));
  }

  function clearCart() {
    persist([]);
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count  = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
