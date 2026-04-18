'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatCard from '@/components/admin/StatCard';
import UsersTable from '@/components/admin/UsersTable';
import ScholarshipsTable from '@/components/admin/ScholarshipsTable';
import PaymentsTable from '@/components/admin/PaymentsTable';
import {
  Users,
  GraduationCap,
  TrendingUp,
  Activity,
  Eye,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User, Scholarship, Payment } from '@/types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalScholarships: 0,
    monthlyIncome: 0,
    totalViews: 0, // Simulated for now
    activeExecutions: 0 // Simulated for now
  });
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchStats();
  }, [selectedMonth, selectedYear]);

  async function fetchStats() {
    setLoading(true);
    try {
      // 1. Total Users
      const { count: userCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true });

      // 2. Premium Users
      const { count: premiumCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true);

      // 3. Total Scholarships
      const { count: scholarshipCount } = await supabase.from('opportunities').select('*', { count: 'exact', head: true });

      // 4. Monthly Income (from payments table)
      // Note: We expect the payments table to exist after SQL migration
      const startDate = new Date(selectedYear, selectedMonth, 1).toISOString();
      const endDate = new Date(selectedYear, selectedMonth + 1, 0).toISOString();

      const { data: payments, error: paymentError } = await supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', startDate)
        .lte('payment_date', endDate)
        .eq('status', 'completed');

      const monthlyTotal = (payments || []).reduce((acc, curr) => acc + Number(curr.amount), 0);

      setStats({
        totalUsers: userCount || 0,
        premiumUsers: premiumCount || 0,
        totalScholarships: scholarshipCount || 0,
        monthlyIncome: monthlyTotal,
        totalViews: (userCount || 0) * 42, // Mocking views for now
        activeExecutions: 12 // Mocking n8n executions for now
      });
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
  }

  const renderDashboard = () => (
    <div className="space-y-10 animate-slide-up pb-10 flex-shrink-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-display text-white mb-2">Comandos del Sistema</h1>
          <p className="text-text-secondary text-lg">Monitorea el crecimiento y rendimiento de Becafy en tiempo real.</p>
        </div>

        <div className="flex items-center gap-3 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="input !py-2 !w-32 bg-transparent !border-none text-sm font-semibold cursor-pointer"
          >
            {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <div className="w-[1px] h-6 bg-white/10" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="input !py-2 !w-24 bg-transparent !border-none text-sm font-semibold cursor-pointer"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          label="Usuarios Totales"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: 12, isUp: true }}
          color="#6366f1"
        />
        <StatCard
          label="Suscripciones Premium"
          value={stats.premiumUsers}
          icon={Activity}
          trend={{ value: 8, isUp: true }}
          color="#a855f7"
        />
        <StatCard
          label="Ingresos Mensuales"
          value={`$${stats.monthlyIncome.toLocaleString()}`}
          icon={DollarSign}
          subtext={`Periodo: ${new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(new Date(2024, selectedMonth))} ${selectedYear}`}
          color="#10b981"
        />
        <StatCard
          label="Becas Activas"
          value={stats.totalScholarships}
          icon={GraduationCap}
          color="#f59e0b"
        />
        <StatCard
          label="Visitas Totales"
          value={stats.totalViews.toLocaleString()}
          icon={Eye}
          color="#ec4899"
        />
        <StatCard
          label="Ejecuciones n8n"
          value={stats.activeExecutions}
          icon={TrendingUp}
          subtext="Actualizado hace 5m"
          color="#06b6d4"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mt-10">
        <div className="glass-v2 p-8 xl:col-span-3">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-accent-primary rounded-full" />
              Rendimiento de Datos
            </h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase">
                <span className="w-2 h-2 rounded-full bg-accent-primary" /> Vistas
              </div>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-3">
            {[45, 67, 43, 89, 56, 78, 90, 65, 87, 45, 34, 45].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-white/[0.03] rounded-t-xl transition-all duration-500 hover:bg-accent-primary/20 relative group overflow-hidden"
              >
                <div
                  className="absolute bottom-0 left-0 w-full bg-accent-primary/30 rounded-t-xl transition-all duration-700 group-hover:bg-accent-primary"
                  style={{ height: `${h}%` }}
                />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all border border-white/10 shadow-xl pointer-events-none">
                  {h * 120}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[11px] text-text-muted font-bold uppercase tracking-widest px-2">
            {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="glass-v2 p-8 xl:col-span-2">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="w-2 h-8 bg-accent-secondary rounded-full" />
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center text-accent-secondary border border-accent-secondary/20 group-hover:scale-110 transition-transform">
                  <Activity size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">Actualización de Sistema</p>
                  <p className="text-[11px] text-text-muted truncate">Log de ejecución #{i}542 completado</p>
                </div>
                <span className="text-[10px] text-text-muted font-bold whitespace-nowrap bg-white/5 px-2 py-1 rounded-lg">
                  {i * 12}m ago
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 rounded-xl border border-white/5 text-xs font-bold text-text-muted hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
            Ver todas las actividades
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto bg-[#050512] relative scroll-smooth">
        {/* Background Subtle Ambience */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-accent-primary/5 blur-[180px] -z-10 rounded-full opacity-30" />
        <div className="fixed bottom-0 left-40 w-[600px] h-[600px] bg-accent-secondary/5 blur-[150px] -z-10 rounded-full opacity-20" />

        <div className="p-10 max-w-1600 mx-auto w-full">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && (
            <div className="animate-slide-up flex-col gap-6">
              <div className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Gestión de Usuarios</h1>
                <p className="text-text-secondary text-lg">Administra roles, suscripciones y perfiles de la comunidad Becafy.</p>
              </div>
              <UsersTable />
            </div>
          )}
          {activeTab === 'scholarships' && (
            <div className="animate-slide-up flex-col gap-6">
              <div className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Inventario de Becas</h1>
                <p className="text-text-secondary text-lg">Control total sobre las oportunidades publicadas en la plataforma.</p>
              </div>
              <ScholarshipsTable />
            </div>
          )}
          {activeTab === 'income' && (
            <div className="animate-slide-up flex-col gap-6">
              <div className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Métricas Financieras</h1>
                <p className="text-text-secondary text-lg">Análisis detallado de ingresos por suscripciones y planes.</p>
              </div>
              <PaymentsTable month={selectedMonth} year={selectedYear} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
