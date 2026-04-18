'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  Settings,
  ChevronRight,
  LogOut,
  Shield
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'scholarships', label: 'Becas', icon: GraduationCap },
    { id: 'income', label: 'Ingresos', icon: CreditCard },
  ];

  return (
    <aside className="glass-v2-heavy h-full w-72 flex-shrink-0 flex flex-col p-6 border-r border-white/5 z-20">
      <div className="mb-12 px-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <Shield className="text-white" size={18} />
          </div>
          <h2 className="text-2xl font-bold text-white font-display">Super Admin</h2>
        </div>
        <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Becafy Management</p>
      </div>

      <nav className="flex-1 flex flex-col gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                flex items-center justify-between w-full p-3.5 rounded-xl transition-all duration-300 group
                ${isActive
                  ? 'bg-accent-primary/10 text-white border border-accent-primary/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                  : 'text-text-secondary hover:bg-white/[0.03] hover:text-white border border-transparent'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className={`transition-colors ${isActive ? 'text-accent-primary' : 'group-hover:text-white'}`} />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-accent-primary" />}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-3">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 p-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/[0.03] transition-all"
        >
          <LogOut size={18} className="rotate-180" />
          <span className="font-medium text-sm">Volver a la App</span>
        </button>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-accent-primary/20 text-white border border-accent-primary/30 hover:bg-accent-primary/30 transition-all font-bold text-sm"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
