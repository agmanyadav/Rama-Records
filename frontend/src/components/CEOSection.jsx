import { motion } from 'framer-motion';
import { getStaticUrl } from '../api/api';

const CEOSection = () => {
  return (
    <section id="ceo" className="py-20 px-6 bg-black border-t border-yellow-500/20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-shrink-0 flex flex-col items-center gap-6"
        >
          <img
            src={getStaticUrl('/images/CEO_rama_records (2).jpg')}
            alt="Anurag Dhiman - CEO & Founder of Rama Records"
            className="w-72 md:w-80 h-auto rounded-2xl shadow-[0_4px_30px_rgba(234,179,8,0.35)] object-cover"
          />
          <div className="flex gap-4">
            <a href="https://www.facebook.com/people/Anurag-Dhiman/61582352818080/?rdid=oPsM9vtH9flavYpi&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1B47aYPFQv%2F" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 group shadow-md">
              <i className="fab fa-facebook-f text-white group-hover:text-black transition-colors text-lg"></i>
            </a>
            <a href="https://www.instagram.com/prod.anurag" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 group shadow-md">
              <i className="fab fa-instagram text-white group-hover:text-black transition-colors text-lg"></i>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-500">
            Founder & CEO
          </h3>
          <p className="text-lg text-white mb-2 font-semibold">Anurag Dhiman</p>
          <div className="text-white text-base leading-relaxed space-y-4">
            <p>
              He is an Independent Artist, Music Producer, Audio Engineer &
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
