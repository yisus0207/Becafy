'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Zap, User, Eye, EyeOff, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es muy corto'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[a-zA-Z]/, 'Debe contener al menos una letra')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[@$!%*?&]/, 'Debe contener al menos un signo (@$!%*?&)')
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const password = watch('password', '');

  const strength = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[a-zA-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[@$!%*?&]/.test(password)) s++;
    return s;
  }, [password]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsRedirecting(true);
      const authData = await authRegister(data.email, data.password, data.name);

      // If session is null, it means email confirmation is required
      if (!authData?.session) {
        setNeedsConfirmation(true);
        setIsRedirecting(false);
        return;
      }

      // Virtual Onboarding Delay for "Wow" factor
      setTimeout(() => {
        showToast(`¡Bienvenido ${data.name}! Estamos preparando tus becas ideales...`, 'success');
        router.push('/profile');
      }, 2000);
    } catch (err: any) {
      setIsRedirecting(false);
      showToast(err.message || 'Error al crear la cuenta. Intenta de nuevo.', 'error');
    }
  };

  const onError = () => {
    if (errors.name) showToast(errors.name.message as string, 'error');
    else if (errors.email) showToast(errors.email.message as string, 'error');
    else if (errors.password) showToast(errors.password.message as string, 'error');
  };

  if (isRedirecting) {
    return (
      <main style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: 'var(--grad-main)',
        textAlign: 'center', padding: '2rem'
      }}>
        <div className="animate-pulse" style={{ marginBottom: '2rem' }}>
          <Sparkles size={64} color="var(--accent-primary)" />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Preparando tu Perfil Élite</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Analizando matches globales según tu perfil...</p>
        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)' }}>
          <Loader2 className="animate-spin" size={24} /> <span>Cargando futuro...</span>
        </div>
      </main>
    );
  }

  if (needsConfirmation) {
    return (
      <main style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', background: 'var(--grad-main)'
      }}>
        <div className="glass-v2-heavy animate-slide-up" style={{
          maxWidth: '500px', width: '100%', padding: '4rem',
          borderRadius: 'var(--radius-lg)', textAlign: 'center'
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
            color: 'var(--diff-easy)'
          }}>
            <Mail size={40} />
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem' }}>¡Casi listo!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Hemos enviado un enlace de confirmación a tu correo. Por favor, <strong>revisa tu bandeja de entrada</strong> (o carpeta de spam) para activar tu cuenta.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => router.push('/auth/login')}
              className="btn-glow"
              style={{ width: '100%', padding: '1.2rem' }}
            >
              Ir al Inicio de Sesión
            </button>
            <button
              onClick={() => setNeedsConfirmation(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
            >
              Intentar con otro correo
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', background: 'var(--grad-main)'
    }}>
      <div className="glass-v2-heavy animate-slide-up" style={{
        maxWidth: '480px', width: '100%', padding: '3.5rem',
        borderRadius: 'var(--radius-lg)', position: 'relative'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', padding: '0.75rem',
            background: 'var(--grad-accent)', borderRadius: '12px',
            marginBottom: '1rem', color: 'white'
          }}>
            <Zap size={28} fill="currentColor" />
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Únete a Becafy</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Tu futuro profesional empieza aquí.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

          <div className="form-group">
            <label className="form-label">¿Cómo te llamas?</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input
                {...register('name')}
                className="input"
                style={{ paddingLeft: '3rem', borderColor: errors.name ? 'var(--diff-hard)' : '' }}
                placeholder="Juan Pérez"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Universitario</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input
                {...register('email')}
                className="input"
                style={{ paddingLeft: '3rem', borderColor: errors.email ? 'var(--diff-hard)' : '' }}
                placeholder="juan@u.latam.edu"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña Segura</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="input"
                style={{ paddingLeft: '3rem', paddingRight: '3.5rem', borderColor: errors.password ? 'var(--diff-hard)' : '' }}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="strength-container">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`strength-segment ${strength >= step
                      ? (strength <= 2 ? 'active-red' : strength === 3 ? 'active-yellow' : 'active-green')
                      : ''
                    }`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn-glow"
            style={{
              marginTop: '1rem', width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              opacity: isValid ? 1 : 0.7
            }}
          >
            Crear mi cuenta <ArrowRight size={20} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          ¿Ya eres parte de Becafy? <Link href="/auth/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Entrar</Link>
        </p>
      </div>
    </main>
  );
}
