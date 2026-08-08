import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Clock, User } from 'lucide-react'

const ITEMS = [
  { to: '/tableau-de-bord', label: 'Accueil', icon: Home },
  { to: '/matieres', label: 'Matières', icon: BookOpen },
  { to: '/ancien-sujet', label: 'Examens', icon: Clock },
  { to: '/profil', label: 'Profil', icon: User },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-paper border-t border-line flex py-2 max-w-md mx-auto">
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 text-[10px] ${
              isActive ? 'text-ink font-medium' : 'text-text-muted'
            }`
          }
        >
          <Icon size={19} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
