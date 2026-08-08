import { Link } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'

const MATIERES = ['Biologie', 'Chimie', 'Physique', 'Mathématiques', 'Culture générale']

const ETAPES = [
  { label: 'Crée ton compte gratuitement', faite: true },
  { label: 'Choisis ta matière', faite: false },
  { label: 'Entraîne-toi et suis ta progression', faite: false },
]

export default function Accueil() {
  return (
    <div className="min-h-screen bg-paper text-text">
      <div className="mx-auto max-w-md px-5 pb-12 pt-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center shrink-0">
            <Check size={16} className="text-paper" />
          </div>
          <span className="font-display font-extrabold text-lg text-ink">MedPrep CM</span>
        </div>

        {/* Bandeau citation + tampon */}
        <div className="relative -mx-5 px-6 pt-6 pb-8 bg-ink rounded-b-3xl">
          <div className="text-3xl text-stamp leading-none mb-1">"</div>
          <p className="font-display font-bold text-paper text-lg leading-snug">
            Chaque effort d'aujourd'hui est un pas de plus vers la blouse blanche de demain.
          </p>
          <div className="absolute right-5 -bottom-6 w-16 h-16 rounded-full border-2 border-dashed border-stamp bg-paper flex items-center justify-center text-center -rotate-12">
            <span className="font-display font-extrabold text-[10px] text-stamp leading-tight">
              100%<br />gratuit
            </span>
          </div>
        </div>

        {/* Statistiques */}
        <div className="flex mt-10 py-3 px-2 bg-white border border-line rounded-xl divide-x divide-dotted divide-line">
          <div className="flex-1 text-center">
            <div className="font-display font-extrabold text-lg text-ink">500+</div>
            <div className="text-[11px] text-text-muted">Questions</div>
          </div>
          <div className="flex-1 text-center">
            <div className="font-display font-extrabold text-lg text-ink">6</div>
            <div className="text-[11px] text-text-muted">Matières</div>
          </div>
          <div className="flex-1 text-center">
            <div className="font-display font-extrabold text-lg text-success">94%</div>
            <div className="text-[11px] text-text-muted">Satisfaction</div>
          </div>
        </div>

        {/* Appels à l'action */}
        <Link
          to="/inscription"
          className="mt-5 block text-center py-3 rounded-full bg-stamp text-white font-display font-extrabold text-sm -rotate-1 hover:rotate-0 transition-transform"
        >
          Créer un compte gratuit
        </Link>
        <Link
          to="/connexion"
          className="block text-center mt-3 text-sm font-medium text-ink underline decoration-dotted"
        >
          J'ai déjà un compte
        </Link>

        {/* Comment ça marche */}
        <h2 className="font-display font-extrabold text-sm text-ink mt-9 mb-3">
          Comment ça marche
        </h2>
        <div className="relative pl-0">
          <div className="absolute left-[15px] top-3 bottom-3 border-l-2 border-dotted border-line" />
          <ul className="flex flex-col gap-3 relative">
            {ETAPES.map((etape) => (
              <li key={etape.label} className="flex items-center gap-3 relative z-10">
                <span
                  className={`w-8 h-5 rounded-full border-2 flex items-center justify-center shrink-0 bg-white ${
                    etape.faite ? 'border-success' : 'border-ink'
                  }`}
                >
                  {etape.faite && <Check size={12} className="text-success" />}
                </span>
                <span className="text-sm text-text">{etape.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sommaire des matières */}
        <h2 className="font-display font-extrabold text-sm text-ink mt-9 mb-2">
          Sommaire des matières
        </h2>
        <div className="bg-white border border-line rounded-xl px-4">
          {MATIERES.map((matiere, i) => (
            <Link
              to="/matieres"
              key={matiere}
              className={`flex items-baseline gap-2 py-3 ${
                i < MATIERES.length - 1 ? 'border-b border-dotted border-line' : ''
              }`}
            >
              <span className="text-sm font-medium text-ink">{matiere}</span>
              <span className="flex-1 border-b border-dotted border-line mb-[3px]" />
              <ChevronRight size={15} className="text-text-muted shrink-0" />
            </Link>
          ))}
        </div>

        {/* Communauté WhatsApp */}
        <a
          href="#"
          className="mt-6 border-t border-dashed border-line pt-4 flex items-center justify-center gap-2 text-sm font-medium text-success"
        >
          Rejoindre la communauté WhatsApp
        </a>
      </div>
    </div>
  )
}
