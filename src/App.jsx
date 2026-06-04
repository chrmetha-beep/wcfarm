import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import VisitorsPage from './pages/VisitorsPage'
import MedicalPage from './pages/MedicalPage'
import FeedPage from './pages/FeedPage'
import IssuesPage from './pages/IssuesPage'
import DeliveriesPage from './pages/DeliveriesPage'
import ContactsPage from './pages/ContactsPage'

// Initialize Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase credentials not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading">กำลังโหลด...</div>
      </div>
    )
  }

  const renderPage = () => {
    const pageProps = { supabase }
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard {...pageProps} />
      case 'visitors':
        return <VisitorsPage {...pageProps} />
      case 'medical':
        return <MedicalPage {...pageProps} />
      case 'feed':
        return <FeedPage {...pageProps} />
      case 'issues':
        return <IssuesPage {...pageProps} />
      case 'deliveries':
        return <DeliveriesPage {...pageProps} />
      case 'contacts':
        return <ContactsPage {...pageProps} />
      default:
        return <Dashboard {...pageProps} />
    }
  }

  return (
    <div className="app-container">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
