import { AuthForm } from '@/components/AuthForm'

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <AuthForm view="signup" />
        </div>
    )
}
