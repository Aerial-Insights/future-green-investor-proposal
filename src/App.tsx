import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import TopNav from './components/layout/TopNav'
import Footer from './components/layout/Footer'
import ExplanationDrawer from './components/explanation/ExplanationDrawer'

export default function App() {
  const location = useLocation()

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
