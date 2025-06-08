import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { AlertCircle } from 'lucide-react';
import zxcvbn from 'zxcvbn';

const Register = () => {
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
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
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

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
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
    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
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
    console.group('🔄 Registration Process Started');
    console.log('📝 Form data:', {
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
      passwordLength: formData.password.length
    });
    setError('');

    if (!validateForm()) {
      console.log('❌ Form validation failed');
      console.groupEnd();
      return;
    }

    setIsLoading(true);
    try {
      console.log('🚀 Starting Supabase signup...');
      
      // Step 1: Sign up with Supabase Auth
      const signUpOptions = {
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username.toLowerCase()
          }
        }
      };
      
      console.log('📤 Signup options:', {
        email: signUpOptions.email,
        passwordLength: signUpOptions.password.length,
        userData: signUpOptions.options.data
      });

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp(signUpOptions);

      console.log('📥 Signup response received');
      console.log('✅ Signup data:', {
        user: signUpData?.user ? {
          id: signUpData.user.id,
          email: signUpData.user.email,
          email_confirmed_at: signUpData.user.email_confirmed_at,
          created_at: signUpData.user.created_at,
          user_metadata: signUpData.user.user_metadata
        } : null,
        session: signUpData?.session ? {
          access_token: signUpData.session.access_token ? 'present' : 'missing',
          refresh_token: signUpData.session.refresh_token ? 'present' : 'missing',
          expires_at: signUpData.session.expires_at,
          token_type: signUpData.session.token_type,
          user: signUpData.session.user ? {
            id: signUpData.session.user.id,
            email: signUpData.session.user.email
          } : null
        } : null
      });
      
      if (signUpError) {
        console.error('❌ Signup error:', {
          message: signUpError.message,
          status: signUpError.status,
          details: signUpError
        });
        
        // Handle specific error cases
        if (signUpError.message === 'User already registered' || signUpError.message.includes('already registered')) {
          setError('An account with this email already exists. Please log in instead or use a different email address.');
          return;
        }
        
        throw signUpError;
      }

      if (!signUpData.session || !signUpData.user) {
        console.error('❌ Missing session or user data:', {
          hasSession: !!signUpData.session,
          hasUser: !!signUpData.user,
          signUpData
        });
        throw new Error('No session or user data returned from signup');
      }

      console.log('✅ Signup successful, user created:', signUpData.user.id);

      // Step 2: Create user profile
      console.log('👤 Creating user profile...');
      const profileData = {
        id: signUpData.user.id,
        username: formData.username.toLowerCase(),
        full_name: formData.fullName
      };
      
      console.log('📤 Profile data:', profileData);
      
      const { data: profileResult, error: profileError } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select();

      console.log('📥 Profile creation response:', {
        data: profileResult,
        error: profileError
      });

      if (profileError) {
        console.error('❌ Profile creation error:', {
          message: profileError.message,
          details: profileError,
          hint: profileError.hint,
          code: profileError.code
        });
        throw new Error(`Failed to create user profile: ${profileError.message}`);
      }

      console.log('✅ Profile created successfully:', profileResult);

      // Step 3: Test user retrieval before login
      console.log('🔍 Testing user retrieval with session token...');
      try {
        const { data: testUser, error: testUserError } = await supabase.auth.getUser(signUpData.session.access_token);
        console.log('📥 Test user retrieval result:', {
          user: testUser?.user ? {
            id: testUser.user.id,
            email: testUser.user.email,
            email_confirmed_at: testUser.user.email_confirmed_at
          } : null,
          error: testUserError
        });
        
        if (testUserError) {
          console.error('❌ Test user retrieval failed:', testUserError);
        }
      } catch (testError) {
        console.error('❌ Test user retrieval exception:', testError);
      }

      // Step 4: Send webhook notification with timeout (non-blocking)
      try {
        console.log('📡 Sending webhook notification...');
        const webhookData = {
          type: 'user_registration',
          user_id: signUpData.user.id,
          email: signUpData.user.email,
          username: formData.username,
          full_name: formData.fullName,
          created_at: new Date().toISOString()
        };
        
        console.log('📤 Webhook data:', webhookData);
        
        const webhookResponse = await fetchWithTimeout('https://hook.eu2.make.com/u27fgk5xn2c7gsuvmznahb9bexwph2w1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        }, 5000); // 5 second timeout

        console.log('📥 Webhook response:', {
          ok: webhookResponse.ok,
          status: webhookResponse.status,
          statusText: webhookResponse.statusText
        });

        if (webhookResponse.ok) {
          console.log('✅ Webhook notification sent successfully');
        } else {
          console.warn('⚠️ Webhook notification failed with status:', webhookResponse.status);
        }
      } catch (webhookError) {
        console.warn('⚠️ Webhook notification error (continuing with registration):', webhookError);
        // Don't throw here - continue with signup process even if webhook fails
      }

      // Step 5: Log the user in
      console.log('🔐 Logging in user with session token...');
      console.log('📤 Login token info:', {
        tokenPresent: !!signUpData.session.access_token,
        tokenLength: signUpData.session.access_token?.length,
        tokenStart: signUpData.session.access_token?.substring(0, 20) + '...'
      });
      
      await login(signUpData.session.access_token);
      
      // Step 6: Navigate to dashboard
      console.log('🎯 Redirecting to dashboard...');
      navigate('/app/dashboard', { replace: true });
      console.log('✅ Registration process completed successfully');

    } catch (error: any) {
      console.error('💥 Registration process failed:', {
        message: error.message,
        stack: error.stack,
        error
      });
      
      if (error.message.includes('User already registered')) {
        setError('An account with this email already exists. Please try logging in.');
      } else {
        setError(error.message || 'An error occurred during registration');
      }
      
      // Log signup attempt
      try {
        console.log('📝 Logging failed signup attempt...');
        await supabase
          .from('signup_logs')
          .insert([{
            email: formData.email,
            username: formData.username,
            success: false,
            error_message: error.message
          }]);
        console.log('✅ Failed signup logged');
      } catch (logError) {
        console.error('❌ Failed to log signup attempt:', logError);
      }
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    if (name === 'password') {
      const result = zxcvbn(value);
      setPasswordStrength({
        score: result.score,
        feedback: result.feedback.warning || result.feedback.suggestions[0] || '',
        matches: value === formData.confirmPassword
      });
    }
    
    if (name === 'confirmPassword') {
      setPasswordStrength(prev => ({
        ...prev,
        matches: value === formData.password
      }));
    }

    setError('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Create Your Account</h1>
              <p className="text-gray-300">Join Second Brain AI today</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl">
              {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{error}</p>
                    {error.includes('already exists') && (
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="mt-2 text-blue-400 hover:text-blue-300 underline text-sm"
                      >
                        Go to login page
                      </button>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    disabled={isLoading}
                    minLength={3}
                  />
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
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-2">
                        {[0, 1, 2, 3, 4].map((score) => (
                          <div
                            key={score}
                            className={`h-2 flex-1 rounded-full ${
                              score <= passwordStrength.score
                                ? [
                                    'bg-red-500',
                                    'bg-orange-500',
                                    'bg-yellow-500',
                                    'bg-green-500',
                                    'bg-green-500',
                                  ][passwordStrength.score]
                                : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                      {passwordStrength.feedback && (
                        <p className="text-sm text-gray-400">{passwordStrength.feedback}</p>
                      )}
                    </div>
                  )}
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
                    <div className="mt-2">
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

export default Register;