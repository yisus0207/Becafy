'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Header from '@/components/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      try {
        await login(email, password);
        showToast('¡Bienvenido de nuevo!', 'success');
        router.push('/');
      } catch (err: any) {
        showToast(err.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos. ¿Ya te registraste?'
          : 'Error al iniciar sesión: ' + err.message, 'error');
      }
    }
  };

  return (
    <main>
      <Header />
      <div className="auth-container">
        <div className="glass-panel auth-card animate-slide-up">
          <div className="auth-header">
            <h1>Bienvenido de nuevo</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Inicia sesión para acceder a más becas y guardar tus favoritas.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div className="input-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="tu@email.com"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1rem' }}>
              Entrar ahora
            </button>
          </form>

          <p className="auth-footer">
            ¿No tienes cuenta?
            <Link href="/auth/register" className="auth-link">Regístrate gratis</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
