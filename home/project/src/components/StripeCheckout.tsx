import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Zap, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Use test publishable key
const stripePromise = loadStripe('pk_test_51R6AyaBAqFoqhfU3cSPhAd1pgTzsuu2m2hUjrCk4XrdjOSX4DUqkEiLMNuldAZgiGgckFe57F3AVru1HuOqBebDh00JL6Ccfnz');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription-success`,
          payment_method_data: {
            billing_details: {
              address: {
                country: 'US',
              },
            },
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || 'An error occurred');
        setLoading(false);
      }
    } catch (e) {
      setErrorMessage('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleManageSubscription = () => {
    window.open('https://billing.stripe.com/p/login/test_aEU5kO8wb2Zj1Gg288', '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI Maintenance Plan
        </h2>
        
        <div className="mb-8">
          <p className="text-blue-300 mb-2">Monthly subscription</p>
          <p className="text-4xl font-bold text-white">$194/month</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-300">
            <Zap className="w-5 h-5 text-blue-400" />
            <span>24/7 AI System Monitoring</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Shield className="w-5 h-5 text-purple-400" />
            <span>Automated Security Updates</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Clock className="w-5 h-5 text-pink-400" />
            <span>Real-time Performance Optimization</span>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl mb-6">
          <PaymentElement />
        </div>

        {errorMessage && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
        >
          {loading ? 'Processing...' : 'Subscribe Now'}
        </button>

        <button
          type="button"
          onClick={handleManageSubscription}
          className="w-full mt-4 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
        >
          Manage Subscription
        </button>
      </div>
    </form>
  );
};

const StripeCheckout = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching payment intent:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    };

    fetchPaymentIntent();
  }, []);

  const options = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#3b82f6',
        colorBackground: '#111827',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
        spacingUnit: '6px',
        borderRadius: '8px',
      },
    },
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-500 text-red-200 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading payment form...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-500/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500/20 blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center">
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;