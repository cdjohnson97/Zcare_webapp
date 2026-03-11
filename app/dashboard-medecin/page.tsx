import Link from 'next/link'
import { createClient } from '../utils/supabase/server'
import { redirect } from 'next/navigation'
import { Activity, Users, AlertCircle, CheckCircle2, Clock, Search, LogOut } from 'lucide-react'
import LogoutButton from '../components/LogoutButton'

// C'est un composant asynchrone (Server Component)
export default async function DashboardMedecin() {
  // 1. Initialiser Supabase côté serveur
  const supabase = await createClient()

  // 2. Vérifier si l'utilisateur est connecté
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 3. Vérifier son rôle (Sécurité stricte)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'doctor') {
    redirect('/login') // Si un étudiant essaie d'entrer ici, on le renvoie
  }

  // 4. Récupérer les dossiers des patients avec leurs noms
  // Supabase permet de lier la table medical_records à la table profiles facilement
  const { data: records } = await supabase
    .from('medical_records')
    .select(`
      id,
      current_status,
      updated_at,
      profiles (first_name, last_name)
    `)
    .order('updated_at', { ascending: false }) // Les plus récents en premier

  // Petite fonction pour gérer les couleurs des statuts
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'stable':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium"><CheckCircle2 className="w-4 h-4"/> Stable</span>
      case 'en observation':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium"><Clock className="w-4 h-4"/> En observation</span>
      case 'urgence':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium"><AlertCircle className="w-4 h-4"/> Urgence</span>
      default:
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">{status}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Barre de navigation supérieure */}
      <nav className="bg-bordeaux-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-bordeaux-300" />
              <span className="text-2xl font-bold tracking-tight">Z<span className="font-light">care</span> Pro</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm font-light text-bordeaux-200">
                Dr. {profile.first_name} {profile.last_name}
              </span>
              {/* Le bouton déconnexion (on l'animera plus tard) */}
              <div className="flex items-center gap-6">
              <span className="text-sm font-light text-bordeaux-200">
                Dr. {profile.first_name} {profile.last_name}
              </span>
              {/* Le VRAI bouton de déconnexion */}
              <LogoutButton />
            </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* En-tête de la page */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="mt-2 text-sm text-gray-600">Gérez le suivi de vos étudiants et mettez à jour leurs dossiers.</p>
          </div>
          
          {/* Barre de recherche factice pour le design */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un patient..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-bordeaux-500 outline-none w-64"
            />
          </div>
        </div>

        {/* Liste des patients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-bordeaux-700" />
              Dossiers Actifs
            </h3>
            <span className="bg-bordeaux-100 text-bordeaux-800 text-xs font-bold px-2.5 py-1 rounded-full">
              {records?.length || 0} patients
            </span>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {records && records.length > 0 ? (
              records.map((record: any) => (
                <li key={record.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-lg font-medium text-gray-900">
                      {record.profiles.first_name} {record.profiles.last_name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Dernière mise à jour : {new Date(record.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {getStatusBadge(record.current_status)}
                    
                   <Link 
                      href={`/dashboard-medecin/patient/${record.id}`}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-bordeaux-50 hover:text-bordeaux-700 hover:border-bordeaux-300 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md active:scale-95"
                    >
                      Ouvrir le dossier
                    </Link>
                  </div>
                </li>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                Aucun dossier patient trouvé.
              </div>
            )}
          </ul>
        </div>
      </main>
    </div>
  )
}