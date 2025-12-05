'use client';

import React, { useState, useEffect } from 'react';
import Text from '@/components/atoms/Text';
import { supabase } from '@/lib/supabase/client';

interface ProductSale {
    product_name: string;
    total_quantity: number;
    total_revenue: number;
}

const InventoryReportsPage = () => {
    const [products, setProducts] = useState<ProductSale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState('30');

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                setLoading(true);
                const now = new Date();
                const startDate = new Date();
                startDate.setDate(now.getDate() - parseInt(timeRange));

                // We need to join sale_items with products and sales
                // Since Supabase JS client doesn't support complex joins/group by easily without views or RPC,
                // we will fetch raw data and aggregate in client for now (or use a view if available).
                // For simplicity and speed, let's fetch sale_items and aggregate.

                const { data: saleItems, error } = await supabase
                    .from('sale_items')
                    .select(`
            quantity,
            price,
            product_name,
            sales!inner(created_at)
          `)
                    .gte('sales.created_at', startDate.toISOString());

                if (error) throw error;

                // Aggregate data
                const productMap = new Map<string, ProductSale>();

                saleItems?.forEach((item: any) => {
                    const name = item.product_name || 'Producto Desconocido';
                    const current = productMap.get(name) || { product_name: name, total_quantity: 0, total_revenue: 0 };

                    current.total_quantity += item.quantity;
                    current.total_revenue += item.quantity * item.price;

                    productMap.set(name, current);
                });

                const sortedProducts = Array.from(productMap.values())
                    .sort((a, b) => b.total_quantity - a.total_quantity)
                    .slice(0, 20); // Top 20

                setProducts(sortedProducts);
            } catch (err) {
                console.error('Error fetching top products:', err);
                setError('Error al cargar productos vendidos');
            } finally {
                setLoading(false);
            }
        };

        fetchTopProducts();
    }, [timeRange]);

    return (
        <div>
            <div className="mb-6">
                <Text variant="h3" className="font-bold text-white">Reporte de Inventario</Text>
                <Text variant="body" className="text-muted-foreground">Productos más vendidos</Text>
            </div>

            <div className="glass rounded-xl border border-white/10 shadow-xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <Text variant="h4" className="font-semibold text-white">Top Productos</Text>
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
                        <p className="text-muted-foreground">Cargando productos...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-400">{error}</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No se encontraron datos en este periodo</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cantidad Vendida</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ingresos Generados</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {products.map((product, index) => (
                                    <tr key={index} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{product.product_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.total_quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${product.total_revenue.toFixed(2)}</td>
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

export default InventoryReportsPage;
