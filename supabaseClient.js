import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // On avertit plutôt que de planter : utile pendant qu'on construit l'interface
  // avant d'avoir connecté un vrai projet Supabase. Les appels échoueront proprement
  // (erreur réseau) au lieu de faire planter toute l'application au démarrage.
  console.warn(
    'Variables Supabase manquantes. Copie .env.example vers .env et renseigne tes clés.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
