'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, User, Activity, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PatientDossier() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const recordId = params.id as string

  // États pour stocker les données
  const [record, setRecord] = useState<any>(null)
  const [consultations, setConsultations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // États pour le formulaire
  const [newStatus, setNewStatus] = useState('Stable')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  // Fonction pour charger les données
  const fetchPatientData = async () => {
    // 1. Récupérer le dossier médical et les infos de l'étudiant
    const { data: recordData, error: recordError } = await supabase
      .from('medical_records')
      .select(`*, profiles (first_name, last_name)`)
      .eq('id', recordId)
      .single()

    if (recordError) console.error("Erreur chargement dossier:", recordError)

    // 2. Récupérer l'historique des consultations
    const { data: consultData, error: consultError } = await supabase
      .from('consultations')
      .select('*, profiles (first_name, last_name)') // Pour avoir le nom du médecin
      .eq('record_id', recordId)
      .order('created_at', { ascending: false })
      
    if (consultError) console.error("Erreur chargement consultations:", consultError)

    setRecord(recordData)
    setConsultations(consultData || [])
    if (recordData) setNewStatus(recordData.current_status)
    setLoading(false)
  }

  useEffect(() => {
    fetchPatientData()
  }, [recordId])

  // Fonction pour sauvegarder la nouvelle consultation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { data: userData } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('consultations')
      .insert([
        { 
          record_id: recordId,
          doctor_id: userData.user?.id,
          new_status: newStatus,
          notes: notes
        }
      ])

   if (!error) {
      setNotes('') 
      toast.success("Consultation enregistrée avec succès !") // <-- LE TOAST SUCCÈS
      await fetchPatientData() 
    } else {
      console.error("Erreur sauvegarde:", error)
      toast.error("Impossible d'enregistrer la consultation.") // <-- LE TOAST ERREUR
    }
    setSaving(false)
  }

  // Écrans de chargement et d'erreur
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bordeaux-700"></div>
    </div>
  )
  
  if (!record) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center animate-fade-in-up">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Dossier introuvable</h2>
      <p className="text-gray-500 mb-6">Impossible de charger les informations de ce patient.</p>
      <Link href="/dashboard-medecin" className="px-6 py-2 bg-bordeaux-800 text-white rounded-lg hover:bg-bordeaux-900 transition">
        Retour au tableau de bord
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12 relative">
      {/* En-tête de navigation STICKY */}
      <div className="bg-bordeaux-900 text-white shadow-md py-4 px-8 sticky top-0 z-50">
        <Link href="/dashboard-medecin" className="flex items-center gap-2 text-bordeaux-200 hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-5 h-5" /> Retour au tableau de bord
        </Link>
      </div>

      <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : Infos Patient & Formulaire (Animation d'entrée immédiate) */}
        <div className="md:col-span-1 opacity-0 animate-fade-in-up">
          
          {/* C'est ce bloc div qui rend la colonne flottante (Sticky) */}
          <div className="sticky top-24 space-y-6">
            
            {/* Carte d'identité du patient */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-bordeaux-100 flex items-center justify-center text-bordeaux-700">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{record.profiles.first_name} {record.profiles.last_name}</h2>
                  <p className="text-sm text-gray-500">Étudiant</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 flex justify-between">
                  <span>Groupe sanguin:</span> 
                  <span className="font-semibold text-gray-900">{record.medical_history?.blood_type || 'Non renseigné'}</span>
                </p>
                <p className="text-sm text-gray-600 flex justify-between mt-2">
                  <span>Statut actuel:</span> 
                  <span className={`font-bold ${record.current_status === 'Urgence' ? 'text-red-600' : record.current_status === 'En observation' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {record.current_status}
                  </span>
                </p>
              </div>
            </div>

            {/* Formulaire de nouvelle consultation */}
            <div className="bg-white rounded-xl shadow-sm border border-bordeaux-200 p-6 border-t-4 border-t-bordeaux-700">
              <h3 className="text-lg font-bold text-bordeaux-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" /> Nouvelle Note
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nouvel état de santé</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-bordeaux-500 focus:border-bordeaux-500 outline-none border bg-white text-gray-900"
                  >
                    <option value="Stable">Stable</option>
                    <option value="En observation">En observation</option>
                    <option value="Urgence">Urgence</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Compte-rendu médical</label>
                  <textarea 
                    required
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Saisissez vos observations, symptômes et prescriptions..."
                    className="w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-bordeaux-500 focus:border-bordeaux-500 outline-none border resize-none text-gray-900"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full bg-bordeaux-800 text-white font-semibold py-2.5 rounded-lg shadow hover:bg-bordeaux-900 transition-colors disabled:bg-gray-400 active:scale-95 duration-150 transform"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer la consultation'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : Historique (Animation d'entrée avec un léger retard de 200ms) */}
        <div className="md:col-span-2 opacity-0 animate-fade-in-up [animation-delay:200ms]">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-400" /> Historique Médical
            </h3>
            
            {/* Timeline des consultations */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
              {consultations.length === 0 ? (
                <p className="text-gray-500 italic text-center w-full mt-4">Aucune consultation enregistrée.</p>
              ) : (
                consultations.map((consult) => (
                  <div key={consult.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icône au centre */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-100 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 hover:scale-110 transition-transform">
                      {consult.new_status === 'Stable' ? <CheckCircle2 className="w-5 h-5 text-emerald-500"/> : consult.new_status === 'Urgence' ? <AlertCircle className="w-5 h-5 text-red-500"/> : <Clock className="w-5 h-5 text-amber-500"/>}
                    </div>
                    {/* Carte de contenu */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900">Dr. {consult.profiles?.last_name || 'Inconnu'}</span>
                        <time className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                          {new Date(consult.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{consult.notes}</p>
                      <div className="mt-3 text-xs font-medium text-gray-500">
                        Statut défini : <span className={`font-bold ${consult.new_status === 'Urgence' ? 'text-red-600' : consult.new_status === 'En observation' ? 'text-amber-600' : 'text-emerald-600'}`}>{consult.new_status}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
          </div>
        </div>

      </main>
    </div>
  )
}