// Identifiants fixes des matières et de l'ancien sujet de démonstration,
// pour correspondre exactement aux lignes créées par le script SQL de seed
// (supabase/seed.sql). Une fois le vrai contenu ajouté via le Table Editor
// ou un import CSV, ces constantes seront remplacées par de vraies requêtes.

export const MATIERES_REF = [
  { id: '11111111-1111-1111-1111-111111111111', nom: 'Biologie' },
  { id: '22222222-2222-2222-2222-222222222222', nom: 'Chimie' },
  { id: '33333333-3333-3333-3333-333333333333', nom: 'Physique' },
  { id: '44444444-4444-4444-4444-444444444444', nom: 'Mathématiques' },
  { id: '55555555-5555-5555-5555-555555555555', nom: 'Culture générale' },
]

export const EXAMEN_ANCIEN_SUJET_BIOLOGIE = {
  id: '66666666-6666-6666-6666-666666666666',
  matiereId: '11111111-1111-1111-1111-111111111111',
}
