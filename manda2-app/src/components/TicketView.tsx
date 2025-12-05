import React from 'react';
import { Store, Printer } from 'lucide-react';

interface TicketViewProps {
    sale: any;
    items: any[];
    onNewOrder: () => void;
}

export const TicketView: React.FC<TicketViewProps> = ({ sale, items, onNewOrder }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full print:shadow-none print:w-full print:max-w-none">
                {/* Header */}
                <div className="text-center mb-6 border-b border-gray-200 pb-4">
                    <div className="flex justify-center mb-2">
                        <Store className="w-8 h-8 text-[#556B2F]" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Manda2 Delivery</h1>
                    <p className="text-sm text-gray-500">Comprobante de Compra</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(sale.created_at).toLocaleString()}</p>
                </div>

                {/* Customer Info */}
                <div className="mb-6 text-sm">
                    <p><span className="font-bold">Cliente:</span> {sale.customer_name || 'Invitado'}</p>
                    <p><span className="font-bold">Método:</span> {sale.payment_method === 'cash' ? 'Efectivo' : 'Tarjeta'}</p>
                    <p className="mt-2 text-xs text-gray-500 break-words">{sale.notes}</p>
                </div>

                {/* Items */}
                <div className="mb-6 border-t border-gray-200 pt-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="pb-2">Cant</th>
                                <th className="pb-2">Producto</th>
                                <th className="pb-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-50 last:border-0">
                                    <td className="py-2 align-top">{item.qty}</td>
                                    <td className="py-2 align-top">{item.name}</td>
                                    <td className="py-2 align-top text-right">${(item.price * item.qty).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="border-t-2 border-gray-800 pt-4 mb-8">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${sale.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                        <Printer className="w-5 h-5 mr-2" />
                        Imprimir Ticket
                    </button>
                    <button
                        onClick={onNewOrder}
                        className="w-full bg-[#556B2F] text-white py-3 rounded-xl font-bold hover:bg-[#445725] transition-colors"
                    >
                        Nueva Orden
                    </button>
                </div>

                {/* Print Footer */}
                <div className="hidden print:block text-center text-xs text-gray-400 mt-8">
                    <p>¡Gracias por su preferencia!</p>
                    <p>www.manda2.app</p>
                </div>
            </div>

            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .bg-white, .bg-white * {
            visibility: visible;
          }
          .bg-white {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
        </div>
    );
};
