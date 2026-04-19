import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './index.css'

// Lazy load pages for code splitting
const Overview = lazy(() => import('./pages/Overview'))
const HomeServices = lazy(() => import('./pages/HomeServices'))
const SolarRealEstate = lazy(() => import('./pages/SolarRealEstate'))
const AerialInsights = lazy(() => import('./pages/AerialInsights'))
const FinancialModel = lazy(() => import('./pages/FinancialModel'))
const AssumptionsLab = lazy(() => import('./pages/AssumptionsLab'))
const StrategicImpact = lazy(() => import('./pages/StrategicImpact'))
const Qualifications = lazy(() => import('./pages/Qualifications'))
const NextStep = lazy(() => import('./pages/NextStep'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function wrap(Component: React.LazyExoticComponent<() => JSX.Element>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: wrap(Overview) },
      { path: 'home-services', element: wrap(HomeServices) },
      { path: 'solar-real-estate', element: wrap(SolarRealEstate) },
      { path: 'aerial-insights', element: wrap(AerialInsights) },
      { path: 'financial-model', element: wrap(FinancialModel) },
      { path: 'assumptions-lab', element: wrap(AssumptionsLab) },
      { path: 'strategic-impact', element: wrap(StrategicImpact) },
      { path: 'qualifications', element: wrap(Qualifications) },
      { path: 'next-step', element: wrap(NextStep) },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
