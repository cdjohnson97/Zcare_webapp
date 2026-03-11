'use client'

import { createClient } from '../utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    // On déconnecte l'utilisateur de Supabase
    await supabase.auth.signOut()
    // On le redirige vers la page de login
    router.push('/login')
    router.refresh()
  }

  return (
    <button 
      onClick={handleLogout}
      className="p-2 hover:bg-bordeaux-800 rounded-full transition-colors group"
      title="Se déconnecter"
    >
      <LogOut className="w-5 h-5 text-bordeaux-200 group-hover:text-white transition-colors" />
    </button>
  )
}