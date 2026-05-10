import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile as updateProfileAPI } from '../../api/api';
import { updateProfile } from '../../store/authSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await updateProfileAPI(form);
      dispatch(updateProfile(data));
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-black border border-yellow-500/10 rounded-xl">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-500/30 flex-shrink-0">
          {user?.profilePicture || user?.picture ? (
            <img
              src={user.profilePicture || user.picture}
              alt={user.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-yellow-500/10 flex items-center justify-center">
              <i className="fas fa-user text-yellow-500 text-2xl"></i>
            </div>
          )}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">{user?.name}</h3>
          <p className="text-white text-sm">{user?.email}</p>
          {user?.bio && <p className="text-white text-xs mt-1">{user.bio}</p>}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4 text-center">
          <p className="text-green-400 text-sm"><i className="fas fa-check-circle mr-2"></i>{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-center">
          <p className="text-red-400 text-sm"><i className="fas fa-exclamation-triangle mr-2"></i>{error}</p>
        </div>
      )}

      {/* Profile Form */}
      {editing ? (
        <form onSubmit={handleSave} className="space-y-4 bg-black border border-yellow-500/10 rounded-xl p-6">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Display Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-yellow-500/20 rounded-lg p-3 bg-black text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Enter your phone number"
              className="w-full border border-yellow-500/20 rounded-lg p-3 bg-black text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-white/30"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full border border-yellow-500/20 rounded-lg p-3 bg-black text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-white/30 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-yellow-500 text-white font-bold py-2.5 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              {saving ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</>
              ) : (
                <><i className="fas fa-save mr-2"></i>Save Changes</>
              )}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setForm({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' }); }}
              className="px-6 py-2.5 border border-yellow-500/20 text-white rounded-lg hover:bg-yellow-500/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-black border border-yellow-500/10 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-white text-xs font-medium mb-1">Name</p>
              <p className="text-white">{user?.name || '—'}</p>
            </div>
            <div>
              <p className="text-white text-xs font-medium mb-1">Email</p>
              <p className="text-white">{user?.email || '—'}</p>
            </div>
            <div>
              <p className="text-white text-xs font-medium mb-1">Phone</p>
              <p className="text-white">{user?.phone || 'Not set'}</p>
            </div>
            <div>
              <p className="text-white text-xs font-medium mb-1">Member Since</p>
              <p className="text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}</p>
            </div>
          </div>
          {user?.bio && (
            <div>
              <p className="text-white text-xs font-medium mb-1">Bio</p>
              <p className="text-white text-sm">{user.bio}</p>
            </div>
          )}
          <button
            onClick={() => setEditing(true)}
            className="w-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-medium py-2.5 rounded-lg hover:bg-yellow-500/20 transition-colors"
          >
            <i className="fas fa-edit mr-2"></i>Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
