import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Login from './components/Login'
import { authService } from './services/api'
import ModuleCard from './components/ModuleCard'
import Medicines from './components/Medicines'
import Orders from './components/Orders'
import Users from './components/Users'


function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedModule, setSelectedModule] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('medops_token')
    if (token) {
      try {
        const res = await authService.getCurrentUser()
        if (res.success) {
          setUser(res.user)
        }
      } catch (err) {
        console.error('Auth verification failed', err)
        authService.logout()
      }
    }
    setLoading(false)
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setSelectedModule(null)
  }

  if (loading) {
    return <div className="app flex-center">Loading...</div>
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const getModulesByRole = (role) => {
    const allModules = [
      {
        id: 'medicines',
        title: 'Medicines Inventory',
        description: 'View catalog, check stock, and manage medicines',
        icon: '💊',
        color: '#ec4899',
        roles: ['admin', 'customer']
      },
      {
        id: 'orders',
        title: 'Order Management',
        description: 'View and manage purchase orders',
        icon: '📋',
        color: '#f59e0b',
        roles: ['admin', 'customer']
      },
      {
        id: 'users',
        title: 'User Management',
        description: 'Manage customers and admin users',
        icon: '👤',
        color: '#6366f1',
        roles: ['admin'] // Admin only
      }
    ]
    return allModules.filter(m => m.roles.includes(role))
  }

  const activeModules = getModulesByRole(user.role)

  return (
    <div className="app">
      <Header user={user.username} onLogout={handleLogout} />
      <main className="main-content">
        <div className="content-header">
          <h1>Welcome, {user.username}</h1>
          <p>Role: <span style={{textTransform:'capitalize', fontWeight:'bold', color: user.role === 'admin' ? '#ec4899' : '#3b82f6'}}>{user.role}</span> | Manage your medical operations efficiently</p>
        </div>

        <div className="modules-grid">
          {activeModules.map(module => (
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
            <div className="detail-content" style={{ textAlign: 'left', maxWidth: '1200px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
              {selectedModule.id === 'medicines' && <Medicines user={user} />}
              {selectedModule.id === 'orders' && <Orders user={user} />}
              {selectedModule.id === 'users' && <Users user={user} />}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
