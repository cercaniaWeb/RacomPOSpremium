'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Search, Check, Store, MapPin, ChevronRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Product, CartItem } from '@/lib/types';
import { LocationGate } from '@/components/LocationGate';
import { ProductCard } from '@/components/ProductCard';
import { CheckoutFlow } from '@/components/CheckoutFlow';
import { UserMenu } from '@/components/UserMenu';
import { TicketView } from '@/components/TicketView';

// --- MOCK CATEGORIES ---
const CATEGORIES = [
  { id: 'todos', name: 'Todo', icon: '🍎' },
  { id: 'frutas', name: 'Frutas', icon: '🍌' },
  { id: 'verduras', name: 'Verduras', icon: '🥦' },
  { id: 'panaderia', name: 'Panadería', icon: 'baguette' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
  { id: 'limpieza', name: 'Limpieza', icon: '🧼' },
];

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700';
  const Icon = type === 'error' ? Check : Check;

  return (
    <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md z-[100] flex items-center p-4 border-l-4 shadow-xl rounded-r ${bgColor} transition-all duration-300 animate-in fade-in slide-in-from-top-4`}>
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'location-gate' | 'home' | 'checkout' | 'success'>('location-gate');

  // Flow States
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup' | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [lastSale, setLastSale] = useState<any>(null);

  const supabase = createClient();

  // Check User Session
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  // Fetch Products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .gt('stock', 0); // Only fetch in-stock items

        if (error) throw error;
        if (data) setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        if (error instanceof Error) console.error('Error message:', error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLocationComplete = (mode: 'delivery' | 'pickup', location: string) => {
    setDeliveryMode(mode);
    setDeliveryLocation(location);
    setView('home');
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      setToast({ message: `Lo sentimos, ${product.name} se ha agotado.`, type: 'error' });
      return;
    }
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    if (navigator.vibrate) navigator.vibrate(50);
    setToast({ message: 'Agregado al carrito', type: 'success' });
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.qty, 0);
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleCheckoutComplete = async (paymentMethod: string, details: any) => {
    try {
      // 1. Save Address if User is Logged In
      console.log('Attempting to save address:', { user: !!user, deliveryMode, deliveryLocation });
      if (user && deliveryMode === 'delivery' && deliveryLocation) {
        const { data: addrData, error: addrError } = await supabase
          .from('user_addresses')
          .insert({
            user_id: user.id,
            address: deliveryLocation,
          })
          .select();

        if (addrError) {
          console.error('Error saving address:', addrError);
        } else {
          console.log('Address saved successfully:', addrData);
        }
      }

      // 2. Create Sale in Supabase
      const saleData = {
        total: cartTotal,
        payment_method: paymentMethod,
        notes: `Order from Manda2 (${deliveryMode}) - ${deliveryLocation}. Details: ${JSON.stringify(details)}`,
        source: 'Manda2',
        user_id: user?.id,
        customer_name: user?.user_metadata.full_name || user?.email,
        created_at: new Date().toISOString(),
        fulfillment_status: 'pending'
      };

      const { data, error } = await supabase
        .from('sales')
        .insert(saleData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating order:', error);
        throw error;
      }

      setLastSale(data);
      setView('success');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al procesar la orden. Intente de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col">
        <div className="w-12 h-12 border-4 border-[#556B2F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // VISTA 1: VALIDACIÓN DE COBERTURA
  if (view === 'location-gate') {
    return <LocationGate onComplete={handleLocationComplete} />;
  }

  // VISTA FINAL: ÉXITO (TICKET)
  if (view === 'success' && lastSale) {
    return (
      <TicketView
        sale={lastSale}
        items={cart}
        onNewOrder={() => {
          setCart([]);
          setLastSale(null);
          setView('home');
          setSearchQuery('');
        }}
      />
    );
  }

  // VISTA: CHECKOUT FLOW
  if (view === 'checkout') {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <CheckoutFlow
          cart={cart}
          total={cartTotal}
          deliveryMode={deliveryMode}
          deliveryLocation={deliveryLocation}
          onBack={() => setView('home')}
          onComplete={handleCheckoutComplete}
        />
      </div>
    );
  }

  // VISTA: HOME (PRODUCTOS)
  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans max-w-md mx-auto shadow-2xl relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* HEADER & SEARCH */}
      <div className="sticky top-0 z-40 bg-white shadow-sm pt-4 pb-2 px-4">
        <div className="flex justify-between items-start mb-3">
          {/* Location Header */}
          <div
            onClick={() => setView('location-gate')}
            className="flex items-center text-[#556B2F] text-sm font-bold cursor-pointer"
          >
            {deliveryMode === 'pickup' ? <Store size={16} className="mr-1" /> : <MapPin size={16} className="mr-1" />}
            <span className="truncate max-w-[150px]">{deliveryLocation}</span>
            <ChevronRight size={14} className="ml-1" />
          </div>

          {/* User Menu */}
          <UserMenu user={user} />
        </div>

        <div className="relative mb-3">
          <input
            type="text"
            placeholder="¿Qué buscas hoy?"
            className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-2xl text-lg font-medium outline-none focus:ring-2 focus:ring-[#556B2F] transition-all placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
        </div>

        {/* CATEGORIES */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 border
                ${selectedCategory === cat.id
                  ? 'bg-black text-white border-black shadow-md transform scale-105'
                  : 'bg-white text-gray-600 border-gray-200'}`}
            >
              <span className="mr-2 text-xl">{cat.icon}</span>
              <span className="font-bold text-sm">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={addToCart}
            />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <p className="text-xl font-bold">No encontramos resultados</p>
          </div>
        )}
      </div>

      {/* FLOATING CART BUTTON */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-in zoom-in duration-300">
          <button
            onClick={() => setView('checkout')}
            className="bg-black text-white w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center relative hover:scale-105 active:scale-95 transition-transform"
          >
            <ShoppingCart size={28} />
            <div className="absolute -top-2 -right-2 bg-[#556B2F] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {cartItemCount}
            </div>
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
