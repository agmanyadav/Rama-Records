import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../api/api';

const AdminLogin = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      const { data } = await googleLogin(credentialResponse.credential);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed. Make sure you are using the authorized admin account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was cancelled or failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-shield-alt text-yellow-500 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          <p className="text-gray-400 text-sm mt-1">Rama Records Dashboard</p>
        </div>

        <div className="space-y-6">
          {/* Google Sign-In */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              size="large"
              shape="pill"
              text="signin_with"
              width="320"
            />
          </div>

          {loading && (
            <div className="text-center text-yellow-500">
              <i className="fas fa-spinner fa-spin mr-2"></i>Authenticating...
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
              <p className="text-red-400 text-sm">
                <i className="fas fa-exclamation-triangle mr-2"></i>{error}
              </p>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-500 text-xs mt-4">
              <i className="fas fa-lock mr-1"></i>
              Only the authorized admin Google account can access this dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
