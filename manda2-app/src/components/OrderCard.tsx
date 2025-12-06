import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Package, ChefHat, CheckCircle, Truck, Clock } from 'lucide-react';

interface OrderCardProps {
    order: {
        id: string;
        created_at: string;
        total: number;
        fulfillment_status: 'pending' | 'preparing' | 'ready' | 'completed';
        notes?: string;
    };
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const steps = [
        { status: 'pending', label: 'Recibido', icon: Package },
        { status: 'preparing', label: 'Preparando', icon: ChefHat },
        { status: 'ready', label: 'Listo', icon: CheckCircle },
        { status: 'completed', label: 'Entregado', icon: Truck },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.fulfillment_status);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Orden #{order.id.slice(0, 8)}</p>
                    <p className="text-gray-900 font-bold text-lg">${order.total.toFixed(2)}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {format(new Date(order.created_at), 'PPP p', { locale: es })}
                </div>
            </div>

            {/* Stepper */}
            <div className="relative flex items-center justify-between w-full">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 -z-10"></div>
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 -z-10 transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.status} className="flex flex-col items-center bg-white px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive
                                    ? 'bg-green-50 border-green-500 text-green-600'
                                    : 'bg-white border-gray-200 text-gray-300'
                                } ${isCurrent ? 'ring-4 ring-green-100 scale-110' : ''}`}>
                                <Icon size={18} />
                            </div>
                            <span className={`text-xs mt-2 font-medium ${isActive ? 'text-green-700' : 'text-gray-400'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {order.notes && (
                <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <span className="font-bold">Nota:</span> {order.notes}
                </div>
            )}
        </div>
    );
};

export default OrderCard;
