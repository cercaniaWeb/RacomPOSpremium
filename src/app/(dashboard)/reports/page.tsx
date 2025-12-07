'use client';

import React, { useState } from 'react';
import ReportCard from '@/components/organisms/ReportCard';
import SalesChart from '@/components/organisms/SalesChart';
import TopProductsChart from '@/components/organisms/TopProductsChart';
import Text from '@/components/atoms/Text';
import ChatbotModal from '@/components/organisms/ChatbotModal';
import { Sparkles } from 'lucide-react';
import { useReportMetrics } from '@/hooks/useReportMetrics';
import { useRouter } from 'next/navigation';

const ReportsPage = () => {
  const router = useRouter();
  const [showChatbot, setShowChatbot] = useState(false);
  const { metrics, changes, loading, error } = useReportMetrics();

  // Report data mapped from real metrics
  const reportData = [
    {
      id: 'sales',
      title: 'Ventas Totales',
      value: loading ? 'Cargando...' : `$${metrics.totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: changes.sales,
      trend: (changes.sales >= 0 ? 'up' as const : 'down' as const),
      description: 'Comparado con el mes anterior',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'orders',
      title: 'Pedidos',
      value: loading ? 'Cargando...' : metrics.totalOrders.toString(),
      change: changes.orders,
      trend: (changes.orders >= 0 ? 'up' as const : 'down' as const),
      description: 'Comparado con el mes anterior',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      id: 'products-sold',
      title: 'Productos Vendidos',
      value: loading ? 'Cargando...' : metrics.totalProducts.toString(),
      change: changes.products,
      trend: (changes.products >= 0 ? 'up' as const : 'down' as const),
      description: 'Comparado con el mes anterior',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    {
      id: 'avg-order',
      title: 'Pedido Promedio',
      value: loading ? 'Cargando...' : `$${metrics.avgOrder.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: changes.avgOrder,
      trend: (changes.avgOrder >= 0 ? 'up' as const : 'down' as const),
      description: 'Comparado con el mes anterior',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Text variant="h3" className="font-bold text-foreground">Reportes</Text>
          <Text variant="body" className="text-muted-foreground">Análisis de desempeño del negocio</Text>
        </div>

        {/* AI Chatbot Button */}
        <button
          onClick={() => setShowChatbot(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Sparkles size={20} />
          <span className="font-semibold">Asistente IA</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <Text variant="body" className="text-red-400">
            Error al cargar métricas: {error}
          </Text>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {reportData.map((report) => (
          <ReportCard
            key={report.id}
            title={report.title}
            value={report.value}
            change={report.change}
            trend={report.trend}
            description={report.description}
            icon={report.icon}
            onAction={() => {
              if (report.id === 'products-sold') {
                router.push('/reports/inventario');
              } else {
                router.push('/reports/ventas');
              }
            }}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend Chart */}
        <div className="glass rounded-xl border border-white/10 shadow p-6">
          <Text variant="h4" className="font-semibold mb-4">Tendencia de Ventas (Últimos 7 días)</Text>
          <SalesChart data={[
            { date: 'Lun', amount: 1200 },
            { date: 'Mar', amount: 2100 },
            { date: 'Mie', amount: 800 },
            { date: 'Jue', amount: 1600 },
            { date: 'Vie', amount: 2300 },
            { date: 'Sab', amount: 3400 },
            { date: 'Dom', amount: 2800 },
          ]} />
        </div>

        {/* Top Products Chart */}
        <div className="glass rounded-xl border border-white/10 shadow p-6">
          <Text variant="h4" className="font-semibold mb-4">Productos Más Vendidos</Text>
          <TopProductsChart data={[
            { name: 'Coca Cola 600ml', quantity: 145 },
            { name: 'Sabritas Sal', quantity: 89 },
            { name: 'Galletas Maria', quantity: 76 },
            { name: 'Agua Ciel 1L', quantity: 65 },
            { name: 'Gansito', quantity: 54 },
          ]} />
        </div>
      </div>

      {/* Chatbot Modal */}
      <ChatbotModal isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </div>
  );
};

export default ReportsPage;