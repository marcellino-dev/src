'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, User, LogOut, Shield, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  }

  function handleLogout() {
    logout();
    router.push('/');
    setOpen(false);
  }

  const navLinks = [
    { href: '/', label: 'Loja' },
    { href: '/?category=Eletrônicos', label: 'Eletrônicos' },
    { href: '/?category=Roupas', label: 'Roupas' },
    { href: '/?category=Casa', label: 'Casa' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink-900/95 backdrop-blur-sm border-b border-ink-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="font-display text-2xl text-gold-400 tracking-widest shrink-0"
              style={{fontFamily:'Cormorant Garamond, serif', letterSpacing:'0.2em'}}>
          LUXE
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className="text-xs tracking-widest uppercase text-ink-200 hover:text-gold-400 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input autoFocus value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar..." className="bg-ink-700 border border-ink-500 px-3 py-1.5 text-sm text-ink-50 focus:outline-none focus:border-gold-500 w-40" />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X size={16} className="text-ink-300" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-ink-200 hover:text-gold-400 transition-colors">
              <Search size={18} />
            </button>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative text-ink-200 hover:text-gold-400 transition-colors">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-500 text-ink-900 text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 transition-colors tracking-widest uppercase">
                  <Shield size={14} />
                  Admin
                </Link>
              )}
              <span className="text-xs text-ink-300">{user.name}</span>
              <button onClick={handleLogout} className="text-ink-300 hover:text-gold-400 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden md:flex items-center gap-1 text-xs text-ink-200 hover:text-gold-400 transition-colors tracking-widest uppercase">
              <User size={16} />
              Entrar
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden text-ink-200" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-ink-800 border-t border-ink-700 px-4 py-6 flex flex-col gap-5 animate-fade-in">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-sm tracking-widest uppercase text-ink-200 hover:text-gold-400 transition-colors">
              {l.label}
            </Link>
          ))}
          <hr className="border-ink-600" />
          {user ? (
            <>
              <p className="text-xs text-ink-400">Olá, {user.name}</p>
              {isAdmin && <Link href="/admin" onClick={() => setOpen(false)} className="text-sm text-gold-400">Dashboard Admin</Link>}
              <button onClick={handleLogout} className="text-left text-sm text-ink-200">Sair</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setOpen(false)} className="text-sm text-ink-200">Entrar</Link>
              <Link href="/auth/register" onClick={() => setOpen(false)} className="text-sm text-ink-200">Cadastrar</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
