import { motion } from 'framer-motion';
import { getStaticUrl } from '../api/api';

const CEOSection = () => {
  return (
    <section id="ceo" className="py-20 px-6 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-shrink-0"
        >
          <img
            src={getStaticUrl('/images/CEO_rama_records (2).jpg')}
            alt="Anurag Dhiman - CEO & Founder of Rama Records"
            className="w-72 md:w-80 h-auto rounded-2xl shadow-2xl object-cover border-4 border-yellow-400"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-500">
            Meet Our CEO & Founder
          </h3>
          <p className="text-lg text-gray-800 mb-2 font-semibold">Anurag Dhiman</p>
          <div className="text-gray-700 text-base leading-relaxed space-y-4">
            <p>
              Anurag Dhiman is an Independent Artist, Music Producer, Audio Engineer &
              Founder & CEO at Rama Records.
            </p>
            <p>
              He was born on September 10, 2003, in Shamli, Uttar Pradesh and currently
              lives in Roorkee, Uttarakhand. Anurag is a versatile music producer and
              independent artist who is redefining the soundscape with his innovative
              approach to music.
            </p>
            <p>
              Anurag is not just an artist but a true architect of sound. As the CEO &
              Founder of 'Rama Records', he's pushing boundaries, creating unique musical
              experiences that resonate with listeners worldwide.
            </p>
            <p>
              A visionary behind the scenes, Anurag's expertise as an audio engineer allows
              him to seamlessly blend genres, textures, and emotions into every track.
              Whether he's producing, mixing, or composing, his passion for music is evident
              in every note.
            </p>
            <p className="text-yellow-600 font-medium italic">
              Follow Anurag's journey as he continues to evolve and craft the future of
              music, one track at a time.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CEOSection;
