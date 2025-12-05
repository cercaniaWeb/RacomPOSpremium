import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ReportMetrics {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    avgOrder: number;
}

interface MetricChanges {
    sales: number;
    orders: number;
    products: number;
    avgOrder: number;
}

interface UseReportMetricsReturn {
    metrics: ReportMetrics;
    changes: MetricChanges;
    loading: boolean;
    error: string | null;
}

export const useReportMetrics = (): UseReportMetricsReturn => {
    const [metrics, setMetrics] = useState<ReportMetrics>({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        avgOrder: 0,
    });

    const [changes, setChanges] = useState<MetricChanges>({
        sales: 0,
        orders: 0,
        products: 0,
        avgOrder: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get date ranges
                const now = new Date();
                const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

                // Fetch current month sales
                const { data: currentSales, error: currentError } = await supabase
                    .from('sales')
                    .select('id, total')
                    .gte('created_at', startOfCurrentMonth.toISOString());

                if (currentError) throw currentError;

                // Fetch last month sales
                const { data: lastMonthSales, error: lastError } = await supabase
                    .from('sales')
                    .select('id, total')
                    .gte('created_at', startOfLastMonth.toISOString())
                    .lte('created_at', endOfLastMonth.toISOString());

                if (lastError) throw lastError;

                // Fetch current month sale items (for product count)
                const { data: currentItems, error: itemsError } = await supabase
                    .from('sale_items')
                    .select('quantity, sale_id, sales!inner(created_at)')
                    .gte('sales.created_at', startOfCurrentMonth.toISOString());

                if (itemsError) throw itemsError;

                // Fetch last month sale items
                const { data: lastMonthItems, error: lastItemsError } = await supabase
                    .from('sale_items')
                    .select('quantity, sale_id, sales!inner(created_at)')
                    .gte('sales.created_at', startOfLastMonth.toISOString())
                    .lte('sales.created_at', endOfLastMonth.toISOString());

                if (lastItemsError) throw lastItemsError;

                // Calculate current month metrics
                const currentTotalSales = currentSales?.reduce((sum, sale) => sum + sale.total, 0) || 0;
                const currentTotalOrders = currentSales?.length || 0;
                const currentTotalProducts = currentItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                const currentAvgOrder = currentTotalOrders > 0 ? currentTotalSales / currentTotalOrders : 0;

                // Calculate last month metrics
                const lastMonthTotalSales = lastMonthSales?.reduce((sum, sale) => sum + sale.total, 0) || 0;
                const lastMonthTotalOrders = lastMonthSales?.length || 0;
                const lastMonthTotalProducts = lastMonthItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                const lastMonthAvgOrder = lastMonthTotalOrders > 0 ? lastMonthTotalSales / lastMonthTotalOrders : 0;

                // Calculate percentage changes
                const calculateChange = (current: number, last: number): number => {
                    if (last === 0) return current > 0 ? 100 : 0;
                    return ((current - last) / last) * 100;
                };

                setMetrics({
                    totalSales: currentTotalSales,
                    totalOrders: currentTotalOrders,
                    totalProducts: currentTotalProducts,
                    avgOrder: currentAvgOrder,
                });

                setChanges({
                    sales: calculateChange(currentTotalSales, lastMonthTotalSales),
                    orders: calculateChange(currentTotalOrders, lastMonthTotalOrders),
                    products: calculateChange(currentTotalProducts, lastMonthTotalProducts),
                    avgOrder: calculateChange(currentAvgOrder, lastMonthAvgOrder),
                });

            } catch (err) {
                console.error('Error fetching report metrics:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    return { metrics, changes, loading, error };
};
