import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { AlertCircle,  Brain, Shield, Zap, Check, X } from 'lucide-react';

const BuildMyOwnAI = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasSpecial: false,
    matches: false
  });

  // Create a timeout wrapper for fetch requests
  const fetchWithTimeout = (url: string, options: RequestInit, timeout = 5000) => {
    return Promise.race([
      fetch(url, options),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  };

  const checkPasswordStrength = (password: string, confirmPassword: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      matches: password === confirmPassword
    });
  };

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('check_username_available', {
        username: username.toLowerCase()
      });

      if (error) throw error;
      setUsernameAvailable(data);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(null);
    }
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (!usernameAvailable) {
      setError('Username is not available');
      return false;
    }
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!passwordStrength.hasMinLength || !passwordStrength.hasNumber || !passwordStrength.hasSpecial) {
      setError('Password does not meet strength requirements');
      return false;
    }
    if (!passwordStrength.matches) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log('Starting signup process...');
      
      // Step 1: Sign up with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username.toLowerCase()
          }
        }
      });

      if (signUpError) throw signUpError;

      console.log('Signup successful, user created:', signUpData.user?.id);

      if (!signUpData.session || !signUpData.user) {
        throw new Error('No session or user data returned from signup');
      }

      // Step 2: Create user profile
      console.log('Creating user profile...');
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: signUpData.user.id,
            username: formData.username.toLowerCase(),
            full_name: formData.fullName
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create user profile');
      }

      console.log('Profile created successfully');

      // Step 3: Send webhook notification with timeout (non-blocking)
      try {
        console.log('Sending webhook notification...');
        const webhookResponse = await fetchWithTimeout('https://hook.eu2.make.com/u27fgk5xn2c7gsuvmznahb9bexwph2w1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'user_registration',
            user_id: signUpData.user.id,
            email: signUpData.user.email,
            username: formData.username,
            full_name: formData.fullName,
            created_at: new Date().toISOString()
          })
        }, 5000); // 5 second timeout

        if (webhookResponse.ok) {
          console.log('Webhook notification sent successfully');
        } else {
          console.warn('Webhook notification failed with status:', webhookResponse.status);
        }
      } catch (webhookError) {
        console.warn('Webhook notification error (continuing with registration):', webhookError);
        // Don't throw here - continue with signup process even if webhook fails
      }

      // Step 4: Log the user in
      console.log('Logging in user...');
      await login(signUpData.session.access_token);
      
      // Step 5: Navigate to dashboard
      console.log('Redirecting to dashboard...');
      navigate('/app/dashboard', { replace: true });

    } catch (error: any) {
      console.error('Signup process failed:', error);
      
      if (error.message.includes('User already registered')) {
        setError('An account with this email already exists. Please try logging in.');
      } else {
        setError(error.message || 'An error occurred during registration');
      }
      
      // Log signup attempt
      try {
        await supabase
          .from('signup_logs')
          .insert([{
            email: formData.email,
            username: formData.username,
            success: false,
            error_message: error.message
          }]);
      } catch (logError) {
        console.error('Failed to log signup attempt:', logError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (name === 'username') {
      checkUsernameAvailability(value);
    }
    
    if (name === 'password' || name === 'confirmPassword') {
      checkPasswordStrength(
        name === 'password' ? value : formData.password,
        name === 'confirmPassword' ? value : formData.confirmPassword
      );
    }

    setError('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <img 
                  src="/images/second-brain-logo.png" 
                  alt="Second Brain AI Logo"
                  className="w-24 h-24 object-contain animate-pulse"
                />
              </div>
              <h1 className="text-4xl font-bold mb-4">Build Your Own AI</h1>
              <p className="text-xl text-gray-300">
                Create your personal AI companion for optimal decision making
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-r from-blue-500/10 to-transparent p-6 rounded-xl backdrop-blur-sm border border-blue-500/20">
                <Brain className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Personalized AI</h3>
                <p className="text-gray-400">Tailored to your unique goals and preferences</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500/10 to-transparent p-6 rounded-xl backdrop-blur-sm border border-purple-500/20">
                <Shield className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Secure & Private</h3>
                <p className="text-gray-400">Your data is encrypted and protected</p>
              </div>
              <div className="bg-gradient-to-r from-pink-500/10 to-transparent p-6 rounded-xl backdrop-blur-sm border border-pink-500/20">
                <Zap className="w-8 h-8 text-pink-400 mb-4" />
                <h3 className="text-lg font-semibold text-pink-400 mb-2">Instant Setup</h3>
                <p className="text-gray-400">Get started in minutes, not hours</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
              {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{error}</p>
                    <p className="text-sm mt-1 text-red-300">
                      Need help? <button onClick={() => navigate('/support')} className="text-blue-400 hover:text-blue-300 underline">Contact support</button>
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white pr-10"
                      required
                      disabled={isLoading}
                      minLength={3}
                    />
                    {formData.username.length >= 3 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameAvailable === true && <Check className="w-5 h-5 text-green-500" />}
                        {usernameAvailable === false && <X className="w-5 h-5 text-red-500" />}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    disabled={isLoading}
                  />
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full ${passwordStrength.hasMinLength ? 'bg-green-500' : 'bg-gray-600'}`} />
                      <span className={passwordStrength.hasMinLength ? 'text-green-500' : 'text-gray-400'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-gray-600'}`} />
                      <span className={passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-400'}>
                        Contains a number
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full ${passwordStrength.hasSpecial ? 'bg-green-500' : 'bg-gray-600'}`} />
                      <span className={passwordStrength.hasSpecial ? 'text-green-500' : 'text-gray-400'}>
                        Contains a special character
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    disabled={isLoading}
                  />
                  {formData.confirmPassword && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full ${passwordStrength.matches ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={passwordStrength.matches ? 'text-green-500' : 'text-red-500'}>
                        Passwords {passwordStrength.matches ? 'match' : 'do not match'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1"
                    disabled={isLoading}
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-300">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/terms')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/privacy')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Creating your account...' : 'Create Account'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Already have an account? Log in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BuildMyOwnAI;