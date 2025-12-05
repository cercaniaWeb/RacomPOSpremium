'use client';
import React, { useState } from 'react';
import { ArrowLeft, Store, MapPin, Banknote, CreditCard, Check } from 'lucide-react';
import { CartItem } from '@/lib/types';

interface CheckoutFlowProps {
    cart: CartItem[];
    total: number;
    deliveryMode: 'delivery' | 'pickup' | null;
    deliveryLocation: string | null;
    onBack: () => void;
    onComplete: (paymentMethod: string, details: any) => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ cart, total, deliveryMode, deliveryLocation, onBack, onComplete }) => {
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState(''); // 'cash' | 'card'
    const [streetDetails, setStreetDetails] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // STEP 1: CART
    if (step === 1) {
        return (
            <div className="flex flex-col h-full bg-gray-50">
                <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center mb-4">
                        <button onClick={onBack} className="p-2 -ml-2 text-gray-600"><ArrowLeft /></button>
                        <h2 className="text-xl font-bold ml-2">Tu Carrito</h2>
                        <div className="ml-auto text-sm font-medium text-gray-500">Paso 1 de 3</div>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black w-1/3 transition-all duration-500"></div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">Tu carrito está vacío</div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex bg-white p-3 rounded-lg shadow-sm border border-gray-100 items-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    {item.image_url ? (
                                        <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="font-bold text-gray-800">{item.name}</div>
                                    <div className="text-sm text-gray-500">${item.price} / {item.is_weighted ? 'kg' : 'pz'}</div>
                                </div>
                                <div className="font-bold text-lg text-[#556B2F]">x{item.qty}</div>
                            </div>
                        ))
                    )}
                </div>

                <div className="bg-white p-4 border-t border-gray-100 safe-area-bottom">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500">Total</span>
                        <span className="text-3xl font-extrabold text-black">${total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={() => setStep(2)}
                        disabled={cart.length === 0}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 active:scale-[0.98] transition-transform"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        );
    }

    // STEP 2: DETAILS
    if (step === 2) {
        const isPickup = deliveryMode === 'pickup';

        return (
            <div className="flex flex-col h-full bg-gray-50">
                <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center mb-4">
                        <button onClick={() => setStep(1)} className="p-2 -ml-2 text-gray-600"><ArrowLeft /></button>
                        <h2 className="text-xl font-bold ml-2">{isPickup ? 'Recolección' : 'Entrega'}</h2>
                        <div className="ml-auto text-sm font-medium text-gray-500">Paso 2 de 3</div>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black w-2/3 transition-all duration-500"></div>
                    </div>
                </div>

                <div className="flex-1 p-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                        <div className="flex items-center mb-4 text-[#556B2F]">
                            {isPickup ? <Store className="mr-2" /> : <MapPin className="mr-2" />}
                            <span className="font-bold">{isPickup ? 'Sucursal Seleccionada' : 'Dirección de Entrega'}</span>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                            <p className="font-bold text-lg text-gray-800">{deliveryLocation}</p>
                            <p className="text-sm text-gray-500 uppercase font-bold mt-1">
                                {isPickup ? 'Punto de Recolección' : 'Zona de Cobertura'}
                            </p>
                        </div>

                        {!isPickup && (
                            <div className="animate-in fade-in">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Calle y Número</label>
                                <textarea
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-black outline-none resize-none"
                                    placeholder="Ej. Av. Insurgentes 123, Depto 4"
                                    rows={3}
                                    value={streetDetails}
                                    onChange={(e) => setStreetDetails(e.target.value)}
                                ></textarea>
                            </div>
                        )}

                        {isPickup && (
                            <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-start">
                                <div className="mr-2 mt-0.5">ℹ️</div>
                                Tu pedido estará listo en 20 minutos. Presenta tu confirmación en caja.
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-4 border-t border-gray-100 safe-area-bottom">
                    <button
                        onClick={() => setStep(3)}
                        disabled={!isPickup && !streetDetails}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 active:scale-[0.98] transition-transform"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        );
    }

    // STEP 3: PAYMENT & CONFIRMATION
    if (step === 3) {
        const handlePay = () => {
            setIsProcessing(true);
            // Simulate processing time then complete
            setTimeout(() => {
                setIsProcessing(false);
                onComplete(paymentMethod, { streetDetails });
            }, 2000);
        };

        if (isProcessing) {
            return (
                <div className="flex flex-col h-full items-center justify-center bg-white p-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mb-6"></div>
                    <h2 className="text-2xl font-bold">Procesando...</h2>
                    <p className="text-gray-500">Confirmando tu orden</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col h-full bg-gray-50">
                <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center mb-4">
                        <button onClick={() => setStep(2)} className="p-2 -ml-2 text-gray-600"><ArrowLeft /></button>
                        <h2 className="text-xl font-bold ml-2">Pago</h2>
                        <div className="ml-auto text-sm font-medium text-gray-500">Paso 3 de 3</div>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black w-full transition-all duration-500"></div>
                    </div>
                </div>

                <div className="flex-1 p-4 space-y-4">
                    {/* Resumen */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between py-2 text-xl font-bold">
                            <span>Total a Pagar</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide ml-1">Método de Pago</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => setPaymentMethod('cash')}
                            className={`w-full p-4 rounded-xl border-2 flex items-center transition-all ${paymentMethod === 'cash' ? 'border-[#556B2F] bg-green-50 shadow-md' : 'border-gray-100 bg-white'}`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${paymentMethod === 'cash' ? 'bg-[#556B2F] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <Banknote size={24} />
                            </div>
                            <div className="text-left">
                                <span className={`block font-bold ${paymentMethod === 'cash' ? 'text-[#556B2F]' : 'text-gray-800'}`}>Efectivo</span>
                                <span className="text-xs text-gray-400">Paga al recibir / recoger</span>
                            </div>
                            {paymentMethod === 'cash' && <Check className="ml-auto text-[#556B2F]" />}
                        </button>

                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={`w-full p-4 rounded-xl border-2 flex items-center transition-all ${paymentMethod === 'card' ? 'border-[#556B2F] bg-green-50 shadow-md' : 'border-gray-100 bg-white'}`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${paymentMethod === 'card' ? 'bg-[#556B2F] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <CreditCard size={24} />
                            </div>
                            <div className="text-left">
                                <span className={`block font-bold ${paymentMethod === 'card' ? 'text-[#556B2F]' : 'text-gray-800'}`}>Tarjeta</span>
                                <span className="text-xs text-gray-400">Crédito, Débito o Vales</span>
                            </div>
                            {paymentMethod === 'card' && <Check className="ml-auto text-[#556B2F]" />}
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 border-t border-gray-100 safe-area-bottom">
                    <button
                        onClick={handlePay}
                        disabled={!paymentMethod}
                        className="w-full bg-[#556B2F] text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform flex items-center justify-center"
                    >
                        {paymentMethod === 'cash' ? 'Finalizar Orden' : 'Pagar Ahora'}
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
