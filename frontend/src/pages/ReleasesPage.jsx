import { useState, useEffect } from 'react';
import { fetchReleases } from '../api/api';
import { motion } from 'framer-motion';

const ReleasesPage = () => {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-6">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
                >
                    <span className="text-yellow-500">Official</span> Releases
                </motion.h1>

                {loading ? (
                    <div className="text-center text-white py-20">Loading releases...</div>
                ) : releases.length === 0 ? (
                    <div className="text-center text-white py-20">No releases found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {releases.map((release, index) => {
                            const videoId = getYouTubeId(release.youtubeUrl);
                            if (!videoId) return null;

                            return (
                                <motion.div 
                                    key={release._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="w-full aspect-video rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(234,179,8,0.15)] border border-yellow-500/20"
                                >
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={`https://www.youtube.com/embed/${videoId}?rel=0`} 
                                        title="YouTube video player" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                        className="w-full h-full object-cover"
                                    ></iframe>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReleasesPage;
