import { useState, useEffect } from 'react';
import { orderService, medicineService } from '../services/api';

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New Order State
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [cart, setCart] = useState([]); // { medicineId, quantity, details }

  useEffect(() => {
    fetchOrders();
    if (user.role === 'customer') {
      fetchAvailableMedicines();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = user.role === 'admin'
        ? await orderService.getAll()
        : await orderService.getMyOrders();
      setOrders(res.orders || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMedicines = async () => {
    try {
      const res = await medicineService.getAll();
      setMedicines((res.medicines || []).filter(m => m.quantity > 0));
    } catch (err) {
      console.error('Failed to fetch medicines for order', err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await orderService.updateStatus(id, status);
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelOrder = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(id);
        fetchOrders();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Cart Management
  const addToCart = (medicine) => {
    const existing = cart.find(item => item.medicineId === medicine._id);
    if (existing) {
      if (existing.quantity >= medicine.quantity) {
        alert('Stock limit reached');
        return;
      }
      setCart(cart.map(item =>
        item.medicineId === medicine._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { medicineId: medicine._id, quantity: 1, details: medicine }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.medicineId !== id));
  };

  const submitOrder = async () => {
    if (cart.length === 0) return;
    try {
      const orderData = {
        medicines: cart.map(item => ({
          medicineId: item.medicineId,
          quantity: item.quantity
        }))
      };
      await orderService.placeOrder(orderData);
      setCart([]);
      setShowNewOrder(false);
      fetchOrders();
      alert('Order placed successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed': return '#3b82f6';
      case 'confirmed': return '#f59e0b';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div className="orders-module">
      <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>{user.role === 'admin' ? 'All System Orders' : 'My Orders'}</h2>
        {user.role === 'customer' && (
          <button className="btn-primary" onClick={() => setShowNewOrder(!showNewOrder)}>
            {showNewOrder ? 'View My Orders' : 'Place New Order'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showNewOrder ? (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <h3>Available Medicines</h3>
            <div style={{ display: 'grid', gap: '1rem', maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {medicines.map(med => (
                <div key={med._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{med.name}</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>${med.price} | Stock: {med.quantity}</p>
                  </div>
                  <button className="btn-primary" onClick={() => addToCart(med)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', alignSelf: 'start' }}>
            <h3>Your Cart</h3>
            {cart.length === 0 ? (
              <p>No items added</p>
            ) : (
              <div>
                {cart.map(item => (
                  <div key={item.medicineId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span>{item.details.name} (x{item.quantity})</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span>${item.details.price * item.quantity}</span>
                      <button onClick={() => removeFromCart(item.medicineId)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: '2px solid #e2e8f0', margin: '1rem 0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>Total:</span>
                  <span>${cart.reduce((sum, item) => sum + (item.details.price * item.quantity), 0)}</span>
                </div>
                <button className="btn-primary" style={{ width: '100%' }} onClick={submitOrder}>
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {orders.map(order => (
                <div key={order._id} style={{ border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0' }}>Order #{order._id.substring(order._id.length - 8)}</h3>
                      {user.role === 'admin' && (
                        <div style={{ margin: '0.5rem 0', padding: '0.5rem', background: '#f8fafc', borderRadius: '4px', border: '1px dashed #cbd5e1' }}>
                          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold', color: '#334155' }}>Customer Info:</p>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Username: {order.customerId?.username || order.customerId}</p>
                          {order.customerId?.email && <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Email: {order.customerId.email}</p>}
                        </div>
                      )}
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        color: 'white',
                        background: getStatusColor(order.status),
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase'
                      }}>
                        {order.status}
                      </span>
                      <h3 style={{ margin: 0 }}>Total: ${order.totalPrice}</h3>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748b' }}>Items:</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                      {order.medicines.map((item, idx) => {
                        const medName = item.medicineId?.name || (item.medicineId?.length > 10 ? 'Medicine (Deleted)' : item.medicineId)
                        const price = item.price || 0
                        return (
                          <li key={idx}>
                            {medName} - Qty: {item.quantity} (${price} ea)
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  {user.role === 'admin' && (
                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Update Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        disabled={order.status === 'cancelled'}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          opacity: order.status === 'cancelled' ? 0.5 : 1,
                          cursor: order.status === 'cancelled' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {order.status === 'cancelled' && (
                        <span style={{ fontSize: '0.8rem', color: '#ef4444', fontStyle: 'italic' }}>Order cancelled — cannot update</span>
                      )}
                    </div>
                  )}

                  {user.role === 'customer' && order.status === 'placed' && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                      <button onClick={() => handleCancelOrder(order._id)} style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
