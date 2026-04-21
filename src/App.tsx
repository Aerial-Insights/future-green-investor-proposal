import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import TopNav from './components/layout/TopNav'
import Footer from './components/layout/Footer'
import ExplanationDrawer from './components/explanation/ExplanationDrawer'
import { applyThemeToDOM } from './theme/themeValues'

export default function App() {
  const location = useLocation()

  // Apply theme variables as inline styles on <html>
  useEffect(() => {
    applyThemeToDOM()
  }, [])

  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <AnimatePresence mode="wait">
        <div key={location.pathname}>
          <Outlet />
        </div>
      </AnimatePresence>
      <Footer />
      <ExplanationDrawer />
    </div>
  )
}
