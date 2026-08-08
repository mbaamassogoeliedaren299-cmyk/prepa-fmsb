export default function Placeholder({ titre }) {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-display font-extrabold text-ink text-lg mb-1">{titre}</p>
        <p className="text-text-muted text-sm">Cet écran arrive à la prochaine étape.</p>
      </div>
    </div>
  )
}
