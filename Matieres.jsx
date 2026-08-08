import { useState } from 'react'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import BottomNav from '../components/BottomNav'

// Données d'exemple — remplacées plus tard par les tables Matières / Chapitres / Questions
// (voir cahier des charges section 5.2 : Chapitres rattachées à Matières, Questions à Chapitres).
const MATIERES = [
  {
    id: 'biologie',
    nom: 'Biologie',
    progression: 70,
    chapitres: [
      { id: 'cellule', titre: 'La cellule', nbQuestions: 24 },
      { id: 'genetique', titre: 'Génétique', nbQuestions: 18 },
      { id: 'physiologie', titre: 'Physiologie humaine', nbQuestions: 22 },
    ],
  },
  {
    id: 'chimie',
    nom: 'Chimie',
    progression: 40,
    chapitres: [
      { id: 'atomistique', titre: 'Atomistique', nbQuestions: 16 },
      { id: 'reactions', titre: 'Réactions chimiques', nbQuestions: 20 },
    ],
  },
  {
    id: 'physique',
    nom: 'Physique',
    progression: 30,
    chapitres: [
      { id: 'mecanique', titre: 'Mécanique', nbQuestions: 19 },
      { id: 'optique', titre: 'Optique', nbQuestions: 14 },
    ],
  },
  {
    id: 'mathematiques',
    nom: 'Mathématiques',
    progression: 15,
    chapitres: [
      { id: 'algebre', titre: 'Algèbre', nbQuestions: 21 },
      { id: 'analyse', titre: 'Analyse', nbQuestions: 17 },
    ],
  },
  {
    id: 'culture-generale',
    nom: 'Culture générale',
    progression: 50,
    chapitres: [
      { id: 'histoire-sante', titre: 'Histoire de la santé au Cameroun', nbQuestions: 12 },
      { id: 'actualites', titre: 'Actualités scientifiques', nbQuestions: 10 },
    ],
  },
]

export default function Matieres() {
  const [ouverte, setOuverte] = useState('biologie')
  const [recherche, setRecherche] = useState('')

  const matieresFiltrees = MATIERES.filter((m) =>
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
                  <span className="text-xs text-text-muted">{matiere.progression}%</span>
                </button>

                {estOuverte && (
                  <div className="border-t border-line">
                    {matiere.chapitres.map((chapitre) => (
                      <div
                        key={chapitre.id}
                        className="flex items-center justify-between pl-9 pr-4 py-2.5 border-b border-line last:border-b-0 text-sm"
                      >
                        <span className="text-text-muted">{chapitre.titre}</span>
                        <span className="flex items-center gap-1 text-ink text-xs font-medium">
                          {chapitre.nbQuestions} Q
                          <ChevronRight size={13} />
                        </span>
                      </div>
                    ))}
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
