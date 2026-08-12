import BottomNav from '../components/BottomNav'

// Données d'exemple — seront remplacées par de vraies requêtes Supabase
// (tables Résultats, Progression, Utilisateurs) une fois le projet connecté.
const UTILISATEUR = { prenom: 'Aïcha', streak: 7 }
const STATS = { qcmCompletes: 128, scoreMoyen: 68 }
const PROGRESSION_MATIERES = [
  { nom: 'Biologie', pourcentage: 70 },
  { nom: 'Chimie', pourcentage: 40 },
  { nom: 'Physique', pourcentage: 30 },
  { nom: 'Culture générale', pourcentage: 50 },
]
const PROGRESSION_SEMAINES = [40, 55, 50, 68]
const CLASSEMENT = [
  { rang: 1, nom: 'Jean K.', score: 92, moi: false },
  { rang: 2, nom: 'Awa T.', score: 89, moi: false },
  { rang: 3, nom: 'Aïcha N. (toi)', score: 85, moi: true },
  { rang: 4, nom: 'Paul M.', score: 81, moi: false },
]

function BarreProgression({ nom, pourcentage }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text font-medium">{nom}</span>
        <span className="text-text-muted">{pourcentage}%</span>
      </div>
      <div className="h-2 rounded-full bg-line overflow-hidden">
        <div
          className="h-full rounded-full bg-ink"
          style={{ width: `${pourcentage}%` }}
        />
      </div>
    </div>
  )
}

function Sparkline({ valeurs }) {
  const max = Math.max(...valeurs)
  return (
    <div className="flex items-end gap-2 h-16 px-2 pt-3">
      {valeurs.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded bg-ink"
          style={{ height: `${Math.round((v / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}

export default function TableauDeBord() {
  return (
    <div className="min-h-screen bg-paper pb-24">
      <div className="mx-auto max-w-md px-5 pt-6">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-display font-extrabold text-ink text-lg">
            Salut {UTILISATEUR.prenom} 👋
          </p>
          <div className="w-11 h-11 rounded-full bg-stamp-light flex flex-col items-center justify-center text-stamp">
            <span className="font-display font-extrabold text-sm leading-none">{UTILISATEUR.streak}</span>
            <span className="text-[8px] leading-none mt-0.5">jours</span>
          </div>
        </div>

        <div className="bg-stamp-light text-stamp text-sm font-medium rounded-xl px-4 py-3 mb-5">
          Série en cours : {UTILISATEUR.streak} jours consécutifs 🔥
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white border border-line rounded-xl px-4 py-3">
            <p className="font-display font-extrabold text-ink text-xl">{STATS.qcmCompletes}</p>
            <p className="text-xs text-text-muted">QCM complétés</p>
          </div>
          <div className="bg-white border border-line rounded-xl px-4 py-3">
            <p className="font-display font-extrabold text-ink text-xl">{STATS.scoreMoyen}%</p>
            <p className="text-xs text-text-muted">Score moyen</p>
          </div>
        </div>

        {/* Progression par matière */}
        <h2 className="font-display font-extrabold text-sm text-ink mb-3">
          Progression par matière
        </h2>
        <div className="flex flex-col gap-3 mb-6">
          {PROGRESSION_MATIERES.map((m) => (
            <BarreProgression key={m.nom} nom={m.nom} pourcentage={m.pourcentage} />
          ))}
        </div>

        {/* Graphique de progression */}
        <h2 className="font-display font-extrabold text-sm text-ink mb-2">
          Progression sur les 4 dernières semaines
        </h2>
        <div className="bg-white border border-line rounded-xl mb-6">
          <Sparkline valeurs={PROGRESSION_SEMAINES} />
        </div>

        {/* Classement */}
        <h2 className="font-display font-extrabold text-sm text-ink mb-2">
          Classement — cette semaine
        </h2>
        <div className="bg-white border border-line rounded-xl px-2 py-1 mb-6">
          {CLASSEMENT.map((u) => (
            <div
              key={u.rang}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm ${
                u.moi ? 'bg-ink-light' : ''
              }`}
            >
              <span className={`w-5 font-medium ${u.moi ? 'text-ink' : 'text-text-muted'}`}>
                {u.rang}
              </span>
              <span className={`flex-1 ${u.moi ? 'text-ink font-medium' : 'text-text'}`}>
                {u.nom}
              </span>
              <span className={u.moi ? 'text-ink font-medium' : 'text-text-muted'}>
                {u.score}%
              </span>
            </div>
          ))}
        </div>

        <button className="w-full py-3 rounded-full bg-stamp text-white font-display font-extrabold text-sm">
          Continuer une série
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
