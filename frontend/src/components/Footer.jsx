import { usePlayer } from '../context/PlayerContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { currentSong } = usePlayer();

  return (
    <footer className={`bg-slate-900 border-t border-slate-800 ${currentSong ? 'pb-24 lg:pb-28' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left md:flex-1">
            <h4 className="font-logo text-yellow-500 text-2xl mb-1">Rama Records</h4>
            <p className="text-gray-500 text-sm">© 2025 Rama Records. All rights reserved.</p>
          </div>

          <div className="text-center md:flex-1 flex items-center justify-center gap-2">
            <span className="text-gray-400 text-sm">Developed by Agman Yadav</span>
            <a href="https://github.com/agmanyadav" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="GitHub Profile">
              <i className="fab fa-github text-lg"></i>
            </a>
          </div>

          <div className="flex flex-nowrap gap-2 md:gap-4 justify-center md:justify-end md:flex-1 mt-6 md:mt-0 items-center">
            <a href="https://www.facebook.com/people/Anurag-Dhiman/61582352818080/?rdid=oPsM9vtH9flavYpi&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1B47aYPFQv%2F" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 group">
              <i className="fab fa-facebook-f text-yellow-500 group-hover:text-gray-900 transition-colors text-sm md:text-base"></i>
            </a>
            <a href="https://www.instagram.com/prod.anurag" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 group">
              <i className="fab fa-instagram text-yellow-500 group-hover:text-gray-900 transition-colors text-sm md:text-base"></i>
            </a>
            <a href="https://youtube.com/@rama_records?si=hGV7itUHmFPzNdn8" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 group">
              <i className="fab fa-youtube text-yellow-500 group-hover:text-gray-900 transition-colors text-sm md:text-base"></i>
            </a>
            <a href="https://open.spotify.com/artist/4op8Pw26GvYDqrgjXnC6nk?si=oPHi_4y5Qfqm8LkSf0dIRQ" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 group">
              <i className="fab fa-spotify text-yellow-500 group-hover:text-gray-900 transition-colors text-sm md:text-base"></i>
            </a>
            <a href="https://music.apple.com/us/artist/anurag-dhiman/1793300051" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 group">
              <i className="fab fa-apple text-yellow-500 group-hover:text-gray-900 transition-colors text-sm md:text-base"></i>
            </a>
            <a href="https://music.amazon.in/artists/B0DVC8BK25/anurag-dhiman?marketplaceId=A21TJRUUN4KGV&musicTerritory=IN&ref=dm_sh_mZXCvxriBFKccG3X1zHwrNFtp" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 group">
              <i className="fab fa-amazon text-yellow-500 group-hover:text-gray-900 transition-colors text-sm md:text-base"></i>
            </a>
            <a href="https://www.jiosaavn.com/artist/anurag-dhiman-songs/1MKtmjJtojs_" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 group">
              <i className="fas fa-compact-disc text-yellow-500 group-hover:text-gray-900 transition-colors text-sm md:text-base" title="JioSaavn"></i>
            </a>
            <div className="border-l border-slate-700 ml-1 md:ml-2 pl-2 md:pl-3 flex items-center">
              <Link to="/admin" className="text-slate-600 hover:text-slate-400 transition-colors" title="Admin Login" aria-label="Admin Login">
                <i className="fas fa-lock text-xs md:text-sm"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
