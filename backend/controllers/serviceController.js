const Service = require('../models/Service');

const getServices = async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getFeaturedServices = async (req, res) => {
    try {
        const services = await Service.find({ featured: true });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createService = async (req, res) => {
    try {
        const { title, description, price, iconClass, featured } = req.body;
        const service = new Service({ title, description, price, iconClass, featured });
        const createdService = await service.save();
        res.status(201).json(createdService);
    } catch (error) {
        res.status(400).json({ message: 'Invalid service data' });
    }
};

const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (service) {
            await service.deleteOne();
            res.json({ message: 'Service removed' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getServices, getFeaturedServices, createService, deleteService };
