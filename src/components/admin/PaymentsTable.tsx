'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar, 
  User as UserIcon,
  Search,
  Download
} from 'lucide-react';

export default function PaymentsTable({ month, year }: { month: number, year: number }) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, [month, year]);

  async function fetchPayments() {
    setLoading(true);
    try {
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0).toISOString();

      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          user_profiles:user_id (email, first_name, last_name)
        `)
        .gte('payment_date', startDate)
        .lte('payment_date', endDate)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      
      setPayments(data || []);
      const sum = (data || []).reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
      setTotal(sum);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-v2 p-6 border-l-4 border-l-diff-easy">
          <p className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-2">Ingresos del Mes</p>
          <div className="flex items-center gap-4">
            <h3 className="text-3xl font-bold font-display">${total.toLocaleString()} COP</h3>
            <div className="p-2 rounded-lg bg-diff-easy/10 text-diff-easy">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-text-muted mt-2">Basado en {payments.length} transacciones</p>
        </div>

        <div className="glass-v2 p-6 border-l-4 border-l-accent-primary">
          <p className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-2">Ticket Promedio</p>
          <div className="flex items-center gap-4">
            <h3 className="text-3xl font-bold font-display">
              ${payments.length > 0 ? (total / payments.length).toLocaleString() : 0} COP
            </h3>
            <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>

        <div className="glass-v2 p-6 border-l-4 border-l-accent-secondary">
          <p className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-2">Planes Activos</p>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-lg font-bold">{payments.filter(p => p.plan_type === 'monthly').length}</p>
              <p className="text-[10px] text-text-muted">Mes</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{payments.filter(p => p.plan_type === 'yearly').length}</p>
              <p className="text-[10px] text-text-muted">Año</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{payments.filter(p => p.plan_type === 'lifetime').length}</p>
              <p className="text-[10px] text-text-muted">Vida</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="text-accent-secondary" />
          Historial de Pagos
        </h3>
        <button className="btn btn-secondary !py-2 flex items-center gap-2 text-sm">
          <Download size={16} />
          Descargar Reporte
        </button>
      </div>

      <div className="glass-v2 overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Usuario</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Plan</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Monto</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Fecha</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted text-right">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted">Cargando transacciones...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted italic">No se encontraron pagos en este periodo.</td>
                </tr>
              ) : payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-muted">
                        <UserIcon size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {p.user_profiles?.first_name 
                            ? `${p.user_profiles.first_name} ${p.user_profiles.last_name || ''}`
                            : 'ID: ' + p.user_id.slice(0, 8)
                          }
                        </p>
                        <p className="text-[10px] text-text-muted">{p.user_profiles?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold capitalize text-text-secondary">{p.plan_type}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-bold text-diff-easy">${Number(p.amount).toLocaleString()} COP</span>
                  </td>
                  <td className="p-4 text-xs text-text-muted">
                    {new Date(p.payment_date).toLocaleDateString()} {new Date(p.payment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4 text-right">
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-diff-easy/10 text-diff-easy uppercase tracking-widest border border-diff-easy/20">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
