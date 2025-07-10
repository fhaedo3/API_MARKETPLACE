import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItems, clearCart } from '../../store/slices/cartSlice';
import { selectCartItems, selectCartTotal, selectCartLoading } from '../../store/slices/cartSlice';
import { selectUserId, selectUsername, selectIsAuthenticated, selectToken } from '../../store/slices/authSlice';
import { processPayment, selectCheckoutProcessing, selectCheckoutError, selectPaymentSuccess, selectTransactionId, resetCheckout } from '../../store/slices/checkoutSlice';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Redux state
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartLoading = useSelector(selectCartLoading);
  const userId = useSelector(selectUserId);
  const username = useSelector(selectUsername);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);
  
  // Checkout state
  const checkoutProcessing = useSelector(selectCheckoutProcessing);
  const checkoutError = useSelector(selectCheckoutError);
  const paymentSuccess = useSelector(selectPaymentSuccess);
  const transactionId = useSelector(selectTransactionId);
  
  const [error, setError] = useState(null);
  
  // Datos del formulario de pago
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

  // Cargar datos del carrito al montar el componente
  useEffect(() => {
    // Verificar autenticación primero
    if (!isAuthenticated || !token) {
      console.log('Usuario no autenticado, redirigiendo al login');
      navigate('/login');
      return;
    }

    // Si está autenticado, cargar datos
    if (isAuthenticated && token) {
      // Solo fetch cart items si el carrito está vacío
      if (cartItems.length === 0) {
        dispatch(fetchCartItems());
      }
      // Resetear estado del checkout al montar
      dispatch(resetCheckout());
    }
  }, [dispatch, isAuthenticated, token, userId, navigate]);

  // Verificar si el carrito está vacío y redirigir
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0 && isAuthenticated) {
      console.log('Carrito vacío, redirigiendo a /cart');
      navigate('/cart');
    }
  }, [cartItems, cartLoading, isAuthenticated, navigate]);

  // Debug info
  useEffect(() => {
    console.log('Checkout State:', {
      isAuthenticated,
      token: !!token,
      userId,
      cartItems: cartItems.length,
      cartLoading
    });
  }, [isAuthenticated, token, userId, cartItems, cartLoading]);

  // Calcular totales usando Redux
  const subtotal = cartTotal;
  const tax = subtotal * 0.1; // 10% de impuestos
  const total = subtotal + tax;

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Formatear número de tarjeta
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Formatear fecha de expiración
  const formatExpiryDate = (value) => {
    // Solo permitir números
    const v = value.replace(/[^0-9]/g, '');
    
    // Formatear como MM/YY
    if (v.length >= 2) {
      const month = v.substring(0, 2);
      const year = v.substring(2, 4);
      return year ? `${month}/${year}` : month;
    }
    
    return v;
  };

  // Manejar cambios especiales para tarjeta
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').slice(0, 4);
    }

    setPaymentData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  // Validar formulario
  const validateForm = () => {
    const { cardNumber, expiryDate, cvv, cardHolder, email } = paymentData;
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      setError('Please enter a valid card number');
      return false;
    }
    
    if (!expiryDate || expiryDate.length < 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }

    // Validar que el mes esté entre 01-12
    const [month, year] = expiryDate.split('/');
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      setError('Please enter a valid month (01-12)');
      return false;
    }
    
    if (!cvv || cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    
    if (!cardHolder.trim()) {
      setError('Please enter the cardholder name');
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Procesar compra usando Redux
  const handlePurchase = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setError(null);

    try {
      // Usar el thunk de Redux para procesar el pago y transferir jugadores
      const result = await dispatch(processPayment({
        cartItems,
        cardData: paymentData
      })).unwrap();

      console.log('Payment and transfer successful:', result);

      // Limpiar carrito después del pago exitoso
      await dispatch(clearCart(userId)).unwrap();

      // Redirigir a una página de confirmación o dashboard
      navigate('/dashboard', { 
        state: { 
          successMessage: `Purchase completed! Transaction ID: ${result.transactionId}. You have successfully acquired ${cartItems.length} player(s) for $${cartTotal.toLocaleString()}. Check your team roster!` 
        }
      });

    } catch (error) {
      console.error('Error processing purchase:', error);
      const errorMessage = typeof error === 'string' ? error : error.message || 'Unknown error occurred';
      setError(`Error processing purchase: ${errorMessage}`);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="checkout-container">
        <div className="checkout-content">
          <h2>No items to checkout</h2>
          <button onClick={() => navigate('/players')} className="btn-primary">
            Browse Players
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <button onClick={() => navigate('/cart')} className="back-btn">
            ← Back to Cart
          </button>
        </div>

        <div className="checkout-body">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cartItems.map((player) => (
                <div key={player.id} className="order-item">
                  <img 
                    src={player.image || '/images/default-player.png'} 
                    alt={player.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <h3>{player.name}</h3>
                    <p>{player.position} • Rating: {player.rating}</p>
                  </div>
                  <div className="order-item-price">
                    ${player.price?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="total-line">
                <span>Tax (10%):</span>
                <span>${tax.toLocaleString()}</span>
              </div>
              <div className="total-line total-final">
                <span>Total:</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-form">
            <h2>Payment Information</h2>
            
            {(error || checkoutError) && (
              <div className="error-message">
                {error || checkoutError}
              </div>
            )}

            <form onSubmit={handlePurchase}>
              <div className="form-section">
                <h3>Card Details</h3>
                
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleCardInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={paymentData.cardHolder}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Billing Information</h3>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={paymentData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={paymentData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={paymentData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={paymentData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  disabled={checkoutProcessing}
                  className="btn-purchase"
                >
                  {checkoutProcessing ? 'Processing...' : `Complete Purchase - $${total.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
