'use client'

import { useState } from 'react'
import { login, signup, signInWithGoogle } from '@/app/auth/actions'
import { Loader2 } from 'lucide-react'

export function AuthForm({ view }: { view: 'login' | 'signup' }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const action = view === 'login' ? login : signup
        const result = await action(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-lg">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                    {view === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <p className="mt-2 text-gray-600">
                    {view === 'login'
                        ? 'Bienvenido de nuevo a Manda2'
                        : 'Únete para pedir a domicilio'}
                </p>
            </div>

            <form action={handleSubmit} className="space-y-6">
                {view === 'signup' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <input
                            name="full_name"
                            type="text"
                            required
                            className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556B2F] focus:border-transparent outline-none"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input
                        name="email"
                        type="email"
                        required
                        className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556B2F] focus:border-transparent outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#556B2F] focus:border-transparent outline-none"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#556B2F] hover:bg-[#445725] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#556B2F] disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'Entrar' : 'Registrarse')}
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">O continúa con</span>
                </div>
            </div>

            <form action={async () => { await signInWithGoogle() }}>
                <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" alt="Google" />
                    Google
                </button>
            </form>

            <div className="text-center text-sm">
                {view === 'login' ? (
                    <p>
                        ¿No tienes cuenta?{' '}
                        <a href="/signup" className="font-bold text-[#556B2F] hover:underline">Regístrate</a>
                    </p>
                ) : (
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <a href="/login" className="font-bold text-[#556B2F] hover:underline">Inicia Sesión</a>
                    </p>
                )}
            </div>
        </div>
    )
}
