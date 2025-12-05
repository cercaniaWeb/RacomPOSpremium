'use client';

import React, { useState, useEffect } from 'react';
import Text from '@/components/atoms/Text';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Sale {
  id: string;
  created_at: string;
  customer_name: string | null;
  total: number;
  source: string;
  payment_method: string;
}

const SalesReportsPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const startDate = new Date();
        startDate.setDate(now.getDate() - parseInt(timeRange));

        const { data, error } = await supabase
          .from('sales')
          .select('id, created_at, customer_name, total, source, payment_method')
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSales(data || []);
      } catch (err) {
        console.error('Error fetching sales:', err);
        setError('Error al cargar las ventas');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [timeRange]);

  const tableColumns: {
    key: string;
    title: string;
    render?: (value: any, item: Sale) => React.ReactNode;
  }[] = [
      { key: 'created_at', title: 'Fecha', render: (value: string) => format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: es }) },
      {
        key: 'source', title: 'Origen', render: (value: string) => (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${value === 'Manda2' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
            {value || 'POS'}
          </span>
        )
      },
      { key: 'customer_name', title: 'Cliente', render: (value: string) => value || 'Cliente General' },
      { key: 'payment_method', title: 'Método', render: (value: string) => value === 'cash' ? 'Efectivo' : (value === 'card' ? 'Tarjeta' : value) },
      { key: 'total', title: 'Total', render: (value: number) => `$${value.toFixed(2)}` },
      {
        key: 'actions',
        title: 'Acciones',
        render: (_: any, item: Sale) => (
          <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
            Ver Ticket
          </button>
        )
      }
    ];

  return (
    <div>
      <div className="mb-6">
        <Text variant="h3" className="font-bold text-white">Reportes de Ventas</Text>
        <Text variant="body" className="text-muted-foreground">Registro detallado de todas las ventas</Text>
      </div>

      <div className="glass rounded-xl border border-white/10 shadow-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <Text variant="h4" className="font-semibold text-white">Historial de Ventas</Text>
          <div className="flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="7" className="bg-gray-900">Últimos 7 días</option>
              <option value="30" className="bg-gray-900">Últimos 30 días</option>
              <option value="90" className="bg-gray-900">Últimos 90 días</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
            <p className="text-muted-foreground">Cargando ventas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">{error}</div>
        ) : sales.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No se encontraron ventas en este periodo</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  {tableColumns.map(column => (
                    <th
                      key={column.key}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {sales.map(sale => (
                  <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                    {tableColumns.map(column => (
                      <td key={`${sale.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {column.render
                          ? column.render((sale as any)[column.key], sale)
                          : (sale as any)[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReportsPage;