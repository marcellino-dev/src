import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/Toaster';

export const metadata = {
  title: 'LUXE — E-commerce',
  description: 'Sua loja premium online',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen pt-16">{children}</main>
            <Toaster />
            <footer className="border-t border-ink-700 mt-24 py-12 text-center text-ink-300 text-sm font-body">
              <p className="font-display text-lg text-ink-200 mb-2" style={{fontFamily:'Cormorant Garamond, serif'}}>LUXE</p>
              <p>© {new Date().getFullYear()} — Todos os direitos reservados</p>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
