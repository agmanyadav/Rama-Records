import { usePlayer } from '../context/PlayerContext';
import { getStaticUrl } from '../api/api';

const AudioPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    nextSong,
    prevSong,
    seekTo,
    setVolume,
  } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    seekTo(pos * duration);
  };

  const handleVolumeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, pos)));
  };

  const coverUrl = currentSong.coverUrl || getStaticUrl(currentSong.coverImage);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-50">
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Song Info */}
          <div className="flex items-center space-x-3 w-1/4 min-w-0">
            <img
              src={coverUrl}
              alt={currentSong.title}
              className="w-12 h-12 rounded-lg object-cover shadow-md flex-shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-medium text-sm text-white truncate">
                {currentSong.title}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {currentSong.artists}
              </p>
            </div>
            <button className="text-gray-400 hover:text-yellow-500 transition-colors flex-shrink-0 hidden sm:block">
              <i className="far fa-heart text-lg"></i>
            </button>
          </div>

          {/* Controls + Progress */}
          <div className="flex flex-col items-center w-2/4 max-w-xl">
            <div className="flex items-center space-x-5 mb-2">
              <button
                onClick={prevSong}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <i className="fas fa-backward-step text-lg"></i>
              </button>
              <button
                onClick={togglePlay}
                className="bg-yellow-500 hover:bg-yellow-400 rounded-full w-9 h-9 flex items-center justify-center transition-all hover:scale-105 shadow-md"
              >
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-gray-900 text-sm ${!isPlaying ? 'ml-0.5' : ''}`}></i>
              </button>
              <button
                onClick={nextSong}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <i className="fas fa-forward-step text-lg"></i>
              </button>
            </div>

            <div className="w-full flex items-center space-x-2">
              <span className="text-xs text-gray-400 w-10 text-right font-mono">
                {formatTime(currentTime)}
              </span>
              <div
                className="h-1.5 bg-gray-700 rounded-full flex-1 cursor-pointer group relative"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-yellow-500 rounded-full relative transition-all"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <span className="text-xs text-gray-400 w-10 font-mono">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center space-x-3 w-1/4 justify-end">
            <button className="text-gray-400 hover:text-white transition-colors">
              <i className={`fas ${volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-low' : 'fa-volume-high'} text-lg`}></i>
            </button>
            <div
              className="w-24 h-1.5 bg-gray-700 rounded-full cursor-pointer group relative"
              onClick={handleVolumeClick}
            >
              <div
                className="h-full bg-yellow-500 rounded-full relative"
                style={{ width: `${volume * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
