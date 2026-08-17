import { useEffect, useState } from 'react'
import BottomNav from '../components/BottomNav'
import { supabase } from '../lib/supabaseClient'
import { MATIERES_REF } from '../lib/reference'

function BarreProgression({ nom, pourcentage }) {
  // Démarre à 0 puis anime vers la vraie valeur, façon Duolingo.
  const [largeur, setLargeur] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setLargeur(pourcentage), 150)
    return () => clearTimeout(t)
  }, [pourcentage])

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text font-medium">{nom}</span>
        <span className="text-text-muted">{pourcentage}%</span>
      </div>
      <div className="h-2 rounded-full bg-line overflow-hidden">
        <div
          className="h-full rounded-full bg-ink transition-all duration-1000 ease-out"
          style={{ width: `${largeur}%` }}
        />
      </div>
    </div>
  )
}

function Sparkline({ valeurs }) {
  const max = Math.max(1, ...valeurs)
  return (
    <div className="flex items-end gap-2 h-16 px-2 pt-3">
      {valeurs.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded bg-ink transition-all duration-700 ease-out"
          style={{ height: `${Math.round((v / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}

// Calcule le nombre de jours consécutifs d'activité jusqu'à aujourd'hui,
// à partir des dates réelles présentes dans "resultats".
function calculerStreak(dates) {
  const jours = new Set(dates.map((d) => new Date(d).toDateString()))
  let streak = 0
  const curseur = new Date()
  while (jours.has(curseur.toDateString())) {
    streak += 1
    curseur.setDate(curseur.getDate() - 1)
  }
  return streak
}

export default function TableauDeBord() {
  const [chargement, setChargement] = useState(true)
  const [nom, setNom] = useState('')
  const [stats, setStats] = useState({ complet: 0, scoreMoyen: 0 })
  const [streak, setStreak] = useState(0)
  const [progressionMatieres, setProgressionMatieres] = useState(
    MATIERES_REF.map((m) => ({ nom: m.nom, pourcentage: 0 }))
  )
  const [progressionSemaines, setProgressionSemaines] = useState([0, 0, 0, 0])

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setChargement(false)
        return
      }

      // Nom réel du profil
      const { data: profil } = await supabase
        .from('profils')
        .select('nom')
        .eq('id', user.id)
        .single()
      setNom(profil?.nom || user.email)

      // Progression réelle par matière (0% si aucune ligne pour l'instant)
      const { data: progressions } = await supabase
        .from('progression')
        .select('matiere_id, taux_maitrise')
        .eq('utilisateur_id', user.id)

      setProgressionMatieres(
        MATIERES_REF.map((m) => {
          const p = progressions?.find((p) =>
