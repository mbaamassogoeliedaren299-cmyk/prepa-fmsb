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
  const [monId, setMonId] = useState(null)
  const [stats, setStats] = useState({ complet: 0, scoreMoyen: 0 })
  const [streak, setStreak] = useState(0)
  const [classement, setClassement] = useState([])
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
      setMonId(user.id)

      // Classement réel (fonction sécurisée côté base de données)
      const { data: classementData } = await supabase.rpc('get_classement')
      setClassement(classementData || [])

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
          const p = progressions?.find((p) => p.matiere_id === m.id)
          return { nom: m.nom, pourcentage: p?.taux_maitrise ?? 0 }
        })
      )

      // Résultats réels (anciens sujets et, plus tard, examens blancs)
      const { data: resultats } = await supabase
        .from('resultats')
        .select('score, date, examens(nb_questions)')
        .eq('utilisateur_id', user.id)
        .order('date', { ascending: true })

      if (resultats && resultats.length > 0) {
        const pourcentages = resultats.map(
          (r) => (r.score / (r.examens?.nb_questions || 1)) * 100
        )
        const moyenne = pourcentages.reduce((a, b) => a + b, 0) / pourcentages.length
        setStats({ complet: resultats.length, scoreMoyen: Math.round(moyenne) })
        setStreak(calculerStreak(resultats.map((r) => r.date)))

        // 4 dernières semaines : moyenne des scores par semaine glissante
        const semaines = [0, 0, 0, 0].map((_, i) => {
          const debut = new Date()
          debut.setDate(debut.getDate() - (4 - i) * 7)
          const fin = new Date()
          fin.setDate(fin.getDate() - (3 - i) * 7)
          const dansLaSemaine = resultats.filter((r) => {
            const d = new Date(r.date)
            return d >= debut && d < fin
          })
          if (dansLaSemaine.length === 0) return 0
          const m =
            dansLaSemaine.reduce(
              (acc, r) => acc + (r.score / (r.examens?.nb_questions || 1)) * 100,
              0
            ) / dansLaSemaine.length
          return Math.round(m)
        })
        setProgressionSemaines(semaines)
      }

      setChargement(false)
    }
    charger()
  }, [])

  return (
    <div className="min-h-screen bg-paper pb-24">
      <div className="mx-auto max-w-md px-5 pt-6">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-display font-extrabold text-ink text-lg">
            {chargement ? 'Salut 👋' : `Salut ${nom.split(' ')[0]} 👋`}
          </p>
          <div className="w-11 h-11 rounded-full bg-stamp-light flex flex-col items-center justify-center text-stamp">
            <span className="font-display font-extrabold text-sm leading-none">{streak}</span>
            <span className="text-[8px] leading-none mt-0.5">jours</span>
          </div>
        </div>

        <div className="bg-stamp-light text-stamp text-sm font-medium rounded-xl px-4 py-3 mb-5">
          {streak > 0
            ? `Série en cours : ${streak} jour${streak > 1 ? 's' : ''} consécutif${streak > 1 ? 's' : ''} 🔥`
            : 'Commence ta première série aujourd\'hui 💪'}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white border border-line rounded-xl px-4 py-3">
            <p className="font-display font-extrabold text-ink text-xl">{stats.complet}</p>
            <p className="text-xs text-text-muted">Sessions complétées</p>
          </div>
          <div className="bg-white border border-line rounded-xl px-4 py-3">
            <p className="font-display font-extrabold text-ink text-xl">{stats.scoreMoyen}%</p>
            <p className="text-xs text-text-muted">Score moyen</p>
          </div>
        </div>

        {/* Progression par matière */}
        <h2 className="font-display font-extrabold text-sm text-ink mb-3">
          Progression par matière
        </h2>
        <div className="flex flex-col gap-3 mb-6">
          {progressionMatieres.map((m) => (
            <BarreProgression key={m.nom} nom={m.nom} pourcentage={m.pourcentage} />
          ))}
        </div>

        {/* Graphique de progression */}
        <h2 className="font-display font-extrabold text-sm text-ink mb-2">
          Progression sur les 4 dernières semaines
        </h2>
        <div className="bg-white border border-line rounded-xl mb-6">
          <Sparkline valeurs={progressionSemaines} />
        </div>

        {/* Classement */}
        <h2 className="font-display font-extrabold text-sm text-ink mb-2">
          Classement — cette semaine
        </h2>
        {classement.length === 0 ? (
          <p className="text-xs text-text-muted text-center mb-6">
            Personne n'a encore de résultat cette semaine. Sois le premier !
          </p>
        ) : (
          <div className="bg-white border border-line rounded-xl px-2 py-1 mb-6">
            {classement.map((u, i) => {
              const moi = u.utilisateur_id === monId
              return (
                <div
                  key={u.utilisateur_id}
                  className={`flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm ${
                    moi ? 'bg-ink-light' : ''
                  }`}
                >
                  <span className={`w-5 font-medium ${moi ? 'text-ink' : 'text-text-muted'}`}>
                    {i + 1}
                  </span>
                  <span className={`flex-1 ${moi ? 'text-ink font-medium' : 'text-text'}`}>
                    {u.nom} {moi ? '(toi)' : ''}
                  </span>
                  <span className={moi ? 'text-ink font-medium' : 'text-text-muted'}>
                    {u.score_moyen}%
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
