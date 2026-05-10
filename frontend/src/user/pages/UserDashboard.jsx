import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import UserBookings from '../components/UserBookings';
import UserProfile from '../components/UserProfile';

const UserDashboard = () => {
  const [tab, setTab] = useState('bookings');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-500/30 flex-shrink-0">
              {user.profilePicture || user.picture ? (
                <img
                  src={user.profilePicture || user.picture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-yellow-500/10 flex items-center justify-center">
                  <i className="fas fa-user text-yellow-500"></i>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome, {user.name?.split(' ')[0]}!</h1>
              <p className="text-white text-sm">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-400 font-medium text-sm transition-colors"
          >
            <i className="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('bookings')}
            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
              tab === 'bookings'
                ? 'bg-yellow-500 text-white'
                : 'bg-black border border-yellow-500/20 text-white hover:bg-yellow-500/10'
            }`}
          >
            <i className="fas fa-calendar-check mr-2"></i>My Bookings
          </button>
          <button
            onClick={() => setTab('profile')}
            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
              tab === 'profile'
                ? 'bg-yellow-500 text-white'
                : 'bg-black border border-yellow-500/20 text-white hover:bg-yellow-500/10'
            }`}
          >
            <i className="fas fa-user-edit mr-2"></i>My Profile
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {tab === 'bookings' && <UserBookings />}
          {tab === 'profile' && <UserProfile />}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
