'use client';

import React, { useState, useEffect } from 'react';
import Terminal from '@/components/pos/Terminal';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

const POSPage = () => {


  // Check if we have products in the database
  useEffect(() => {
    const checkProducts = async () => {
      try {
        const { db } = await import('@/lib/db');
        const productCount = await db.products.count();
        if (productCount === 0) {
          // console.log('No products found in database. Visit /seeder to add sample products.');
        }
      } catch (error) {
        console.error('Error checking products:', error);
      }
    };

    checkProducts();
  }, []);

  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col">

      <div className="flex-1">
        <Terminal />
      </div>

      {user?.role === 'admin' && (
        <button
          onClick={() => router.push(ROUTES.DASHBOARD)}
          className="fixed bottom-4 left-4 z-50 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-bold"
          title="Regresar al Panel de Control"
        >
          <span>← Panel</span>
        </button>
      )}
    </div>
  );
};

export default POSPage;