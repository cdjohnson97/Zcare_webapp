'use client'

import { useState } from 'react'
import { createClient } from '../utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Heart, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // ON UTILISE LE TOAST AU LIEU DE setError
      toast.error("Email ou mot de passe incorrect.") 
      setLoading(false)
      return
    }

    // SI C'EST UN SUCCÈS :
    toast.success("Connexion réussie !")

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', data.user.id).single()

    if (profile?.role === 'doctor') {
      router.push('/dashboard-medecin')
    } else {
      router.push('/dashboard-etudiant')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* --- CÔTÉ GAUCHE : Logo + Animation Interactive --- */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center p-12 text-white md:flex bg-gradient-to-br from-bordeaux-950 via-bordeaux-900 to-bordeaux-700 overflow-hidden">
        
        {/* Lueur rouge en arrière-plan */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-bordeaux-500/20 rounded-full filter blur-[100px] animate-pulse"></div>

        {/* --- L'ECG QUI SE DESSINE EN DIRECT --- */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
          <svg viewBox="0 0 1000 150" className="w-[150%] h-64" preserveAspectRatio="none">
            <path 
              // Un long tracé avec plusieurs complexes QRS (les pics)
              d="M0,75 L50,75 L60,45 L70,75 L85,75 L95,15 L115,135 L125,75 L145,75 Q155,45 165,75 L250,75 L260,45 L270,75 L285,75 L295,15 L315,135 L325,75 L345,75 Q355,45 365,75 L450,75 L460,45 L470,75 L485,75 L495,15 L515,135 L525,75 L545,75 Q555,45 565,75 L650,75 L660,45 L670,75 L685,75 L695,15 L715,135 L725,75 L745,75 Q755,45 765,75 L850,75 L860,45 L870,75 L885,75 L895,15 L915,135 L925,75 L945,75 Q955,45 965,75 L1000,75" 
              stroke="white" 
              fill="none" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              // C'est ici que la magie de l'animation opère
              className="animate-draw-ecg drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]"
              style={{ strokeDasharray: 1500 }} 
            />
          </svg>
        </div>
        
        {/* Contenu principal gauche */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex flex-col items-center gap-6 mb-6">
            {/* Le Cœur GÉANT avec le battement "Lub-Dub" */}
            <Heart className="w-40 h-40 text-white fill-white animate-heartbeat drop-shadow-2xl" strokeWidth={1} />
            <h1 className="text-8xl font-extrabold tracking-tighter text-white">
              Z<span className="font-light">care</span>
            </h1>
          </div>
          <p className="mt-8 max-w-md text-xl font-light text-bordeaux-100 leading-relaxed">
            La plateforme intelligente qui connecte étudiants et professionnels pour un suivi de santé moderne et réactif.
          </p>
        </div>
        
        <div className="absolute bottom-6 text-sm text-bordeaux-200/60 font-light">
          © 2024 Zcare Technologies. Tous droits réservés.
        </div>
      </div>

      {/* --- CÔTÉ DROIT : Formulaire --- */}
      <div className="flex w-full items-center justify-center p-8 md:w-1/2 lg:p-16 bg-cream-50 z-10 shadow-2xl">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6 md:hidden">
                <Heart className="w-16 h-16 text-bordeaux-800 fill-bordeaux-800 animate-heartbeat" strokeWidth={1} />
                <h1 className="text-5xl font-extrabold tracking-tighter text-bordeaux-900">
                Z<span className="font-light">care</span>
                </h1>
            </div>
            
            <h2 className="text-4xl font-bold tracking-tight text-bordeaux-900">
              Connectez-vous
            </h2>
            <p className="mt-3 text-lg text-bordeaux-700">
              Bienvenue sur Zcare. Accédez à votre dossier de santé ou à votre tableau de bord.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200 text-sm text-red-700 flex gap-3 items-center">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-bordeaux-800">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bordeaux-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="docteur@zcare.fr"
                  className="w-full rounded-xl border-2 border-bordeaux-100 bg-white px-4 pl-12 py-3.5 text-bordeaux-800 focus:border-bordeaux-500 focus:bg-white focus:ring-4 focus:ring-bordeaux-500/10 transition-all duration-200 outline-none placeholder:text-bordeaux-300"
                  required
                />
              </div>
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-bordeaux-800">Mot de passe</label>
                <a href="#" className="text-sm font-medium text-bordeaux-600 hover:text-bordeaux-800 transition-colors">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bordeaux-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full rounded-xl border-2 border-bordeaux-100 bg-white px-4 pl-12 py-3.5 text-bordeaux-800 focus:border-bordeaux-500 focus:bg-white focus:ring-4 focus:ring-bordeaux-500/10 transition-all duration-200 outline-none placeholder:text-bordeaux-300"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-bordeaux-800 px-6 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-bordeaux-900/30 hover:bg-bordeaux-900 focus:outline-none focus:ring-4 focus:ring-bordeaux-500/30 disabled:bg-bordeaux-400 transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   Authentification...
                </span>
              ) : (
                'Accéder à mon espace'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}