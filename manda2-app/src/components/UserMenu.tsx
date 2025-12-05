'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { signout } from '@/app/auth/actions'
import { User as UserIcon, LogOut } from 'lucide-react'

export function UserMenu({ user }: { user: User | null }) {
    const [isOpen, setIsOpen] = useState(false)

    if (!user) {
        return (
            <a
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors"
            >
                <UserIcon size={16} />
                Entrar
            </a>
        )
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors"
            >
                <div className="w-6 h-6 bg-[#556B2F] rounded-full flex items-center justify-center text-white text-xs">
                    {user.email?.[0].toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.user_metadata.full_name || user.email?.split('@')[0]}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Conectado como</p>
                        <p className="text-sm font-bold truncate">{user.email}</p>
                    </div>
                    <button
                        onClick={() => signout()}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                        <LogOut size={14} />
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    )
}
