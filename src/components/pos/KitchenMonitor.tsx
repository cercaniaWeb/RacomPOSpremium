import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { X, RefreshCw, CheckCircle, Clock, ChefHat, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface KitchenMonitorProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Order {
    id: string;
    customer_name: string;
    total: number;
    payment_method: string;
    fulfillment_status: 'pending' | 'preparing' | 'ready' | 'completed';
    created_at: string;
    notes: string;
    source: string;
}

const KitchenMonitor: React.FC<KitchenMonitorProps> = ({ isOpen, onClose }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('sales')
            .select('*')
            .neq('fulfillment_status', 'completed')
            .eq('source', 'Manda2') // Filter for Manda2 orders
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching kitchen orders:', error);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('sales')
            .update({ fulfillment_status: status })
            .eq('id', id);

        if (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar estado');
        } else {
            fetchOrders();
        }
    };

    if (!isOpen) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-red-100 border-red-200 text-red-800';
            case 'preparing': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
            case 'ready': return 'bg-green-100 border-green-200 text-green-800';
            default: return 'bg-gray-100 border-gray-200 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-6xl h-[90vh] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-500/20 p-3 rounded-xl">
                            <ChefHat className="text-orange-500 w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Monitor de Cocina</h2>
                            <p className="text-gray-400 text-sm">Pedidos de Manda2 en tiempo real</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchOrders}
                            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
                            title="Actualizar"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-3 bg-gray-800 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-gray-300 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-950/50">
                    {orders.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                            <ChefHat className="w-24 h-24 mb-4" />
                            <p className="text-xl font-medium">No hay pedidos pendientes</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map((order) => (
                                <div key={order.id} className={`bg-gray-900 border-2 rounded-2xl overflow-hidden flex flex-col shadow-lg transition-all ${order.fulfillment_status === 'pending' ? 'border-red-500/50 shadow-red-900/20' :
                                        order.fulfillment_status === 'preparing' ? 'border-yellow-500/50 shadow-yellow-900/20' :
                                            'border-green-500/50 shadow-green-900/20'
                                    }`}>
                                    {/* Card Header */}
                                    <div className="p-4 bg-gray-800/50 flex justify-between items-start border-b border-gray-800">
                                        <div>
                                            <h3 className="font-bold text-lg text-white">{order.customer_name || 'Cliente'}</h3>
                                            <div className="flex items-center text-xs text-gray-400 mt-1">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {format(new Date(order.created_at), 'HH:mm', { locale: es })}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.fulfillment_status)}`}>
                                            {order.fulfillment_status === 'pending' ? 'Pendiente' :
                                                order.fulfillment_status === 'preparing' ? 'Preparando' : 'Listo'}
                                        </span>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4 flex-1">
                                        <div className="text-sm text-gray-300 mb-4 whitespace-pre-wrap font-mono bg-black/20 p-3 rounded-lg border border-gray-800">
                                            {order.notes}
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-400">
                                            <span>Total:</span>
                                            <span className="text-white font-bold text-lg">${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Card Footer (Actions) */}
                                    <div className="p-3 bg-gray-800/30 border-t border-gray-800 grid grid-cols-1 gap-2">
                                        {order.fulfillment_status === 'pending' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'preparing')}
                                                className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center"
                                            >
                                                <ChefHat className="w-5 h-5 mr-2" />
                                                Empezar a Preparar
                                            </button>
                                        )}
                                        {order.fulfillment_status === 'preparing' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'ready')}
                                                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center"
                                            >
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Marcar como Listo
                                            </button>
                                        )}
                                        {order.fulfillment_status === 'ready' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'completed')}
                                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center"
                                            >
                                                <Truck className="w-5 h-5 mr-2" />
                                                Entregado / Completado
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KitchenMonitor;
