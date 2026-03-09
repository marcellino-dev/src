'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X, Save, Package } from 'lucide-react';
import { productApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toaster';

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', category: '', imageUrl: '' };

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | product object
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) router.push('/auth/login');
  }, [user, isAdmin, authLoading]);

  function loadProducts() {
    setLoading(true);
    productApi.list({ page, size: 15, sort: 'createdAt,desc' })
      .then(data => { setProducts(data.content || []); setTotalPages(data.totalPages || 1); })
      .catch(() => toast?.('Erro ao carregar produtos', 'error'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { if (isAdmin) loadProducts(); }, [page, isAdmin]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setFormError('');
    setModal('create');
  }

  function openEdit(p) {
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, category: p.category || '', imageUrl: p.imageUrl || '' });
    setFormError('');
    setModal(p);
  }

  function set(field) {
    return e => setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function handleSave() {
    setFormError('');
    if (!form.name || !form.price || form.stock === '') {
      setFormError('Nome, preço e estoque são obrigatórios');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (modal === 'create') {
        await productApi.create(payload);
        toast?.('Produto criado com sucesso!');
      } else {
        await productApi.update(modal.id, payload);
        toast?.('Produto atualizado!');
      }
      setModal(null);
      loadProducts();
    } catch (err) {
      setFormError(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Desativar este produto?')) return;
    try {
      await productApi.deactivate(id);
      toast?.('Produto desativado');
      loadProducts();
    } catch (err) {
      toast?.(err.message || 'Erro ao desativar', 'error');
    }
  }

  if (authLoading || !isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="font-display text-5xl text-ink-50"
              style={{fontFamily:'Cormorant Garamond, serif', fontWeight:300}}>
            Dashboard <em className="text-gold-400">Admin</em>
          </h1>
          <p className="text-ink-400 text-sm mt-1">{products.length} produtos na página</p>
        </div>
        <button onClick={openCreate} className="btn-gold flex items-center gap-2">
          <Plus size={16} /> Novo produto
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-600 text-xs tracking-widest uppercase text-ink-400">
              <th className="text-left py-3 pr-4">Produto</th>
              <th className="text-left py-3 pr-4 hidden sm:table-cell">Categoria</th>
              <th className="text-right py-3 pr-4">Preço</th>
              <th className="text-right py-3 pr-4">Estoque</th>
              <th className="text-right py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-ink-700">
                  {[...Array(5)].map((_, j) => (
                    <td key={j} className="py-4 pr-4"><div className="h-4 skeleton rounded" /></td>
                  ))}
                </tr>
              ))
            ) : products.map(p => (
              <tr key={p.id} className="border-b border-ink-700 hover:bg-ink-800/50 transition-colors group">
                <td className="py-4 pr-4">
                  <p className="text-ink-100 group-hover:text-gold-400 transition-colors">{p.name}</p>
                  <p className="text-xs text-ink-400 truncate max-w-xs">{p.description}</p>
                </td>
                <td className="py-4 pr-4 hidden sm:table-cell">
                  <span className="text-xs text-ink-400 bg-ink-700 px-2 py-1">{p.category || '—'}</span>
                </td>
                <td className="py-4 pr-4 text-right font-display text-gold-400"
                    style={{fontFamily:'Cormorant Garamond, serif'}}>
                  {Number(p.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className={`py-4 pr-4 text-right text-xs ${p.stock === 0 ? 'text-red-400' : 'text-ink-300'}`}>
                  {p.stock}
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(p)}
                      className="p-1.5 text-ink-400 hover:text-gold-400 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-ink-400 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className={`w-8 h-8 text-xs border transition-all ${page === i ? 'bg-gold-500 border-gold-500 text-ink-900' : 'border-ink-500 text-ink-300 hover:border-gold-500'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-ink-800 border border-ink-600 p-8 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-ink-100"
                  style={{fontFamily:'Cormorant Garamond, serif'}}>
                {modal === 'create' ? 'Novo produto' : `Editar: ${modal.name}`}
              </h2>
              <button onClick={() => setModal(null)} className="text-ink-400 hover:text-gold-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Nome *', field: 'name', type: 'text', placeholder: 'Nome do produto' },
                { label: 'Descrição', field: 'description', type: 'text', placeholder: 'Descrição breve' },
                { label: 'Preço *', field: 'price', type: 'number', placeholder: '0.00' },
                { label: 'Estoque *', field: 'stock', type: 'number', placeholder: '0' },
                { label: 'Categoria', field: 'category', type: 'text', placeholder: 'Ex: Eletrônicos' },
                { label: 'URL da imagem', field: 'imageUrl', type: 'text', placeholder: 'https://...' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs tracking-widest uppercase text-ink-300 mb-2">{label}</label>
                  <input type={type} value={form[field]} onChange={set(field)}
                    placeholder={placeholder} className="input-base"
                    step={field === 'price' ? '0.01' : undefined} min={field === 'stock' || field === 'price' ? '0' : undefined} />
                </div>
              ))}
            </div>

            {formError && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3 mt-4">{formError}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="btn-outline flex-1">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 flex items-center justify-center gap-2">
                <Save size={14} /> {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
