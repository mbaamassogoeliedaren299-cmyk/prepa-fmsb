import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Check, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function QcmChapitre() {
  const { chapitreId } = useParams()
  const navigate = useNavigate()

  const [chargement, setChargement] = useState(true)
  const [titreChapitre, setTitreChapitre] = useState('')
  const [matiereId, setMatiereId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [selection, setSelection] = useState(null)
  const [aValide, setAValide] = useState(false)
  const [bonnesReponses, setBonnesReponses] = useState(0)
  const [termine, setTermine] = useState(false)

  useEffect(() => {
    async function charger() {
      const { data: chapitre } = await supabase
        .from('chapitres')
        .select('titre, matiere_id')
        .eq('id', chapitreId)
        .single()
      setTitreChapitre(chapitre?.titre || '')
      setMatiereId(chapitre?.matiere_id || null)

      const { data: qs } = await supabase
        .from('questions')
        .select('id, enonce, options, reponse, explication')
        .eq('chapitre_id', chapitreId)
      setQuestions(qs || [])
      setChargement(false)
    }
    charger()
  }, [chapitreId])

  function choisir(i) {
    if (aValide) return
    setSelection(i)
  }

  function valider() {
    if (selection === null) return
    setAValide(true)
    if (selection === questions[index].reponse) {
      setBonnesReponses((n) => n + 1)
    }
  }

  async function suivant() {
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setSelection(null)
      setAValide(false)
    } else {
      setTermine(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user && matiereId) {
        const taux = Math.round((bonnesReponses / questions.length) * 100)
        await supabase.from('progression').upsert(
          {
            utilisateur_id: user.id,
            matiere_id: matiereId,
            taux_maitrise: taux,
            derniere_activite: new Date().toISOString(),
          },
          { onConflict: 'utilisateur_id,matiere_id' }
        )
      }
    }
  }

  if (chargement) {
    return <div className="min-h-screen bg-paper" />
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 text-center gap-3">
        <p className="font-display font-extrabold text-ink text-lg">{titreChapitre || 'Chapitre'}</p>
        <p className="text-sm text-text-muted">
          Aucune question n'est encore disponible pour ce chapitre. Reviens bientôt !
        </p>
        <Link to="/matieres" className="text-sm text-ink underline decoration-dotted mt-2">
          Retour aux matières
        </Link>
      </div>
    )
  }

  if (termine) {
    const total = questions.length
    return (
      <div className="min-h-screen bg-paper px-5 py-8 flex flex-col items-center justify-center text-center">
        <p className="font-display font-extrabold text-ink text-xl mb-1">Série terminée !</p>
        <p className="text-text-muted text-sm mb-6">{titreChapitre}</p>
        <div className="bg-white border border-line rounded-2xl py-6 px-10 mb-6">
          <p className="font-display font-extrabold text-ink text-4xl">
            {bonnesReponses}/{total}
          </p>
          <p className="text-text-muted text-sm mt-1">bonnes réponses</p>
        </div>
        <Link
          to="/matieres"
          className="py-3 px-8 rounded-full bg-stamp text-white font-display font-extrabold text-sm"
        >
          Retour aux matières
        </Link>
      </div>
    )
  }

  const question = questions[index]

  return (
    <div className="min-h-screen bg-paper px-5 py-6">
      <div className="mx-auto max-w-md">
        <div className="flex items-center gap-2 mb-3">
          <button type="button" onClick={() => navigate('/matieres')} className="text-ink">
            <ArrowLeft size={20} />
          </button>
          <p className="text-sm font-medium text-ink truncate">{titreChapitre}</p>
        </div>

        <p className="text-xs text-text-muted mb-1">
          Question {index + 1}/{questions.length}
        </p>
        <div className="h-1.5 rounded-full bg-line overflow-hidden mb-5">
          <div
            className="h-full rounded-full bg-ink transition-all duration-300"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>

        <p className="text-sm font-medium text-text mb-4">{question.enonce}</p>

        <div className="flex flex-col gap-2 mb-4">
          {question.options.map((option, i) => {
            let style = 'border-line bg-white text-text'
            if (aValide && i === question.reponse) {
              style = 'border-success bg-success-light text-success font-medium'
            } else if (aValide && i === selection && i !== question.reponse) {
              style = 'border-red-300 bg-red-50 text-red-600 font-medium'
            } else if (!aValide && selection === i) {
              style = 'border-ink bg-ink-light text-ink font-medium'
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => choisir(i)}
                disabled={aValide}
                className={`text-left text-sm px-4 py-3 rounded-lg border flex items-center justify-between ${style}`}
              >
                <span>{String.fromCharCode(65 + i)}. {option}</span>
                {aValide && i === question.reponse && <Check size={16} />}
                {aValide && i === selection && i !== question.reponse && <X size={16} />}
              </button>
            )
          })}
        </div>

        {aValide && question.explication && (
          <div className="bg-ink-light border border-line rounded-lg px-4 py-3 mb-4 text-xs text-text">
            {question.explication}
          </div>
        )}

        {!aValide ? (
          <button
            type="button"
            disabled={selection === null}
            onClick={valider}
            className="w-full py-3 rounded-full bg-stamp text-white font-display font-extrabold text-sm disabled:opacity-40"
          >
            Valider
          </button>
        ) : (
          <button
            type="button"
            onClick={suivant}
            className="w-full py-3 rounded-full bg-stamp text-white font-display font-extrabold text-sm"
          >
            {index + 1 < questions.length ? 'Question suivante' : 'Voir le résultat'}
          </button>
        )}
      </div>
    </div>
  )
}
