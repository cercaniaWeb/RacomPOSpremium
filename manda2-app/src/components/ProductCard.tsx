'use client';
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleAdd = () => {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 200);
        onAdd(product);
    };

    const isOutOfStock = product.stock <= 0;

    return (
        <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 relative group">
            <div className="relative w-full pb-[100%] bg-gray-50">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                    </div>
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">Agotado</span>
                    </div>
                )}
            </div>

            <div className="p-3 flex flex-col justify-between flex-grow">
                <div>
                    <h3 className="font-bold text-gray-800 leading-tight text-sm mb-0.5">{product.name}</h3>
                    <p className="text-gray-400 text-xs">{product.is_weighted ? 'kg' : 'pieza'}</p>
                </div>

                <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-extrabold text-[#556B2F] tracking-tighter">
                        ${product.price}
                    </span>
                </div>
            </div>

            <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-100 
          ${isOutOfStock ? 'bg-gray-200 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 active:scale-90'}
          ${isPressed ? 'scale-90' : 'scale-100'}
        `}
            >
                <Plus size={24} />
            </button>
        </div>
    );
};
