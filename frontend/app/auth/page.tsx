import { Auth } from '@/components/ui/Auth'
import { Header } from '@/components/ui/Header'
export const dynamic = 'force-dynamic';

export default function AuthPage() {
  return (
    <>
      <Header />
      <main className="flex justify-center items-center min-h-screen bg-gray-100">
        <Auth />
      </main>
    </>
  )
}
