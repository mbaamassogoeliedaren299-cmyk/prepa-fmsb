import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { ArrowLeft, ChevronLeft, ChevronRight, StickyNote, X } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

// Fichier d'exemple — sera remplacé par l'URL Supabase Storage du vrai document
// (table Documents_PDF, champ fichier_url).
const URL_DOCUMENT = '/cours-biologie-cellulaire.pdf'
const NOM_UTILISATEUR = 'Aïcha N.' // viendra de la session Supabase Auth une fois connectée

export default function LecturePdf() {
  const [nbPages, setNbPages] = useState(null)
  const [page, setPage] = useState(1)
  const [panneauNotes, setPanneauNotes] = useState(false)
  const [notes, setNotes] = useState([])
  const [brouillon, setBrouillon] = useState('')

  function ajouterNote() {
    if (!brouillon.trim()) return
    setNotes([...notes, { page, texte: brouillon.trim() }])
    setBrouillon('')
  }

  const notesPage = notes.filter((n) => n.page === page)

  return (
    <div
      className="min-h-screen bg-paper flex flex-col"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* En-tête */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-white">
        <button type="button" className="text-ink">
          <ArrowLeft size={20} />
        </button>
        <p className="text-sm font-medium text-ink truncate px-2">Cours — Biologie cellulaire</p>
        <button type="button" onClick={() => setPanneauNotes(!panneauNotes)} className="text-ink relative">
          <StickyNote size={20} />
          {notes.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-stamp text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {notes.length}
            </span>
          )}
        </button>
      </div>

      {/* Visionneuse */}
      <div className="flex-1 overflow-auto flex justify-center py-4 px-2 relative select-none">
        <div className="relative shadow-none">
          <Document
            file={URL_DOCUMENT}
            onLoadSuccess={({ numPages }) => setNbPages(numPages)}
            loading={<p className="text-sm text-text-muted pt-10">Chargement du cours…</p>}
            error={<p className="text-sm text-red-600 pt-10">Impossible de charger le document.</p>}
          >
            <Page pageNumber={page} width={340} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>

          {/* Filigrane */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="text-black/10 text-2xl font-medium -rotate-45 whitespace-nowrap select-none">
              {NOM_UTILISATEUR} — MedPrep CM · {NOM_UTILISATEUR} — MedPrep CM
            </span>
          </div>
        </div>
      </div>

      {/* Navigation de page */}
      <div className="flex items-center justify-center gap-4 py-3 border-t border-line bg-white">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="text-ink disabled:text-line"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="text-xs text-text-muted">
          Page {page}/{nbPages ?? '…'}
        </span>
        <button
          type="button"
          disabled={!nbPages || page >= nbPages}
          onClick={() => setPage((p) => p + 1)}
          className="text-ink disabled:text-line"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Panneau de notes */}
      {panneauNotes && (
        <div className="fixed inset-x-0 bottom-0 bg-white border-t border-line rounded-t-2xl max-w-md mx-auto w-full p-4 max-h-[60vh] flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-extrabold text-sm text-ink">
              Notes — page {page}
            </p>
            <button type="button" onClick={() => setPanneauNotes(false)} className="text-text-muted">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-auto flex flex-col gap-2 mb-3">
            {notesPage.length === 0 && (
              <p className="text-xs text-text-muted">Aucune note sur cette page pour l'instant.</p>
            )}
            {notesPage.map((n, i) => (
              <div key={i} className="bg-ink-light text-sm text-ink rounded-lg px-3 py-2">
                {n.texte}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={brouillon}
              onChange={(e) => setBrouillon(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ajouterNote()}
              placeholder="Ajouter une note sur cette page"
              className="flex-1 border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-ink"
            />
            <button
              type="button"
              onClick={ajouterNote}
              className="px-4 rounded-lg bg-stamp text-white text-sm font-medium"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
