import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { supabase } from '../lib/supabaseClient'

export default function Profil() {
  const navigate = useNavigate()
  const [profil, setProfil] = useState(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email)
      const { data } = await supabase
        .from('profils')
        .select('nom, serie_bac, filiere_visee')
        .eq('id', user.id)
        .single()
      setProfil(data)
    }
    charger()
  }, [])

  async function seDeconnecter() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-paper pb-24">
      <div className="mx-auto max-w-md px-5 pt-6">
        <p className="font-display font-extrabold text-ink text-lg mb-4">Profil</p>

        <div className="bg-white border border-line rounded-xl p-5 mb-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-ink-light flex items-center justify-center mb-3">
            <User size={28} className="text-ink" />
          </div>
          <p className="font-display font-extrabold text-ink text-lg">{profil?.nom || '—'}</p>
          <p className="text-xs text-text-muted">{email}</p>
        </div>

        <div className="bg-white border border-line rounded-xl divide-y divide-line mb-6">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-text-muted">Série du bac</span>
            <span className="text-sm text-ink font-medium">{profil?.serie_bac || '—'}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-text-muted">Filière visée</span>
            <span className="text-sm text-ink font-medium">{profil?.filiere_visee || '—'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={seDeconnecter}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-line text-red-600 font-medium text-sm"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
