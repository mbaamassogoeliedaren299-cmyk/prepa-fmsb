import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const SERIES_BAC = ['C', 'D', 'TI', 'Autre']

export default function Connexion() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mode, setMode] = useState(location.pathname === '/inscription' ? 'inscription' : 'connexion')

  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [nom, setNom] = useState('')
  const [serieBac, setSerieBac] = useState('')
  const [filiereVisee, setFiliereVisee] = useState('')

  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')

  async function gererEnvoi(e) {
    e.preventDefault()
    setErreur('')
    setChargement(true)

    if (mode === 'connexion') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: motDePasse,
      })
      setChargement(false)
      if (error) {
        setErreur(traduireErreur(error.message))
        return
      }
      navigate('/tableau-de-bord')
    } else {
      // Confirmation email désactivée côté Supabase (Authentication > Sign In / Providers
      // > Email > "Confirm email" décoché) : le compte est actif immédiatement, avec
      // une session ouverte dès la création.
      const { error } = await supabase.auth.signUp({
        email,
        password: motDePasse,
        options: {
          data: { nom, serie_bac: serieBac, filiere_visee: filiereVisee },
        },
      })
      setChargement(false)
      if (error) {
        setErreur(traduireErreur(error.message))
        return
      }
      navigate('/tableau-de-bord')
    }
  }

  function traduireErreur(message) {
    if (message.includes('Invalid login credentials')) {
      return 'Email ou mot de passe incorrect.'
    }
    if (message.includes('already registered')) {
      return 'Un compte existe déjà avec cet email.'
    }
    if (message.includes('Password should be')) {
      return 'Le mot de passe doit contenir au moins 6 caractères.'
    }
    if (message.includes('rate limit')) {
      return 'Trop de tentatives en peu de temps. Réessaie dans quelques minutes.'
    }
    return message
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <p className="font-display font-extrabold text-ink text-xl text-center mb-6">
          Bienvenue
        </p>

        <div className="flex border border-line rounded-full bg-white p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode('connexion')}
            className={`flex-1 text-sm font-medium py-2 rounded-full transition-colors ${
              mode === 'connexion' ? 'bg-ink text-paper' : 'text-text-muted'
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setMode('inscription')}
            className={`flex-1 text-sm font-medium py-2 rounded-full transition-colors ${
              mode === 'inscription' ? 'bg-ink text-paper' : 'text-text-muted'
            }`}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={gererEnvoi} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-text-muted">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@exemple.com"
              className="border border-line rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-ink"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-text-muted">Mot de passe</span>
            <input
              type="password"
              required
              minLength={6}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="6 caractères minimum"
              className="border border-line rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-ink"
            />
          </label>

          {mode === 'connexion' && (
            <button type="button" className="text-xs text-ink text-right underline decoration-dotted self-end">
              Mot de passe oublié ?
            </button>
          )}

          {mode === 'inscription' && (
            <>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-text-muted">Nom complet</span>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex. Aïcha Ndiaye"
                  className="border border-line rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-ink"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-text-muted">Série du bac</span>
                <select
                  required
                  value={serieBac}
                  onChange={(e) => setSerieBac(e.target.value)}
                  className="border border-line rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-ink"
                >
                  <option value="" disabled>Choisis ta série</option>
                  {SERIES_BAC.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-text-muted">Filière visée</span>
                <input
                  type="text"
                  required
                  value={filiereVisee}
                  onChange={(e) => setFiliereVisee(e.target.value)}
                  placeholder="Ex. Médecine générale"
                  className="border border-line rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-ink"
                />
              </label>
            </>
          )}

          {erreur && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erreur}
            </p>
          )}

          <button
            type="submit"
            disabled={chargement}
            className="mt-2 py-3 rounded-full bg-stamp text-white font-display font-extrabold text-sm disabled:opacity-60"
          >
            {chargement
              ? 'Un instant…'
              : mode === 'connexion'
                ? 'Se connecter'
                : 'Créer mon compte'}
          </button>
        </form>
      </div>
    </div>
  )
}
