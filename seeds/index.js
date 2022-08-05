const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp_camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB!');
});

const sampel = array => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sampel(descriptors)} ${sampel(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            author: '62ea7219539c4300fcf905de',
            price: Math.floor(Math.random() * 20) + 10,
            images: [
                {
                    url: 'https://res.cloudinary.com/ktomy7/image/upload/v1659721064/YelpCamp/htzc16td1tcnd4t5ca6q.jpg',
                    filename: 'YelpCamp/htzc16td1tcnd4t5ca6q'
                },
                {
                    url: 'https://res.cloudinary.com/ktomy7/image/upload/v1659721063/YelpCamp/ihqv8rf6lispxkhfpt5r.jpg',
                    filename: 'YelpCamp/ihqv8rf6lispxkhfpt5r'
                },
                {
                    url: 'https://res.cloudinary.com/ktomy7/image/upload/v1659721189/YelpCamp/r0gbjt7xi9a3xzgjzgsv.jpg',
                    filename: 'YelpCamp/r0gbjt7xi9a3xzgjzgsv'
                }
            ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
