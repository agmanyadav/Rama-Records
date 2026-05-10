import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { invalidateSongs } from '../../store/songsSlice';
import { invalidateGallery } from '../../store/gallerySlice';
import { logout as logoutAction } from '../../store/authSlice';
import { 
    fetchBookings, fetchContacts, fetchSongs, fetchGallery, fetchReleases,
    updateBookingStatus, deleteBooking, deleteSong, deleteGallery, deleteRelease,
    createSong, createGallery, createRelease, uploadFiles, getStaticUrl,
    updateSong, updateGallery, updateRelease, deleteContact
} from '../../api/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [songs, setSongs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [releases, setReleases] = useState([]);
  
  // Modal States
  const [uploading, setUploading] = useState(false);
  const [showSongModal, setShowSongModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form States
  const [newSong, setNewSong] = useState({ title: '', artists: '', album: 'Rama Records', duration: '', featured: false, dsps: { spotify: '', apple: '', youtube: '' } });
  const [songFiles, setSongFiles] = useState({ audio: null, cover: null });

  const [newGallery, setNewGallery] = useState({ featured: false });
  const [galleryFile, setGalleryFile] = useState(null);

  const [newRelease, setNewRelease] = useState({ youtubeUrl: '', title: '' });
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/admin');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        fetchBookings(), fetchContacts(), fetchSongs(), fetchGallery(), fetchReleases()
      ]);
      if (results[0].status === 'fulfilled') setBookings(results[0].value.data);
      if (results[1].status === 'fulfilled') setContacts(results[1].value.data);
      if (results[2].status === 'fulfilled') setSongs(results[2].value.data);
      if (results[3].status === 'fulfilled') setGallery(results[3].value.data);
      if (results[4].status === 'fulfilled') setReleases(results[4].value.data);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try { await updateBookingStatus(id, status); loadData(); } catch (err) { alert('Failed to update status'); }
  };

  const handleReviewBooking = (booking) => {
    setSelectedBooking({ ...booking, newReply: booking.adminReply || '' });
    setShowBookingModal(true);
  };

  const handleBookingUpdate = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      await updateBookingStatus(selectedBooking._id, selectedBooking.status, selectedBooking.newReply);
      setShowBookingModal(false);
      loadData();
    } catch (err) {
      alert('Failed to update booking');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Delete this booking?')) {
      try { await deleteBooking(id); loadData(); } catch (err) { alert('Failed to delete booking'); }
    }
  };

  const handleDeleteItem = async (id, type) => {
    if (window.confirm(`Delete this ${type}?`)) {
      try {
        if (type === 'song') await deleteSong(id);
        if (type === 'gallery') await deleteGallery(id);
        if (type === 'release') await deleteRelease(id);
        if (type === 'contact') await deleteContact(id);
        if (type === 'song') dispatch(invalidateSongs());
        if (type === 'gallery') dispatch(invalidateGallery());
        loadData();
      } catch (err) {
        alert(`Failed to delete ${type}`);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/admin');
  };

  const handleEditClick = (item, type) => {
    setEditingId(item._id);
    if (type === 'song') {
      setNewSong({ title: item.title, artists: item.artists, album: item.album, duration: item.duration, featured: item.featured, dsps: item.dsps || { spotify: '', apple: '', youtube: '' } });
      setShowSongModal(true);
    } else if (type === 'gallery') {
      setNewGallery({ featured: item.featured });
      setShowGalleryModal(true);
    } else if (type === 'release') {
      setNewRelease({ youtubeUrl: item.youtubeUrl, title: item.title });
      setShowReleaseModal(true);
    }
  };

  const handleAddSongSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && (!songFiles.audio || !songFiles.cover)) return alert("Select both .wav and cover image.");
    try {
        setUploading(true);
        let payload = { ...newSong };
        if (!editingId) {
            const formData = new FormData();
            formData.append('audio', songFiles.audio);
            formData.append('cover', songFiles.cover);
            const uploadRes = await uploadFiles(formData);
            payload.audioFile = uploadRes.data.files.audioPath;
            payload.coverImage = uploadRes.data.files.coverPath;
            await createSong(payload);
        } else {
            await updateSong(editingId, payload);
        }
        setShowSongModal(false); setEditingId(null); setNewSong({ title: '', artists: '', album: 'Rama Records', duration: '', featured: false, dsps: { spotify: '', apple: '', youtube: '' } }); dispatch(invalidateSongs()); loadData();
    } catch (err) { 
        console.error('Song save error:', err);
        alert(`Failed to save song: ${err.response?.data?.message || err.message}`); 
    } finally { setUploading(false); }
  };

  const handleAddGallerySubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !galleryFile) return alert("Select an image.");
    try {
        setUploading(true);
        let payload = { ...newGallery };
        if (!editingId) {
            const formData = new FormData();
            formData.append('galleryImage', galleryFile);
            const uploadRes = await uploadFiles(formData);
            payload.imagePath = uploadRes.data.files.galleryImagePath;
            await createGallery(payload);
        } else {
            await updateGallery(editingId, payload);
        }
        setShowGalleryModal(false); setEditingId(null); setNewGallery({ featured: false }); dispatch(invalidateGallery()); loadData();
    } catch (err) { 
        console.error('Gallery save error:', err);
        alert(`Failed to save gallery item: ${err.response?.data?.message || err.message}`); 
    } finally { setUploading(false); }
  };

  const handleAddReleaseSubmit = async (e) => {
    e.preventDefault();
    if (!newRelease.youtubeUrl) return alert("Enter YouTube URL.");
    try {
        setUploading(true);
        if (editingId) {
            await updateRelease(editingId, newRelease);
        } else {
            await createRelease(newRelease);
        }
        setShowReleaseModal(false); setEditingId(null); setNewRelease({ youtubeUrl: '', title: '' }); loadData();
    } catch (err) { 
      console.error('Release save error:', err.response?.data || err.message);
      alert('Failed to save release: ' + (err.response?.data?.message || err.message)); 
    } finally { setUploading(false); }
  };

  const statusColors = { pending: 'bg-green-100 text-green-800', confirmed: 'bg-green-100 text-green-800', completed: 'bg-blue-100 text-blue-800', cancelled: 'bg-red-100 text-red-800' };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium">
            <i className="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['bookings', 'contacts', 'songs', 'gallery', 'releases'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-full font-medium transition-all capitalize ${
                tab === t ? 'bg-yellow-500 text-white' : 'bg-black text-white hover:bg-black'
              }`}
            >
              {t} 
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-white">
            <i className="fas fa-spinner fa-spin text-3xl mb-3 block text-yellow-500"></i><span className="text-white font-medium">Loading...</span>
          </div>
        ) : (
          <>
            {tab === 'bookings' && (
              <div className="bg-black rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black border-b">
                    <tr><th className="text-left p-4 font-semibold text-white">Name</th><th className="text-left p-4 font-semibold text-white">Email</th><th className="text-left p-4 font-semibold text-white">Phone</th><th className="text-left p-4 font-semibold text-white">Service</th><th className="text-left p-4 font-semibold text-white">Status</th><th className="text-left p-4 font-semibold text-white">Actions</th></tr>
                  </thead>
                  <tbody className="text-white">
                    {bookings.map((b) => (
                      <tr key={b._id} className="border-b hover:bg-black">
                        <td className="p-4">{b.name}</td><td className="p-4">{b.email}</td><td className="p-4">{b.phone || 'N/A'}</td><td className="p-4">{b.serviceType}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>{b.status}</span></td>
                        <td className="p-4 flex items-center gap-3">
                          <button onClick={() => handleReviewBooking(b)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-bold transition-colors">Review</button>
                          <select value={b.status} onChange={(e) => handleStatusChange(b._id, e.target.value)} className="border rounded px-2 py-1 outline-none text-white bg-black"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
                          <button onClick={() => handleDeleteBooking(b._id)} className="text-red-500 hover:text-red-700" title="Delete Booking"><i className="fas fa-trash"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'contacts' && (
              <div className="space-y-4">
                {contacts.map((c) => (
                  <div key={c._id} className="bg-black rounded-xl p-6 shadow-sm relative group">
                    <div className="flex justify-between"><h4 className="font-semibold text-white">{c.name}</h4><span className="text-xs text-white font-medium">{new Date(c.createdAt).toLocaleDateString()}</span></div>
                    <p className="text-sm text-blue-600 mb-2 font-medium">{c.email}</p><p className="text-white">{c.message}</p>
                    <button onClick={() => handleDeleteItem(c._id, 'contact')} className="absolute top-4 right-4 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Contact"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'songs' && (
              <div>
                <div className="mb-4 flex justify-end"><button onClick={() => { setEditingId(null); setNewSong({ title: '', artists: '', album: 'Rama Records', duration: '', featured: false, dsps: { spotify: '', apple: '', youtube: '' } }); setShowSongModal(true); }} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded shadow-sm"><i className="fas fa-plus mr-2"></i> Add New Song</button></div>
                <div className="bg-black rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                    <thead className="bg-black border-b"><tr><th className="p-4 text-left font-semibold text-white">Title</th><th className="p-4 text-left font-semibold text-white">Artists</th><th className="p-4 text-left font-semibold text-white">Featured</th><th className="p-4 text-left font-semibold text-white">Actions</th></tr></thead>
                    <tbody className="text-white">
                        {songs.map((s) => (
                        <tr key={s._id} className="border-b"><td className="p-4 font-medium">{s.title}</td><td className="p-4">{s.artists}</td><td className="p-4">{s.featured ? '✅ Yes' : '⬜ No'}</td><td className="p-4 flex gap-3"><button onClick={() => handleEditClick(s, 'song')} className="text-blue-500 hover:text-blue-700"><i className="fas fa-edit"></i></button><button onClick={() => handleDeleteItem(s._id, 'song')} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button></td></tr>
                        ))}
                    </tbody></table>
                </div>
              </div>
            )}


            {tab === 'gallery' && (
              <div>
                <div className="mb-4 flex justify-end"><button onClick={() => { setEditingId(null); setNewGallery({ featured: false }); setShowGalleryModal(true); }} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded shadow-sm"><i className="fas fa-plus mr-2"></i> Upload Image</button></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {gallery.map(g => (
                       <div key={g._id} className="bg-black p-2 rounded shadow-sm relative group">
                           <img src={getStaticUrl(g.imagePath)} alt="Gallery image" className="w-full h-32 object-cover rounded" />
                           <div className="mt-2 text-sm text-white font-medium truncate">{g.featured && <span className="text-yellow-600">(Featured)</span>}</div>
                           <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => handleEditClick(g, 'gallery')} className="bg-blue-500 text-white w-8 h-8 rounded-full shadow-md hover:bg-blue-600"><i className="fas fa-edit"></i></button>
                               <button onClick={() => handleDeleteItem(g._id, 'gallery')} className="bg-red-500 text-white w-8 h-8 rounded-full shadow-md hover:bg-red-600"><i className="fas fa-trash"></i></button>
                           </div>
                       </div>
                   ))}
                </div>
              </div>
            )}

            {tab === 'releases' && (
              <div>
                <div className="mb-4 flex justify-end"><button onClick={() => { setEditingId(null); setNewRelease({ youtubeUrl: '', title: '' }); setShowReleaseModal(true); }} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded shadow-sm"><i className="fas fa-plus mr-2"></i> Add New Release</button></div>
                <div className="bg-black rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                    <thead className="bg-black border-b"><tr><th className="p-4 text-left font-semibold text-white">Title</th><th className="p-4 text-left font-semibold text-white">YouTube URL</th><th className="p-4 text-left font-semibold text-white">Added On</th><th className="p-4 text-left font-semibold text-white">Actions</th></tr></thead>
                    <tbody className="text-white">
                        {releases.map((r) => (
                        <tr key={r._id} className="border-b"><td className="p-4 text-white">{r.title || <span className="text-white/40 italic">No title</span>}</td><td className="p-4 font-medium text-blue-600"><a href={r.youtubeUrl} target="_blank" rel="noreferrer">{r.youtubeUrl}</a></td><td className="p-4">{new Date(r.createdAt).toLocaleDateString()}</td><td className="p-4 flex gap-3"><button onClick={() => handleEditClick(r, 'release')} className="text-blue-500 hover:text-blue-700"><i className="fas fa-edit"></i></button><button onClick={() => handleDeleteItem(r._id, 'release')} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button></td></tr>
                        ))}
                    </tbody></table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      {showBookingModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[60] p-4 text-white">
              <div className="bg-black rounded-xl w-full max-w-2xl p-6 relative shadow-lg border border-yellow-500/20">
                 <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-white hover:text-white"><i className="fas fa-times"></i></button>
                 <h2 className="text-2xl font-bold mb-4 text-white">Review Booking Request</h2>
                 
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 p-3 rounded">
                        <p className="text-xs text-yellow-500 uppercase tracking-wider mb-1">Client</p>
                        <p className="font-semibold">{selectedBooking.name}</p>
                        <p className="text-sm text-gray-300">{selectedBooking.email}</p>
                        <p className="text-sm text-gray-300">{selectedBooking.phone || 'No phone provided'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded">
                        <p className="text-xs text-yellow-500 uppercase tracking-wider mb-1">Service & Date</p>
                        <p className="font-semibold">{selectedBooking.serviceType}</p>
                        <p className="text-sm text-gray-300">{selectedBooking.preferredDate ? new Date(selectedBooking.preferredDate).toLocaleDateString() : 'No date specified'}</p>
                    </div>
                 </div>

                 <div className="bg-white/5 p-3 rounded mb-6">
                     <p className="text-xs text-yellow-500 uppercase tracking-wider mb-1">Client Message</p>
                     <p className="text-gray-300 whitespace-pre-wrap">{selectedBooking.message || <span className="italic text-gray-500">No message provided</span>}</p>
                 </div>

                 <form onSubmit={handleBookingUpdate} className="space-y-4">
                     <div>
                         <label className="text-xs text-yellow-500 uppercase tracking-wider mb-2 block">Admin Reply (Sent to client dashboard)</label>
                         <textarea 
                             rows="4" 
                             placeholder="Write a message back to the client..."
                             value={selectedBooking.newReply} 
                             onChange={e => setSelectedBooking({...selectedBooking, newReply: e.target.value})} 
                             className="w-full border rounded p-3 text-black bg-white placeholder-gray-500" 
                         />
                     </div>
                     <div className="flex gap-4 items-center">
                         <div className="w-1/2">
                             <label className="text-xs text-yellow-500 uppercase tracking-wider mb-2 block">Status</label>
                             <select value={selectedBooking.status} onChange={e => setSelectedBooking({...selectedBooking, status: e.target.value})} className="w-full border rounded p-2 text-black bg-white">
                                 <option value="pending">Pending</option>
                                 <option value="confirmed">Confirmed</option>
                                 <option value="completed">Completed</option>
                                 <option value="cancelled">Cancelled</option>
                             </select>
                         </div>
                         <div className="w-1/2 flex items-end pt-6">
                             <button type="submit" disabled={uploading} className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition-colors">
                                 {uploading ? 'Updating...' : 'Save Updates'}
                             </button>
                         </div>
                     </div>
                 </form>
              </div>
          </div>
      )}

      {showSongModal && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[60] p-4 text-white">
              <div className="bg-black rounded-xl w-full max-w-lg p-6 relative">
                 <button onClick={() => setShowSongModal(false)} className="absolute top-4 right-4 text-white hover:text-white"><i className="fas fa-times"></i></button>
                 <h2 className="text-2xl font-bold mb-4 text-white">{editingId ? 'Edit Song' : 'Add Song'}</h2>
                 <form onSubmit={handleAddSongSubmit} className="space-y-3 pb-8 max-h-[70vh] overflow-y-auto px-1">
                     <input type="text" placeholder="Title" required value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} className="w-full border rounded p-2 text-black bg-white placeholder-gray-500" />
                     <input type="text" placeholder="Artists" required value={newSong.artists} onChange={e => setNewSong({...newSong, artists: e.target.value})} className="w-full border rounded p-2 text-black bg-white placeholder-gray-500" />
                     <div className="flex gap-2"><input type="text" placeholder="Album" required value={newSong.album} onChange={e => setNewSong({...newSong, album: e.target.value})} className="w-1/2 border rounded p-2 text-black bg-white placeholder-gray-500" /><input type="text" placeholder="Duration (3:45)" required value={newSong.duration} onChange={e => setNewSong({...newSong, duration: e.target.value})} className="w-1/2 border rounded p-2 text-black bg-white placeholder-gray-500" /></div>
                     <div className="bg-black p-3 rounded text-sm mb-2">
                         <label className="block text-white font-bold mb-2">DSP Links (Optional)</label>
                         <div className="space-y-2">
                             <input type="url" placeholder="Spotify URL" value={newSong.dsps.spotify} onChange={e => setNewSong({...newSong, dsps: {...newSong.dsps, spotify: e.target.value}})} className="w-full border rounded p-2 text-black bg-white placeholder-gray-500" />
                             <input type="url" placeholder="Apple Music URL" value={newSong.dsps.apple} onChange={e => setNewSong({...newSong, dsps: {...newSong.dsps, apple: e.target.value}})} className="w-full border rounded p-2 text-black bg-white placeholder-gray-500" />
                             <input type="url" placeholder="YouTube URL" value={newSong.dsps.youtube} onChange={e => setNewSong({...newSong, dsps: {...newSong.dsps, youtube: e.target.value}})} className="w-full border rounded p-2 text-black bg-white placeholder-gray-500" />
                         </div>
                     </div>
                     {!editingId && (
                       <>
                         <div className="bg-black p-3 rounded text-sm text-white font-medium">Upload Cover <input type="file" required onChange={e => setSongFiles({...songFiles, cover: e.target.files[0]})} className="text-white" /></div>
                         <div className="bg-black p-3 rounded text-sm text-white font-medium">Upload Audio (.wav) <input type="file" required onChange={e => setSongFiles({...songFiles, audio: e.target.files[0]})} className="text-white" /></div>
                       </>
                     )}
                     <div><label className="text-sm text-white font-medium"><input type="checkbox" checked={newSong.featured} onChange={e => setNewSong({...newSong, featured: e.target.checked})} className="mr-1" /> Featured?</label></div>
                     <button type="submit" disabled={uploading} className="w-full bg-yellow-500 text-white font-bold py-2 rounded hover:bg-yellow-600 transition-colors">{uploading ? 'Wait...' : (editingId ? 'Update' : 'Save')}</button>
                 </form>
              </div>
          </div>
      )}

      {showGalleryModal && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[60] p-4 text-white">
              <div className="bg-black rounded-xl w-full max-w-lg p-6 relative">
                 <button onClick={() => setShowGalleryModal(false)} className="absolute top-4 right-4 text-white hover:text-white"><i className="fas fa-times"></i></button>
                 <h2 className="text-2xl font-bold mb-4 text-white">{editingId ? 'Edit Gallery Image' : 'Add Gallery Image'}</h2>
                 <form onSubmit={handleAddGallerySubmit} className="space-y-3 pb-8 max-h-[70vh] overflow-y-auto px-1">
                     {!editingId && <div className="bg-black p-3 rounded text-sm text-white font-medium">Upload Image <input type="file" required onChange={e => setGalleryFile(e.target.files[0])} className="text-white" /></div>}
                     <div><label className="text-sm text-white font-medium"><input type="checkbox" checked={newGallery.featured} onChange={e => setNewGallery({...newGallery, featured: e.target.checked})} className="mr-1" /> Featured on Homepage?</label></div>
                     <button type="submit" disabled={uploading} className="w-full bg-yellow-500 text-white font-bold py-2 rounded hover:bg-yellow-600 transition-colors">{uploading ? 'Wait...' : (editingId ? 'Update' : 'Upload Image')}</button>
                 </form>
              </div>
          </div>
      )}

      {showReleaseModal && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[60] p-4 text-white">
              <div className="bg-black rounded-xl w-full max-w-lg p-6 relative">
                 <button onClick={() => setShowReleaseModal(false)} className="absolute top-4 right-4 text-white hover:text-white"><i className="fas fa-times"></i></button>
                 <h2 className="text-2xl font-bold mb-4 text-white">{editingId ? 'Edit Release' : 'Add Release'}</h2>
                 <form onSubmit={handleAddReleaseSubmit} className="space-y-3 pb-8 max-h-[70vh] overflow-y-auto px-1">
                     <input type="text" placeholder="Video Title / Search Name" value={newRelease.title} onChange={e => setNewRelease({...newRelease, title: e.target.value})} className="w-full border rounded p-2 text-black bg-white placeholder-gray-500" />
                     <input type="url" placeholder="YouTube Video URL" required value={newRelease.youtubeUrl} onChange={e => setNewRelease({...newRelease, youtubeUrl: e.target.value})} className="w-full border rounded p-2 text-black bg-white placeholder-gray-500" />
                     <button type="submit" disabled={uploading} className="w-full bg-yellow-500 text-white font-bold py-2 rounded hover:bg-yellow-600 transition-colors">{uploading ? 'Wait...' : (editingId ? 'Update' : 'Add Release')}</button>
                 </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
