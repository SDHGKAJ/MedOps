import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Login from './components/Login'
import ModuleCard from './components/ModuleCard'

function App() {
  const [user, setUser] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('medops_user')
    if (savedUser) {
      setUser(savedUser)
    }
  }, [])

  const handleLogin = (username) => {
    setUser(username)
    localStorage.setItem('medops_user', username)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('medops_user')
    setSelectedModule(null)
  }

  // Show login page if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const modules = [
    {
      id: 1,
      title: 'User Authentication',
      description: 'Login, roles, permissions, audit trail',
      icon: '👤',
      color: '#6366f1'
    },
    {
      id: 2,
      title: 'Inventory Management',
      description: 'Stock in/out, adjustments, reorder levels',
      icon: '📦',
      color: '#ec4899'
    },
    {
      id: 3,
      title: 'Order Management',
      description: 'Purchase orders, transfers, fulfillment',
      icon: '📋',
      color: '#f59e0b'
    },
    {
      id: 4,
      title: 'Batch & Expiry Tracking',
      description: 'Batch capture, FEFO picking, expiry alerts',
      icon: '⏰',
      color: '#3b82f6'
    },
    {
      id: 5,
      title: 'Notifications',
      description: 'Email/SMS/in-app alerts for reorder, expiry, order status',
      icon: '🔔',
      color: '#10b981'
    },
    {
      id: 6,
      title: 'Analytics Dashboard',
      description: 'KPIs: stockouts, expiry, lead times, fill rate',
      icon: '📊',
      color: '#8b5cf6'
    }
  ]

  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} />
      <main className="main-content">
        <div className="content-header">
          <h1>MedOps Dashboard</h1>
          <p>Manage your medical operations efficiently</p>
        </div>

        <div className="modules-grid">
          {modules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              isSelected={selectedModule?.id === module.id}
              onSelect={() => setSelectedModule(module)}
            />
          ))}
        </div>

        {selectedModule && (
          <div className="module-detail">
            <button className="close-btn" onClick={() => setSelectedModule(null)}>
              ✕
            </button>
            <div className="detail-content">
              <div className="detail-icon" style={{ color: selectedModule.color }}>
                {selectedModule.icon}
              </div>
              <h2>{selectedModule.title}</h2>
              <p>{selectedModule.description}</p>
              <button className="btn-primary" onClick={() => setSelectedModule(null)}>
                Start
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
