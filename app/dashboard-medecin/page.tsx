import { createClient } from '../utils/supabase/server'
import { redirect } from 'next/navigation'
import { Activity, Users, AlertCircle, CheckCircle2, Clock, Search } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from '../components/LogoutButton'
import ThemeToggle from '../components/ThemeToggle'

export default async function DashboardMedecin() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'doctor') redirect('/login')

  const { data: records } = await supabase
    .from('medical_records')
    .select(`id, current_status, updated_at, profiles (first_name, last_name)`)
    .order('updated_at', { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'stable':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium"><CheckCircle2 className="w-4 h-4"/> Stable</span>
      case 'en observation':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium"><Clock className="w-4 h-4"/> En observation</span>
      case 'urgence':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium"><AlertCircle className="w-4 h-4"/> Urgence</span>
      default:
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">{status}</span>
    }
  }

  return (
    // Ajout de dark:bg-gray-900 pour le fond global
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
      
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
              <ThemeToggle />
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            {/* dark:text-white pour les titres */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Gérez le suivi de vos étudiants et mettez à jour leurs dossiers.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un patient..." 
              // Champs de saisie adaptés au mode sombre
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-bordeaux-500 outline-none w-64 transition-colors"
            />
          </div>
        </div>

        {/* Cartes avec dark:bg-gray-800 et dark:border-gray-700 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-bordeaux-700 dark:text-bordeaux-400" />
              Dossiers Actifs
            </h3>
            <span className="bg-bordeaux-100 dark:bg-bordeaux-900/30 text-bordeaux-800 dark:text-bordeaux-300 text-xs font-bold px-2.5 py-1 rounded-full">
              {records?.length || 0} patients
            </span>
          </div>
          
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {records && records.length > 0 ? (
              records.map((record: any) => (
                <li key={record.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {record.profiles.first_name} {record.profiles.last_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Dernière mise à jour : {new Date(record.updated_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {getStatusBadge(record.current_status)}
                    
                    <Link 
                      href={`/dashboard-medecin/patient/${record.id}`}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-bordeaux-50 dark:hover:bg-gray-700 hover:text-bordeaux-700 dark:hover:text-white transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md active:scale-95"
                    >
                      Ouvrir le dossier
                    </Link>
                  </div>
                </li>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                Aucun dossier patient trouvé.
              </div>
            )}
          </ul>
        </div>
      </main>
    </div>
  )
}