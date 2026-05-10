import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../../api/api';
import { loginSuccess } from '../../store/authSlice';

const UserLogin = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      const { data } = await googleLogin(credentialResponse.credential);
      dispatch(loginSuccess(data));
      
      // Role-based redirect
      if (data.role === 'admin' || data.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was cancelled or failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-black rounded-2xl p-8 w-full max-w-md border border-yellow-500/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user text-yellow-500 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-white text-sm mt-1">Sign in to Rama Records</p>
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
              <i className="fas fa-spinner fa-spin mr-2"></i>Signing in...
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
            <p className="text-white text-xs mt-4">
              <i className="fas fa-music mr-1"></i>
              Sign in to view your session bookings and manage your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
