import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function ReinitialiserMotDePasse() {
  const navigate = useNavigate()
  const [motDePasse, setMotDePasse] = useState('')
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState(false)

  async function gererEnvoi(e) {
    e.preventDefault()
    setErreur('')
    setChargement(true)
    const { error } = await supabase.auth.updateUser({ password: motDePasse })
    setChargement(false)
    if (error) {
      setErreur(
        error.message.includes('Password should be')
          ? 'Le mot de passe doit contenir au moins 6 caractères.'
          : error.message
      )
      return
    }
    setSucces(true)
    setTimeout(() => navigate('/tableau-de-bord'), 1500)
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <p className="font-display font-extrabold text-ink text-xl text-center mb-2">
          Nouveau mot de passe
        </p>
        <p className="text-sm text-text-muted text-center mb-6">
          Choisis un nouveau mot de passe pour ton compte.
        </p>

        {succes ? (
          <p className="text-sm text-success bg-success-light border border-success/30 rounded-lg px-3 py-3 text-center">
            Mot de passe mis à jour ! Redirection…
          </p>
        ) : (
          <form onSubmit={gererEnvoi} className="flex flex-col gap-3">
            <input
              type="password"
              required
              minLength={6}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="Nouveau mot de passe (6 caractères min.)"
              className="border border-line rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-ink"
            />

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
              {chargement ? 'Un instant…' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
