'use client';

import React from 'react';
import { VoiceInventory } from '@/components/VoiceInventory';

export default function InventoryVoicePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <VoiceInventory />
    </div>
  );
}
