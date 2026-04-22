const Gallery = require('../models/Gallery');

const MAX_FEATURED = 4;

const getGallery = async (req, res) => {
    try {
        const images = await Gallery.find({}).sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getFeaturedGallery = async (req, res) => {
    try {
        const images = await Gallery.find({ featured: true }).sort({ createdAt: -1 }).limit(MAX_FEATURED);
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createGallery = async (req, res) => {
    try {
        const { title, imagePath, featured } = req.body;

        // If marking as featured, enforce the cap
        if (featured) {
            const currentFeatured = await Gallery.find({ featured: true }).sort({ createdAt: -1 });
            if (currentFeatured.length >= MAX_FEATURED) {
                const toUnfeature = currentFeatured.slice(MAX_FEATURED - 1);
                for (const item of toUnfeature) {
                    item.featured = false;
                    await item.save();
                }
            }
        }

        const image = new Gallery({ title, imagePath, featured });
        const createdImage = await image.save();
        res.status(201).json(createdImage);
    } catch (error) {
        res.status(400).json({ message: 'Invalid gallery data' });
    }
};

const deleteGallery = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (image) {
            await image.deleteOne();
            res.json({ message: 'Gallery image removed' });
        } else {
            res.status(404).json({ message: 'Gallery image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getGallery, getFeaturedGallery, createGallery, deleteGallery };
