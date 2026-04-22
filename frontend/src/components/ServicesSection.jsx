import { motion } from 'framer-motion';

const services = [
  {
    _id: '1',
    title: 'Music Production',
    description: 'Turning ideas into fully developed tracks with composition, arrangement, sound design, and creative direction.',
    iconClass: 'fas fa-sliders-h',
  },
  {
    _id: '2',
    title: 'Recording',
    description: 'Professional vocal and instrument recording with high-quality equipment for clean, polished sound.',
    iconClass: 'fas fa-microphone',
  },
  {
    _id: '3',
    title: 'Mixing',
    description: 'Balancing vocals and instruments, enhancing clarity, depth, and impact to make your track sound complete.',
    iconClass: 'fas fa-headphones',
  },
  {
    _id: '4',
    title: 'Mastering',
    description: 'Final audio polishing to optimize loudness, clarity, and consistency for release across all platforms.',
    iconClass: 'fas fa-wave-square',
  },
  {
    _id: '5',
    title: 'Music Distribution',
    description: 'Get your music released on major streaming platforms like Spotify, Apple Music, and more.',
    iconClass: 'fas fa-globe',
  },
  {
    _id: '6',
    title: 'Video Production',
    description: 'Creating high-quality visuals, music videos, and promotional content that bring your sound to life.',
    iconClass: 'fas fa-video',
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-yellow-500">Services</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg border-b border-slate-700 pb-8">
            Professional solutions for every step of your musical journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={service._id}
              className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-yellow-500 transition-colors duration-300 group shadow-lg hover:shadow-xl flex flex-col h-full"
            >
              <div className="w-14 h-14 bg-slate-900 shadow-sm rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors duration-300">
                <i className={`${service.iconClass} text-2xl text-yellow-500 group-hover:text-gray-900 transition-colors`}></i>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed flex-grow">
                {service.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <a href="#contact" className="text-yellow-500 font-bold text-lg hover:text-yellow-400 transition-colors cursor-pointer">
                  Contact for Pricing <i className="fas fa-arrow-right ml-1 text-sm"></i>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
