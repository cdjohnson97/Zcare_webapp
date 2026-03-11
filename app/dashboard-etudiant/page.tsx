import { createClient } from '../utils/supabase/server'
import { redirect } from 'next/navigation'
import { Activity, User, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import LogoutButton from '../components/LogoutButton'
import ThemeToggle from '../components/ThemeToggle'

export default async function DashboardEtudiant() {
  const supabase = await createClient()

  // 1. Vérifier si l'utilisateur est connecté
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  // 2. Vérifier son rôle
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'student') redirect('/login')

  // 3. Récupérer SON dossier médical (on suppose que l'ID du dossier est le même que l'ID utilisateur)
  const { data: record } = await supabase
    .from('medical_records')
    .select('*')
    .eq('id', user.id)
    .single()

  // 4. Récupérer SES consultations
  const { data: consultations } = await supabase
    .from('consultations')
    .select('*, profiles (first_name, last_name)') // Pour afficher le nom du médecin
    .eq('record_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300 pb-12">
      
      {/* Barre de navigation */}
      <nav className="bg-bordeaux-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-bordeaux-300" />
              <span className="text-2xl font-bold tracking-tight">Z<span className="font-light">care</span></span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="text-sm font-light text-bordeaux-200 hidden sm:block">
                Espace Étudiant
              </span>
              <ThemeToggle />
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* Message de bienvenue avec animation */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bonjour, {profile.first_name} 👋</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Voici un récapitulatif de votre dossier médical universitaire.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : Statut et Infos (Sticky) */}
          <div className="md:col-span-1 opacity-0 animate-fade-in-up [animation-delay:100ms]">
            <div className="sticky top-24 space-y-6">
              
              {/* Carte de statut de santé */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-bordeaux-100 dark:bg-bordeaux-900/30 flex items-center justify-center text-bordeaux-700 dark:text-bordeaux-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mon Profil</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dossier n° {user.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                    <span>Groupe sanguin:</span> 
                    <span className="font-semibold text-gray-900 dark:text-white">{record?.medical_history?.blood_type || 'Non renseigné'}</span>
                  </p>
                  <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Statut Médical Actuel</p>
                    <span className={`text-lg font-bold ${record?.current_status === 'Urgence' ? 'text-red-600 dark:text-red-400' : record?.current_status === 'En observation' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {record?.current_status || 'Inconnu'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* COLONNE DROITE : Historique des consultations */}
          <div className="md:col-span-2 opacity-0 animate-fade-in-up [animation-delay:200ms]">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-gray-400 dark:text-gray-500" /> Mon Historique
              </h3>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 dark:before:via-gray-700 before:to-transparent">
                {!consultations || consultations.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 italic text-center w-full mt-4">Aucune consultation n'a été enregistrée dans votre dossier.</p>
                ) : (
                  consultations.map((consult: any) => (
                    <div key={consult.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 hover:scale-110 transition-transform">
                        {consult.new_status === 'Stable' ? <CheckCircle2 className="w-5 h-5 text-emerald-500"/> : consult.new_status === 'Urgence' ? <AlertCircle className="w-5 h-5 text-red-500"/> : <Clock className="w-5 h-5 text-amber-500"/>}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-900 dark:text-white">Dr. {consult.profiles?.last_name || 'Médecin'}</span>
                          <time className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                            {new Date(consult.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </time>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{consult.notes}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}