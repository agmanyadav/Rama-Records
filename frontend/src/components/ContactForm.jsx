import { useState } from 'react';
import { motion } from 'framer-motion';
import { createContact } from '../api/api';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
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
      await createContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-center text-yellow-500 section-title">
          Contact Us
        </h3>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label htmlFor="contact-name" className="block mb-2 text-sm font-medium text-gray-800">
              Name
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block mb-2 text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block mb-2 text-sm font-medium text-gray-800">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              required
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors resize-none"
            ></textarea>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 text-sm flex items-center gap-2"
            >
              <i className="fas fa-check-circle"></i> Message sent successfully!
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 disabled:opacity-50 shadow-lg"
          >
            {loading ? (
              <span><i className="fas fa-spinner fa-spin mr-2"></i>Sending...</span>
            ) : (
              'Send Message'
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactForm;
