import { useState, useEffect } from 'react';
import { fetchUserBookings } from '../../api/api';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { data } = await fetchUserBookings();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings', err);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const statusIcons = {
    pending: 'fa-clock',
    confirmed: 'fa-check-circle',
    completed: 'fa-check-double',
    cancelled: 'fa-times-circle',
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-spinner fa-spin text-3xl text-yellow-500 mb-3 block"></i>
        <span className="text-white">Loading your bookings...</span>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-calendar-alt text-5xl text-yellow-500/40 mb-4 block"></i>
        <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
        <p className="text-white text-sm">
          You haven't booked any studio sessions yet. Head to the home page to book one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="bg-black border border-yellow-500/10 rounded-xl p-5 hover:border-yellow-500/30 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div>
              <h4 className="font-semibold text-white text-lg">{booking.serviceType}</h4>
              <p className="text-white text-sm">
                <i className="far fa-calendar mr-1"></i>
                {booking.preferredDate
                  ? new Date(booking.preferredDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'No date specified'}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                statusColors[booking.status] || statusColors.pending
              }`}
            >
              <i className={`fas ${statusIcons[booking.status] || statusIcons.pending}`}></i>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          {booking.message && (
            <p className="text-white text-sm border-t border-yellow-500/10 pt-3 mt-2">
              <span className="text-xs text-yellow-500 uppercase tracking-wider block mb-1">Your Message</span>
              <i className="fas fa-comment mr-1 text-yellow-500/50"></i> {booking.message}
            </p>
          )}
          {booking.adminReply && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 mt-3">
              <p className="text-xs text-yellow-500 uppercase tracking-wider mb-1 font-bold"><i className="fas fa-reply mr-1"></i>Rama Records Reply</p>
              <p className="text-white text-sm whitespace-pre-wrap">{booking.adminReply}</p>
            </div>
          )}
          <div className="text-xs text-white mt-2">
            Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN')}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserBookings;
