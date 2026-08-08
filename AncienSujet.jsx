import { useEffect, useState } from 'react'
import { Clock, Check, X } from 'lucide-react'

// Données d'exemple — remplacées plus tard par la table Examens (type = "ancien_sujet")
// et les Questions qui lui sont rattachées. Durée confirmée : 3h pour toutes les matières.
const SUJET = {
  titre: 'Biologie — Ancien sujet 2023',
  dureeSecondes: 3 * 60 * 60, // 3h — durée réelle des épreuves du concours
  questions: [
    {
      enonce: "Quelle organite est responsable de la production d'énergie dans la cellule ?",
      options: ['Le noyau', 'La mitochondrie', "L'appareil de Golgi", 'Le lysosome'],
      reponse: 1,
      explication: "La mitochondrie transforme les nutriments en ATP, l'énergie utilisable par la cellule.",
    },
    {
      enonce: 'Combien de chromosomes possède une cellule humaine normale ?',
      options: ['23', '42', '44', '46'],
      reponse: 3,
      explication: 'Une cellule humaine normale possède 46 chromosomes, soit 23 paires.',
    },
    {
      enonce: 'Quel type de molécule porte l\'information génétique ?',
      options: ['ARN messager', 'ADN', 'Protéine', 'Glucide'],
      reponse: 1,
      explication: "L'ADN (acide désoxyribonucléique) porte l'information génétique héréditaire.",
    },
    {
      enonce: 'La méiose produit des cellules :',
      options: ['Diploïdes identiques', 'Haploïdes', 'Tétraploïdes', 'Sans noyau'],
      reponse: 1,
      explication: 'La méiose produit des cellules haploïdes (gamètes), avec la moitié du nombre de chromosomes.',
    },
    {
      enonce: 'Quelle est la fonction principale des globules rouges ?',
      options: [
        'Combattre les infections',
        "Transporter l'oxygène",
        'Coaguler le sang',
        'Produire des anticorps',
      ],
      reponse: 1,
      explication: "Les globules rouges transportent l'oxygène grâce à l'hémoglobine qu'ils contiennent.",
    },
  ],
}

function formaterTemps(secondes) {
  const h = Math.floor(secondes / 3600)
  const m = Math.floor((secondes % 3600) / 60)
  const s = secondes % 60
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AncienSujet() {
  const [index, setIndex] = useState(0)
  const [reponses, setReponses] = useState([])
  const [selection, setSelection] = useState(null)
  const [tempsRestant, setTempsRestant] = useState(SUJET.dureeSecondes)
  const [termine, setTermine] = useState(false)

  const question = SUJET.questions[index]
  const totalQuestions = SUJET.questions.length

  useEffect(() => {
    if (termine) return
    if (tempsRestant <= 0) {
      setTermine(true)
      return
    }
    const timer = setTimeout(() => setTempsRestant((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [tempsRestant, termine])

  function validerQuestion() {
    const nouvellesReponses = [...reponses, selection]
    setReponses(nouvellesReponses)
    setSelection(null)
    if (index + 1 < totalQuestions) {
      setIndex(index + 1)
    } else {
      setTermine(true)
    }
  }

  if (termine) {
    const score = reponses.filter((r, i) => r === SUJET.questions[i].reponse).length
    return (
      <div className="min-h-screen bg-paper px-5 py-8">
        <div className="mx-auto max-w-md">
          <p className="font-display font-extrabold text-ink text-xl text-center mb-1">
            Résultat
          </p>
          <p className="text-center text-text-muted text-sm mb-6">{SUJET.titre}</p>

          <div className="bg-white border border-line rounded-2xl py-6 text-center mb-6">
            <p className="font-display font-extrabold text-ink text-4xl">
              {score}/{totalQuestions}
            </p>
            <p className="text-text-muted text-sm mt-1">bonnes réponses</p>
          </div>

          <p className="font-display font-extrabold text-ink text-sm mb-3">Corrigé détaillé</p>
          <div className="flex flex-col gap-3">
            {SUJET.questions.map((q, i) => {
              const bonneReponse = reponses[i] === q.reponse
              return (
                <div key={i} className="bg-white border border-line rounded-xl p-4">
                  <div className="flex items-start gap-2 mb-2">
                    {bonneReponse ? (
                      <Check size={16} className="text-success shrink-0 mt-0.5" />
                    ) : (
                      <X size={16} className="text-red-500 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium text-ink">{q.enonce}</p>
                  </div>
                  <p className="text-xs text-text-muted pl-6">
                    Bonne réponse : <span className="text-success font-medium">{q.options[q.reponse]}</span>
                  </p>
                  <p className="text-xs text-text-muted pl-6 mt-1">{q.explication}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper px-5 py-6">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-ink">{SUJET.titre}</p>
          <span className="flex items-center gap-1 text-xs font-medium text-stamp bg-stamp-light rounded-md px-2 py-1">
            <Clock size={13} />
            {formaterTemps(tempsRestant)}
          </span>
        </div>

        <p className="text-xs text-text-muted mb-1">
          Question {index + 1}/{totalQuestions}
        </p>
        <div className="h-1.5 rounded-full bg-line overflow-hidden mb-5">
          <div
            className="h-full rounded-full bg-ink"
            style={{ width: `${((index + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        <p className="text-sm font-medium text-text mb-4">{question.enonce}</p>

        <div className="flex flex-col gap-2 mb-6">
          {question.options.map((option, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelection(i)}
              className={`text-left text-sm px-4 py-3 rounded-lg border ${
                selection === i
                  ? 'border-ink bg-ink-light text-ink font-medium'
                  : 'border-line bg-white text-text'
              }`}
            >
              {String.fromCharCode(65 + i)}. {option}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={selection === null}
          onClick={validerQuestion}
          className="w-full py-3 rounded-full bg-stamp text-white font-display font-extrabold text-sm disabled:opacity-40"
        >
          {index + 1 < totalQuestions ? 'Question suivante' : "Terminer l'examen"}
        </button>
      </div>
    </div>
  )
}
