import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Accueil from './pages/Accueil'
import Connexion from './pages/Connexion'
import TableauDeBord from './pages/TableauDeBord'
import Matieres from './pages/Matieres'
import AncienSujet from './pages/AncienSujet'
import Placeholder from './components/Placeholder'

// Chargé à la demande : la bibliothèque de rendu PDF est lourde (~1 Mo),
// on évite de l'inclure dans le chargement initial du site (voir cahier des
// charges 3.1/3.4 : temps de chargement et consommation de données réduits).
const LecturePdf = lazy(() => import('./pages/LecturePdf'))

function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/inscription" element={<Connexion />} />
      <Route path="/tableau-de-bord" element={<TableauDeBord />} />
      <Route path="/matieres" element={<Matieres />} />
      <Route path="/ancien-sujet" element={<AncienSujet />} />
      <Route
        path="/lecture-pdf"
        element={
          <Suspense fallback={<div className="min-h-screen bg-paper" />}>
            <LecturePdf />
          </Suspense>
        }
      />
      <Route path="/profil" element={<Placeholder titre="Profil" />} />
    </Routes>
  )
}

export default App
