import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.5);

    const currentSong = playlist[currentIndex] || null;

    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            if (currentIndex < playlist.length - 1) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                setIsPlaying(false);
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentIndex, playlist.length]);

    useEffect(() => {
        const audio = audioRef.current;
        if (currentSong) {
            audio.src = currentSong.audioUrl;
            if (isPlaying) {
                audio.play().catch(() => {});
            }
        }
    }, [currentSong?.audioUrl]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    const playSong = useCallback((song, list = null, index = 0) => {
        if (list) {
            setPlaylist(list);
            setCurrentIndex(index);
        } else {
            setPlaylist([song]);
            setCurrentIndex(0);
        }
        setIsPlaying(true);
        const audio = audioRef.current;
        audio.src = song.audioUrl;
        audio.play().catch(() => {});
    }, []);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(() => {});
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const nextSong = useCallback(() => {
        if (currentIndex < playlist.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setIsPlaying(true);
        }
    }, [currentIndex, playlist.length]);

    const prevSong = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setIsPlaying(true);
        }
    }, [currentIndex]);

    const seekTo = useCallback((time) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    }, []);

    const setVolume = useCallback((vol) => {
        setVolumeState(vol);
        audioRef.current.volume = vol;
    }, []);

    const value = {
        currentSong,
        playlist,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        playSong,
        togglePlay,
        nextSong,
        prevSong,
        seekTo,
        setVolume,
        setPlaylist,
        setCurrentIndex,
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerContext;
