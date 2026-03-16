import { useState, useEffect } from 'react';
import { medicineService } from '../services/api';

export default function Medicines({ user }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Admin form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', manufacturer: '', category: '', price: '', quantity: '', description: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await medicineService.getAll();
      setMedicines(res.medicines || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return fetchMedicines();
    }
    try {
      setLoading(true);
      const res = await medicineService.search(searchQuery);
      setMedicines(res.medicines || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await medicineService.create({
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });
      setShowAddForm(false);
      setFormData({ name: '', manufacturer: '', category: '', price: '', quantity: '', description: '' });
      fetchMedicines();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await medicineService.delete(id);
        fetchMedicines();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="medicines-module">
      <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Medicines Inventory</h2>
        {user.role === 'admin' && (
          <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add New Medicine'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && user.role === 'admin' && (
        <form onSubmit={handleAddMedicine} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3>Add Medicine</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input required name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="form-input" />
            <input required name="manufacturer" placeholder="Manufacturer" value={formData.manufacturer} onChange={handleChange} className="form-input" />
            <input required name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="form-input" />
            <input required name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className="form-input" />
            <input required name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="form-input" />
            <input required name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="form-input" />
          </div>
          <button type="submit" className="btn-primary">Save Medicine</button>
        </form>
      )}

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Search medicines by name..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-primary" style={{ background: '#64748b' }}>Search</button>
        <button type="button" className="btn-primary" style={{ background: '#94a3b8' }} onClick={() => { setSearchQuery(''); fetchMedicines(); }}>Clear</button>
      </form>

      {loading ? (
        <p>Loading medicines...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {medicines.length === 0 ? <p>No medicines found.</p> : medicines.map(med => (
            <div key={med._id} style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{med.name}</h3>
                <span style={{ background: med.quantity > 0 ? '#dcfce7' : '#fee2e2', color: med.quantity > 0 ? '#166534' : '#991b1b', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                  {med.quantity} in stock
                </span>
              </div>
              <p style={{ margin: '0 0 0.25rem 0', color: '#64748b', fontSize: '0.875rem' }}>{med.manufacturer} | {med.category}</p>
              <p style={{ margin: '0 0 1rem 0', color: '#334155' }}>${med.price}</p>
              <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>{med.description}</p>
              
              {user.role === 'admin' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <button onClick={() => handleDelete(med._id)} style={{ padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', flex: 1 }}>
                    Delete
                  </button>
                  {/* Note: Update flow would ideally have its own form/modal */}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
