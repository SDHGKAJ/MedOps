import { useState, useEffect } from 'react';
import { authService } from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await authService.getAllUsers();
      setUsers(res.users || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-module">
      <div className="module-header" style={{ marginBottom: '1rem' }}>
        <h2>User Management</h2>
        <p style={{ color: '#64748b' }}>View and manage all registered users across the platform.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', paddingRight: '0.5rem', paddingBottom: '1rem' }}>
          {users.length === 0 ? <p>No users found.</p> : users.map(u => (
            <div key={u.id} style={{ border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>{u.username}</h3>
                <span style={{ 
                  background: u.role === 'admin' ? '#fde68a' : '#e0e7ff', 
                  color: u.role === 'admin' ? '#92400e' : '#3730a3', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {u.role}
                </span>
              </div>
              <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.875rem' }}>
                <strong style={{ color: '#334155' }}>Email:</strong> {u.email}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.875rem' }}>
                <strong style={{ color: '#334155' }}>User ID:</strong> <span style={{ fontFamily: 'monospace' }}>{u.id}</span>
              </p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                Joined: {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
