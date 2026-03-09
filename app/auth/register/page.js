'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toaster';

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(field) {
    return e => setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.register(form);
      login(data);
      toast?.(`Conta criada! Bem-vindo, ${data.name}!`);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl text-ink-50 mb-2"
              style={{fontFamily:'Cormorant Garamond, serif', fontWeight:300}}>
            Criar conta
          </h1>
          <p className="text-ink-400 text-sm tracking-widest uppercase">Junte-se a nós</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-ink-300 mb-2">Nome completo *</label>
            <input value={form.name} onChange={set('name')} required placeholder="Seu nome" className="input-base" />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-ink-300 mb-2">E-mail *</label>
            <input type="email" value={form.email} onChange={set('email')} required placeholder="seu@email.com" className="input-base" />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-ink-300 mb-2">Senha * (mín. 6 caracteres)</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} required
                placeholder="••••••" className="input-base pr-12" />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-gold-400 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-ink-300 mb-2">Telefone</label>
            <input value={form.phone} onChange={set('phone')} placeholder="(00) 00000-0000" className="input-base" />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-ink-300 mb-2">Endereço</label>
            <input value={form.address} onChange={set('address')} placeholder="Rua, número, cidade" className="input-base" />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>
          )}

          <button type="submit" disabled={loading} className="w-full btn-gold mt-2">
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-400 mt-6">
          Já tem conta?{' '}
          <Link href="/auth/login" className="text-gold-400 hover:text-gold-300 transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
