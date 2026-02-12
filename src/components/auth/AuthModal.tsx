'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { X, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        // Registrace
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Registrace selhala');
          setLoading(false);
          return;
        }

        // Po úspěšné registraci přihlaš
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Registrace proběhla, ale přihlášení selhalo');
        } else {
          onClose();
          window.location.reload();
        }
      } else {
        // Přihlášení
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Neplatné přihlašovací údaje');
        } else {
          onClose();
          window.location.reload();
        }
      }
    } catch (err) {
      setError('Něco se pokazilo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 pb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Přihlášení' : 'Registrace'}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Vítejte zpět! Přihlaste se ke svému účtu.' 
              : 'Vytvořte si účet a začněte objevovat přednášky.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jméno
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  placeholder="Vaše jméno"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                placeholder="vas@email.cz"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heslo
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>
            {mode === 'register' && (
              <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                <p>Heslo musí mít alespoň 8 znaků a obsahovat:</p>
                <ul className="list-disc list-inside ml-2 space-y-0.5">
                  <li>velké a malé písmeno</li>
                  <li>číslici</li>
                  <li>speciální znak</li>
                </ul>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg disabled:opacity-50"
          >
            {loading ? 'Zpracovávám...' : mode === 'login' ? 'Přihlásit se' : 'Zaregistrovat se'}
          </button>
        </form>

        {/* Divider */}
        <div className="px-8 py-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">nebo</span>
            </div>
          </div>
        </div>

        {/* Google Sign In Button */}
        <div className="px-8 pb-4">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: window.location.href })}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-gray-700 shadow-sm disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Pokračovat s Google
          </button>
        </div>

        {/* Switch mode */}
        <div className="px-8 pb-8 text-center">
          <p className="text-gray-600">
            {mode === 'login' ? 'Nemáte účet?' : 'Už máte účet?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              {mode === 'login' ? 'Zaregistrujte se' : 'Přihlaste se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}