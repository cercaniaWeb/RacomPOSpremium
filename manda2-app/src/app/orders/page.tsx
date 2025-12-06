import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import OrderCard from '@/components/OrderCard';
import Link from 'next/link';
import { ChevronLeft, ShoppingBag } from 'lucide-react';

export default async function OrdersPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: orders, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 py-4 flex items-center">
                    <Link href="/" className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 ml-2">Mis Pedidos</h1>
                </div>
            </header>

            <main className="max-w-md mx-auto px-4 py-6">
                {!orders || orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No tienes pedidos aún</h2>
                        <p className="text-gray-500 mb-8">¡Haz tu primer pedido hoy mismo!</p>
                        <Link
                            href="/"
                            className="px-8 py-3 bg-[#556B2F] text-white rounded-xl font-bold shadow-lg hover:bg-[#445726] transition-colors"
                        >
                            Ir al Menú
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
