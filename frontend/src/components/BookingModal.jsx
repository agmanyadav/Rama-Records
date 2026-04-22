import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBooking } from '../api/api';

const BookingModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Recording',
    preferredDate: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createBooking(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', serviceType: 'Recording', preferredDate: '', message: '' });
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      setError('Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-yellow-500">Book a Session</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-green-400 text-3xl"></i>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Booking Submitted!</h4>
                <p className="text-gray-400">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-300">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-300">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-300">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-300">Service *</label>
                  <select
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                  >
                    <option value="Recording">Recording</option>
                    <option value="Mixing">Mixing</option>
                    <option value="Mastering">Mastering</option>
                    <option value="Music Production">Music Production</option>
                    <option value="Music Distribution">Music Distribution</option>
                    <option value="Video Production">Video Production</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-300">Preferred Date</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={form.preferredDate}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-300">Message</label>
                  <textarea
                    name="message"
                    rows="3"
                    value={form.message}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors resize-none"
                  ></textarea>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-full text-lg transition-all duration-300 disabled:opacity-50 shadow-lg"
                >
                  {loading ? (
                    <span><i className="fas fa-spinner fa-spin mr-2"></i>Submitting...</span>
                  ) : (
                    <span><i className="fas fa-calendar-check mr-2"></i>Submit Booking</span>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
