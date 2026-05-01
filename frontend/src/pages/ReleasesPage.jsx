import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchReleases } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

const ReleasesPage = () => {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [search, setSearch] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);
    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const autoResumeTimerRef = useRef(null);
    const apiLoadedRef = useRef(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const getReleasesData = async () => {
            try {
                const res = await fetchReleases();
                setReleases(res.data);
            } catch (error) {
                console.error("Failed to load releases", error);
            } finally {
                setLoading(false);
            }
        };
        getReleasesData();
    }, []);

    // Helper to extract Video ID from YouTube URL
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Filter releases by search (using the hidden title metadata)
    const filteredReleases = releases.filter((r) => {
        if (!search.trim()) return true;
        return (r.title || '').toLowerCase().includes(search.toLowerCase());
    });

    const currentRelease = filteredReleases[currentIndex] || filteredReleases[0];
    const currentVideoId = currentRelease ? getYouTubeId(currentRelease.youtubeUrl) : null;

    // Thumbnail releases = all filtered except the current hero
    const thumbnailReleases = filteredReleases.filter((_, idx) => idx !== currentIndex);

    // ── YouTube IFrame API ──
    const onPlayerStateChange = useCallback((event) => {
        // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0, BUFFERING=3
        if (event.data === 1) {
            // Video is playing — pause auto-slide
            setIsPlaying(true);
            setAutoSlideEnabled(false);
            if (autoResumeTimerRef.current) {
                clearTimeout(autoResumeTimerRef.current);
                autoResumeTimerRef.current = null;
            }
        } else if (event.data === 2 || event.data === 0) {
            // Paused or ended — re-enable auto-slide after delay
            setIsPlaying(false);
            if (autoResumeTimerRef.current) clearTimeout(autoResumeTimerRef.current);
            autoResumeTimerRef.current = setTimeout(() => {
                setAutoSlideEnabled(true);
            }, 10000);
        }
    }, []);

    // Load YT IFrame API once
    useEffect(() => {
        if (apiLoadedRef.current) return;
        if (typeof window.YT !== 'undefined' && window.YT.Player) {
            apiLoadedRef.current = true;
            return;
        }
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(tag, firstScript);
        window.onYouTubeIframeAPIReady = () => {
            apiLoadedRef.current = true;
        };
    }, []);

    // Create / update the YT player when the hero video changes
    useEffect(() => {
        if (!currentVideoId) return;

        const createPlayer = () => {
            // Destroy existing player and recreate the div element
            // (YT.Player replaces the div with an iframe, so we need a fresh div)
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch (e) { /* ignore */ }
                playerRef.current = null;
            }

            // Ensure the target div exists (recreate if YT replaced it with iframe)
            const container = playerContainerRef.current;
            if (container) {
                let targetDiv = document.getElementById('yt-hero-player');
                if (!targetDiv) {
                    targetDiv = document.createElement('div');
                    targetDiv.id = 'yt-hero-player';
                    targetDiv.style.width = '100%';
                    targetDiv.style.height = '100%';
                    container.appendChild(targetDiv);
                }
            }

            playerRef.current = new window.YT.Player('yt-hero-player', {
                videoId: currentVideoId,
                width: '100%',
                height: '100%',
                playerVars: {
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    autoplay: 0,
                },
                events: {
                    onStateChange: onPlayerStateChange,
                    onReady: (event) => {
                        // Ensure the iframe fills the container
                        const iframe = event.target.getIframe();
                        if (iframe) {
                            iframe.style.width = '100%';
                            iframe.style.height = '100%';
                            iframe.style.position = 'absolute';
                            iframe.style.top = '0';
                            iframe.style.left = '0';
                        }
                    },
                },
            });
        };

        // Wait for API to be ready
        if (typeof window.YT !== 'undefined' && window.YT.Player) {
            createPlayer();
        } else {
            const checkInterval = setInterval(() => {
                if (typeof window.YT !== 'undefined' && window.YT.Player) {
                    clearInterval(checkInterval);
                    apiLoadedRef.current = true;
                    createPlayer();
                }
            }, 200);
            return () => clearInterval(checkInterval);
        }

        return () => {
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch (e) { /* ignore */ }
                playerRef.current = null;
            }
        };
    }, [currentVideoId, onPlayerStateChange]);

    // ── Auto-slide timer ──
    useEffect(() => {
        if (!autoSlideEnabled || isPlaying || filteredReleases.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % filteredReleases.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [autoSlideEnabled, isPlaying, filteredReleases.length]);

    // Reset currentIndex when search changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [search]);

    // Handle thumbnail click
    const handleThumbnailClick = (globalIndex) => {
        setCurrentIndex(globalIndex);
        setIsPlaying(false);
        setAutoSlideEnabled(false);
        if (autoResumeTimerRef.current) clearTimeout(autoResumeTimerRef.current);
        autoResumeTimerRef.current = setTimeout(() => {
            setAutoSlideEnabled(true);
        }, 15000);
        // Scroll to hero
        if (playerContainerRef.current) {
            playerContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (autoResumeTimerRef.current) clearTimeout(autoResumeTimerRef.current);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black pt-20 pb-20">
            <div className="max-w-6xl mx-auto px-6">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-4 text-center"
                >
                    <span className="text-yellow-500">Official</span> Releases
                </motion.h1>

                {loading ? (
                    <div className="text-center text-white py-20">
                        <i className="fas fa-spinner fa-spin text-3xl mb-3 block text-yellow-500"></i>
                        Loading releases...
                    </div>
                ) : releases.length === 0 ? (
                    <div className="text-center text-white py-20">No releases found.</div>
                ) : (
                    <>
                        {/* ── Featured Video Hero ── */}
                        <motion.div
                            ref={playerContainerRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_4px_40px_rgba(234,179,8,0.2)] border border-yellow-500/30 mb-2"
                            style={{ maxHeight: 'calc(100vh - 230px)' }}
                        >
                            <div id="yt-hero-player" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                        </motion.div>

                        {/* Hero video indicator dots */}
                        {filteredReleases.length > 1 && (
                            <div className="flex justify-center gap-2 mb-4">
                                {filteredReleases.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleThumbnailClick(idx)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            idx === currentIndex
                                                ? 'bg-yellow-500 scale-125'
                                                : 'bg-white/30 hover:bg-white/60'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* ── Search Bar ── */}
                        <div className="flex justify-center mb-4">
                            <div className="relative w-full max-w-md">
                                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-white/50"></i>
                                <input
                                    type="text"
                                    placeholder="Search releases..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-yellow-500/20 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* ── Thumbnail Grid ── */}
                        {thumbnailReleases.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-white mb-3">
                                    More Videos
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {thumbnailReleases.map((release) => {
                                        const videoId = getYouTubeId(release.youtubeUrl);
                                        if (!videoId) return null;
                                        const globalIndex = filteredReleases.findIndex(
                                            (r) => r._id === release._id
                                        );

                                        return (
                                            <motion.div
                                                key={release._id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                whileHover={{ scale: 1.03 }}
                                                transition={{ duration: 0.3 }}
                                                className="cursor-pointer group relative rounded-xl overflow-hidden border border-yellow-500/10 hover:border-yellow-500/40 transition-all shadow-md"
                                                onClick={() => handleThumbnailClick(globalIndex)}
                                            >
                                                <img
                                                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                                    alt={release.title || 'Video thumbnail'}
                                                    className="w-full aspect-video object-cover"
                                                    loading="lazy"
                                                />
                                                {/* Play overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                                                        <i className="fas fa-play text-white text-sm ml-0.5"></i>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {filteredReleases.length === 0 && search && (
                            <div className="text-center py-10 text-white/60">
                                <i className="fas fa-search text-3xl mb-3 block"></i>
                                No releases found matching "{search}"
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
};

export default ReleasesPage;
