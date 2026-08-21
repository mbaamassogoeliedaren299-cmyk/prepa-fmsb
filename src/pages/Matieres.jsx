import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { supabase } from '../lib/supabaseClient'
import { MATIERES_REF } from '../lib/reference'

export default function Matieres() {
  const [ouverte, setOuverte] = useState(MATIERES_REF[0].id)
  const [recherche, setRecherche] = useState('')
  const [chapitresParMatiere, setChapitresParMatiere] = useState({})
  const [progressionParMatiere, setProgressionParMatiere] = useState({})

  useEffect(() => {
    async function charger() {
      const { data: chapitres } = await supabase
        .from('chapitres')
        .select('id, titre, matiere_id, ordre, questions(id)')
        .order('ordre', { ascending: true })

      const groupes = {}
      for (const c of chapitres || []) {
        if (!groupes[c.matiere_id]) groupes[c.matiere_id] = []
        groupes[c.matiere_id].push({ ...c, nbQuestions: c.questions?.length || 0 })
      }
      setChapitresParMatiere(groupes)

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: progressions } = await supabase
          .from('progression')
          .select('matiere_id, taux_maitrise')
          .eq('utilisateur_id', user.id)
        const p = {}
        for (const pr of progressions || []) p[pr.matiere_id] = pr.taux_maitrise
        setProgressionParMatiere(p)
      }
    }
    charger()
  }, [])

  const matieresFiltrees = MATIERES_REF.filter((m) =>
    m.nom.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-paper pb-24">
      <div className="mx-auto max-w-md px-5 pt-6">
        <p className="font-display font-extrabold text-ink text-lg mb-4">Matières</p>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher une matière"
            className="w-full border border-line rounded-lg pl-9 pr-3 py-2.5 text-sm bg-white outline-none focus:border-ink"
          />
        </div>

        <div className="flex flex-col gap-2">
          {matieresFiltrees.map((matiere) => {
            const estOuverte = ouverte === matiere.id
            const chapitres = chapitresParMatiere[matiere.id] || []
            const progression = progressionParMatiere[matiere.id] ?? 0

            return (
              <div key={matiere.id} className="bg-white border border-line rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOuverte(estOuverte ? null : matiere.id)}
                  className="w-full flex items-center justify-between px-4 py-3"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-ink">
                    {estOuverte ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    {matiere.nom}
                  </span>
                  <span className="text-xs text-text-muted">{progression}%</span>
                </button>

                {estOuverte && (
                  <div className="border-t border-line">
                    {chapitres.length === 0 ? (
                      <p className="text-xs text-text-muted px-9 py-3">
                        Contenu à venir pour cette matière.
                      </p>
                    ) : (
                      chapitres.map((chapitre) => (
                        <Link
                          to={`/qcm/${chapitre.id}`}
                          key={chapitre.id}
                          className="flex items-center justify-between pl-9 pr-4 py-2.5 border-b border-line last:border-b-0 text-sm"
                        >
                          <span className="text-text-muted">{chapitre.titre}</span>
                          <span className="flex items-center gap-1 text-ink text-xs font-medium">
                            {chapitre.nbQuestions} Q
                            <ChevronRight size={13} />
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {matieresFiltrees.length === 0 && (
            <p className="text-center text-sm text-text-muted py-6">
              Aucune matière ne correspond à ta recherche.
            </p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
