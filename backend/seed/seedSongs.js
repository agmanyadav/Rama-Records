const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Song = require('../models/Song.js');
const User = require('../models/User.js');
const connectDB = require('../config/db.js');

dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const songs = [
    {
        title: 'Shaamein',
        artists: 'Anurag Dhimaan & Akshay Tyagi',
        album: 'Rama Records',
        duration: '2:47',
        coverImage: '/images/songs_thumbnails/Shaamein.png',
        audioFile: '/songs/Shaamein.wav',
        dsps: { spotify: '', apple: '', youtube: '' },
        featured: true,
        order: 1,
    },
    {
        title: 'Aa Bhi Jaa',
        artists: 'Anurag Dhimaan & Akshay Tyagi',
        album: 'Rama Records',
        duration: '4:15',
        coverImage: '/images/songs_thumbnails/Aa Bhi Jaa.png',
        audioFile: '/songs/Aa Bhi Jaa.wav',
        dsps: { spotify: '', apple: '', youtube: '' },
        featured: true,
        order: 2,
    },
    {
        title: 'Kahani',
        artists: 'Anurag Dhimaan & Akshay Tyagi',
        album: 'Rama Records',
        duration: '2:56',
        coverImage: '/images/songs_thumbnails/Kahani.png',
        audioFile: '/songs/Kahani.wav',
        dsps: { spotify: '', apple: '', youtube: '' },
        featured: true,
        order: 3,
    },
    {
        title: 'Khwab',
        artists: 'Anurag Dhimaan & Akshay Tyagi',
        album: 'Rama Records',
        duration: '3:30',
        coverImage: '/images/songs_thumbnails/Khwab.png',
        audioFile: '/songs/Khwab.wav',
        dsps: { spotify: '', apple: '', youtube: '' },
        featured: true,
        order: 4,
    },
    {
        title: 'Paatal Lok',
        artists: 'Anurag Dhimaan & Akshay Tyagi',
        album: 'Rama Records',
        duration: '3:30',
        coverImage: '/images/songs_thumbnails/Paatal Lok.png',
        audioFile: '/songs/Paatal Lok.wav',
        dsps: { spotify: '', apple: '', youtube: '' },
        featured: true,
        order: 5,
    },
];

const adminUser = {
    name: 'Admin',
    email: 'admin@ramarecords.com',
    password: 'admin123',
    isAdmin: true,
};

const importData = async () => {
    try {
        await connectDB();

        await Song.deleteMany();
        await User.deleteMany();

        await Song.insertMany(songs);
        await User.create(adminUser);

        console.log('Data Imported!');
        console.log('Admin Login: admin@ramarecords.com / admin123');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await Song.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
