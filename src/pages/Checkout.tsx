// src/pages/Checkout.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get userId from localStorage
    const id = localStorage.getItem('newUserId');
    if (!id) {
      alert('No user ID found. Please register first.');
      navigate('/register');
      return;
    }
    setUserId(id);
  }, [navigate]);

  const handleCheckout = async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      const { url } = await res.json();
      window.location.href = url; // Redirect to Stripe
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-xl max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Almost there!</h1>
        <p className="mb-6 text-gray-600">
          Your account was created. To unlock full access, please complete your payment.
        </p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          {loading ? 'Redirecting...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
