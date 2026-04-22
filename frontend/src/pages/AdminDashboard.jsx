import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    fetchBookings, fetchContacts, fetchSongs, fetchBeats, fetchGallery,
    updateBookingStatus, deleteBooking, deleteSong, deleteBeat, deleteGallery,
    createSong, createBeat, createGallery, uploadFiles, getStaticUrl 
} from '../api/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [songs, setSongs] = useState([]);
  const [beats, setBeats] = useState([]);
  const [gallery, setGallery] = useState([]);
  
  // Modal States
  const [uploading, setUploading] = useState(false);
  const [showSongModal, setShowSongModal] = useState(false);
  const [showBeatModal, setShowBeatModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Form States
  const [newSong, setNewSong] = useState({ title: '', artists: '', album: 'Rama Records', duration: '', featured: false, dsps: { spotify: '', apple: '', youtube: '' } });
  const [songFiles, setSongFiles] = useState({ audio: null, cover: null });

  const [newBeat, setNewBeat] = useState({ title: '', price: '', tags: '', featured: false });
  const [beatFiles, setBeatFiles] = useState({ audio: null, cover: null });

  const [newGallery, setNewGallery] = useState({ title: '', featured: false });
  const [galleryFile, setGalleryFile] = useState(null);
  
  const navigate = useNavigate();

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
        fetchBookings(), fetchContacts(), fetchSongs(), fetchBeats(), fetchGallery()
      ]);
      if (results[0].status === 'fulfilled') setBookings(results[0].value.data);
      if (results[1].status === 'fulfilled') setContacts(results[1].value.data);
      if (results[2].status === 'fulfilled') setSongs(results[2].value.data);
      if (results[3].status === 'fulfilled') setBeats(results[3].value.data);
      if (results[4].status === 'fulfilled') setGallery(results[4].value.data);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try { await updateBookingStatus(id, status); loadData(); } catch (err) { alert('Failed to update status'); }
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
        if (type === 'beat') await deleteBeat(id);
        if (type === 'gallery') await deleteGallery(id);
        loadData();
      } catch (err) {
        alert(`Failed to delete ${type}`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/admin');
  };

  const handleAddSongSubmit = async (e) => {
    e.preventDefault();
    if (!songFiles.audio || !songFiles.cover) return alert("Select both .wav and cover image.");
    try {
        setUploading(true);
        const formData = new FormData();
        formData.append('audio', songFiles.audio);
        formData.append('cover', songFiles.cover);
        const uploadRes = await uploadFiles(formData);
        await createSong({ ...newSong, audioFile: uploadRes.data.files.audioPath, coverImage: uploadRes.data.files.coverPath });
        setShowSongModal(false); loadData();
    } catch (err) { alert('Failed to save song.'); } finally { setUploading(false); }
  };

  const handleAddBeatSubmit = async (e) => {
    e.preventDefault();
    if (!beatFiles.audio || !beatFiles.cover) return alert("Select both .wav and cover image.");
    try {
        setUploading(true);
        const formData = new FormData();
        formData.append('beatAudio', beatFiles.audio);
        formData.append('beatCover', beatFiles.cover);
        const uploadRes = await uploadFiles(formData);
        await createBeat({ ...newBeat, audioFile: uploadRes.data.files.beatAudioPath, coverImage: uploadRes.data.files.beatCoverPath });
        setShowBeatModal(false); loadData();
    } catch (err) { alert('Failed to save beat.'); } finally { setUploading(false); }
  };

  const handleAddGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryFile) return alert("Select an image.");
    try {
        setUploading(true);
        const formData = new FormData();
        formData.append('galleryImage', galleryFile);
        const uploadRes = await uploadFiles(formData);
        await createGallery({ ...newGallery, imagePath: uploadRes.data.files.galleryImagePath });
        setShowGalleryModal(false); loadData();
    } catch (err) { alert('Failed to save gallery item.'); } finally { setUploading(false); }
  };

  const statusColors = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-green-100 text-green-800', completed: 'bg-blue-100 text-blue-800', cancelled: 'bg-red-100 text-red-800' };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium">
            <i className="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['bookings', 'contacts', 'songs', 'beats', 'gallery'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-full font-medium transition-all capitalize ${
                tab === t ? 'bg-yellow-500 text-gray-900' : 'bg-white text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t} 
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-600">
            <i className="fas fa-spinner fa-spin text-3xl mb-3 block text-yellow-500"></i><span className="text-gray-700 font-medium">Loading...</span>
          </div>
        ) : (
          <>
            {tab === 'bookings' && (
              <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr><th className="text-left p-4 font-semibold text-gray-700">Name</th><th className="text-left p-4 font-semibold text-gray-700">Email</th><th className="text-left p-4 font-semibold text-gray-700">Service</th><th className="text-left p-4 font-semibold text-gray-700">Status</th><th className="text-left p-4 font-semibold text-gray-700">Actions</th></tr>
                  </thead>
                  <tbody className="text-gray-800">
                    {bookings.map((b) => (
                      <tr key={b._id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{b.name}</td><td className="p-4">{b.email}</td><td className="p-4">{b.serviceType}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>{b.status}</span></td>
                        <td className="p-4 flex items-center gap-3">
                          <select value={b.status} onChange={(e) => handleStatusChange(b._id, e.target.value)} className="border rounded px-2 py-1 outline-none text-gray-800 bg-white"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
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
                  <div key={c._id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between"><h4 className="font-semibold text-gray-900">{c.name}</h4><span className="text-xs text-gray-500 font-medium">{new Date(c.createdAt).toLocaleDateString()}</span></div>
                    <p className="text-sm text-blue-600 mb-2 font-medium">{c.email}</p><p className="text-gray-800">{c.message}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === 'songs' && (
              <div>
                <div className="mb-4 flex justify-end"><button onClick={() => setShowSongModal(true)} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-4 py-2 rounded shadow-sm"><i className="fas fa-plus mr-2"></i> Add New Song</button></div>
                <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b"><tr><th className="p-4 text-left font-semibold text-gray-700">Title</th><th className="p-4 text-left font-semibold text-gray-700">Artists</th><th className="p-4 text-left font-semibold text-gray-700">Featured</th><th className="p-4 text-left font-semibold text-gray-700">Actions</th></tr></thead>
                    <tbody className="text-gray-800">
                        {songs.map((s) => (
                        <tr key={s._id} className="border-b"><td className="p-4 font-medium">{s.title}</td><td className="p-4">{s.artists}</td><td className="p-4">{s.featured ? '✅ Yes' : '⬜ No'}</td><td className="p-4"><button onClick={() => handleDeleteItem(s._id, 'song')} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button></td></tr>
                        ))}
                    </tbody></table>
                </div>
              </div>
            )}

            {tab === 'beats' && (
              <div>
                <div className="mb-4 flex justify-end"><button onClick={() => setShowBeatModal(true)} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-4 py-2 rounded shadow-sm"><i className="fas fa-plus mr-2"></i> Add New Beat</button></div>
                <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b"><tr><th className="p-4 text-left font-semibold text-gray-700">Title</th><th className="p-4 text-left font-semibold text-gray-700">Price</th><th className="p-4 text-left font-semibold text-gray-700">Featured</th><th className="p-4 text-left font-semibold text-gray-700">Actions</th></tr></thead>
                    <tbody className="text-gray-800">
                        {beats.map((b) => (
                        <tr key={b._id} className="border-b"><td className="p-4 font-medium">{b.title}</td><td className="p-4">{b.price || 'Contact'}</td><td className="p-4">{b.featured ? '✅' : '⬜'}</td><td className="p-4"><button onClick={() => handleDeleteItem(b._id, 'beat')} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button></td></tr>
                        ))}
                    </tbody></table>
                </div>
              </div>
            )}

            {tab === 'gallery' && (
              <div>
                <div className="mb-4 flex justify-end"><button onClick={() => setShowGalleryModal(true)} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-4 py-2 rounded shadow-sm"><i className="fas fa-plus mr-2"></i> Upload Image</button></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {gallery.map(g => (
                       <div key={g._id} className="bg-white p-2 rounded shadow-sm relative group">
                           <img src={getStaticUrl(g.imagePath)} className="w-full h-32 object-cover rounded" />
                           <div className="mt-2 text-sm text-gray-900 font-medium truncate">{g.title} {g.featured && <span className="text-yellow-600">(Featured)</span>}</div>
                           <button onClick={() => handleDeleteItem(g._id, 'gallery')} className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><i className="fas fa-trash"></i></button>
                       </div>
                   ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      {showSongModal && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[60] p-4 text-gray-900">
              <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
                 <button onClick={() => setShowSongModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><i className="fas fa-times"></i></button>
                 <h2 className="text-2xl font-bold mb-4 text-gray-900">Add Song</h2>
                 <form onSubmit={handleAddSongSubmit} className="space-y-3 pb-8 max-h-[70vh] overflow-y-auto px-1">
                     <input type="text" placeholder="Title" required value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} className="w-full border rounded p-2 text-gray-900 placeholder-gray-400" />
                     <input type="text" placeholder="Artists" required value={newSong.artists} onChange={e => setNewSong({...newSong, artists: e.target.value})} className="w-full border rounded p-2 text-gray-900 placeholder-gray-400" />
                     <div className="flex gap-2"><input type="text" placeholder="Album" required value={newSong.album} onChange={e => setNewSong({...newSong, album: e.target.value})} className="w-1/2 border rounded p-2 text-gray-900 placeholder-gray-400" /><input type="text" placeholder="Duration (3:45)" required value={newSong.duration} onChange={e => setNewSong({...newSong, duration: e.target.value})} className="w-1/2 border rounded p-2 text-gray-900 placeholder-gray-400" /></div>
                     <div className="bg-gray-50 p-3 rounded text-sm mb-2">
                         <label className="block text-gray-800 font-bold mb-2">DSP Links (Optional)</label>
                         <div className="space-y-2">
                             <input type="url" placeholder="Spotify URL" value={newSong.dsps.spotify} onChange={e => setNewSong({...newSong, dsps: {...newSong.dsps, spotify: e.target.value}})} className="w-full border rounded p-2 text-gray-900 placeholder-gray-400" />
                             <input type="url" placeholder="Apple Music URL" value={newSong.dsps.apple} onChange={e => setNewSong({...newSong, dsps: {...newSong.dsps, apple: e.target.value}})} className="w-full border rounded p-2 text-gray-900 placeholder-gray-400" />
                             <input type="url" placeholder="YouTube URL" value={newSong.dsps.youtube} onChange={e => setNewSong({...newSong, dsps: {...newSong.dsps, youtube: e.target.value}})} className="w-full border rounded p-2 text-gray-900 placeholder-gray-400" />
                         </div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded text-sm text-gray-800 font-medium">Upload Cover <input type="file" required onChange={e => setSongFiles({...songFiles, cover: e.target.files[0]})} className="text-gray-700" /></div>
                     <div className="bg-gray-50 p-3 rounded text-sm text-gray-800 font-medium">Upload Audio (.wav) <input type="file" required onChange={e => setSongFiles({...songFiles, audio: e.target.files[0]})} className="text-gray-700" /></div>
                     <div><label className="text-sm text-gray-800 font-medium"><input type="checkbox" checked={newSong.featured} onChange={e => setNewSong({...newSong, featured: e.target.checked})} className="mr-1" /> Featured?</label></div>
                     <button type="submit" disabled={uploading} className="w-full bg-yellow-500 text-gray-900 font-bold py-2 rounded hover:bg-yellow-600 transition-colors">{uploading ? 'Wait...' : 'Save'}</button>
                 </form>
              </div>
          </div>
      )}

      {showBeatModal && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[60] p-4 text-gray-900">
              <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
                 <button onClick={() => setShowBeatModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><i className="fas fa-times"></i></button>
                 <h2 className="text-2xl font-bold mb-4 text-gray-900">Add Beat</h2>
                 <form onSubmit={handleAddBeatSubmit} className="space-y-3 pb-8 max-h-[70vh] overflow-y-auto px-1">
                     <input type="text" placeholder="Beat Title" required value={newBeat.title} onChange={e => setNewBeat({...newBeat, title: e.target.value})} className="w-full border rounded p-2 text-gray-900 placeholder-gray-400" />
                     <div className="flex gap-2"><input type="text" placeholder="Price (e.g. $50)" value={newBeat.price} onChange={e => setNewBeat({...newBeat, price: e.target.value})} className="w-1/2 border rounded p-2 text-gray-900 placeholder-gray-400" /><input type="text" placeholder="Tags (Trap, Rap)" value={newBeat.tags} onChange={e => setNewBeat({...newBeat, tags: e.target.value})} className="w-1/2 border rounded p-2 text-gray-900 placeholder-gray-400" /></div>
                     <div className="bg-gray-50 p-3 rounded text-sm text-gray-800 font-medium">Upload Cover <input type="file" required onChange={e => setBeatFiles({...beatFiles, cover: e.target.files[0]})} className="text-gray-700" /></div>
                     <div className="bg-gray-50 p-3 rounded text-sm text-gray-800 font-medium">Upload Audio (.wav) <input type="file" required onChange={e => setBeatFiles({...beatFiles, audio: e.target.files[0]})} className="text-gray-700" /></div>
                     <div><label className="text-sm text-gray-800 font-medium"><input type="checkbox" checked={newBeat.featured} onChange={e => setNewBeat({...newBeat, featured: e.target.checked})} className="mr-1" /> Featured?</label></div>
                     <button type="submit" disabled={uploading} className="w-full bg-yellow-500 text-gray-900 font-bold py-2 rounded hover:bg-yellow-600 transition-colors">{uploading ? 'Wait...' : 'Save Beat'}</button>
                 </form>
              </div>
          </div>
      )}

      {showGalleryModal && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[60] p-4 text-gray-900">
              <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
                 <button onClick={() => setShowGalleryModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><i className="fas fa-times"></i></button>
                 <h2 className="text-2xl font-bold mb-4 text-gray-900">Add Gallery Image</h2>
                 <form onSubmit={handleAddGallerySubmit} className="space-y-3 pb-8 max-h-[70vh] overflow-y-auto px-1">
                     <input type="text" placeholder="Image Title/Caption" required value={newGallery.title} onChange={e => setNewGallery({...newGallery, title: e.target.value})} className="w-full border rounded p-2 text-gray-900 placeholder-gray-400" />
                     <div className="bg-gray-50 p-3 rounded text-sm text-gray-800 font-medium">Upload Image <input type="file" required onChange={e => setGalleryFile(e.target.files[0])} className="text-gray-700" /></div>
                     <div><label className="text-sm text-gray-800 font-medium"><input type="checkbox" checked={newGallery.featured} onChange={e => setNewGallery({...newGallery, featured: e.target.checked})} className="mr-1" /> Featured on Homepage?</label></div>
                     <button type="submit" disabled={uploading} className="w-full bg-yellow-500 text-gray-900 font-bold py-2 rounded hover:bg-yellow-600 transition-colors">{uploading ? 'Wait...' : 'Upload Image'}</button>
                 </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
