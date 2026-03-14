
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eternaltrail';

const BlogPost = mongoose.model('BlogPost', new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: String,
    image: String,
    author: String,
    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
}));

const seedBlogs = [
    {
        title: "Discovering the Grandeur of Ajanta Caves",
        slug: "discovering-ajanta-caves",
        excerpt: "A deep dive into the 30 rock-cut Buddhist cave monuments which date from the 2nd century BCE to about 480 CE.",
        content: "The Ajanta Caves are 30 rock-cut Buddhist cave monuments which date from the 2nd century BCE to about 480 CE in Aurangabad district of Maharashtra state of India. The caves include paintings and rock-cut sculptures described as among the finest surviving examples of ancient Indian art, particularly expressive paintings that present emotions through gesture, pose and form.\n\nThey are universally regarded as masterpieces of Buddhist religious art. The caves were built in two phases, the first starting around the 2nd century BCE and the second occurring from 400–650 CE, according to older accounts, or in a brief period of 460–480 CE according to later scholarship. The site is a protected monument in the care of the Archaeological Survey of India, and since 1983, the Ajanta Caves have been a UNESCO World Heritage Site.\n\nVisiting Ajanta is like stepping back in time. Each cave has its own story, told through intricate murals and towering statues of Buddha. At AjantaElloraOdyssey.com, we ensure your visit is not just a tour, but an educational and spiritual journey.",
        image: "images/Ajanta.jpg",
        author: "Mohit Sapkal",
        date: new Date()
    },
    {
        title: "The Mystery of Lonar Crater Lake",
        slug: "mystery-of-lonar-crater",
        excerpt: "Learn about the world's only high-velocity impact crater formed in basaltic rock, a geological marvel right here in Maharashtra.",
        content: "Lonar Lake, also known as Lonar crater, is a notified National Geo-heritage Monument, saline, soda lake, located at Lonar in Buldhana district, Maharashtra, India. Lonar Lake was created by a meteorite collision impact during the Pleistocene Epoch. It is one of the four known, hyper-velocity, impact craters in basaltic rock anywhere on Earth.\n\nThe lake's water is both saline and alkaline. Lonar Lake has a mean diameter of 1.2 kilometers and is about 137 meters below the crater rim. The meteorite crater rim is about 1.8 kilometers in diameter.\n\nGeologists, ecologists, archaeologists, and naturalists have studied various aspects of this lake ecosystem. Lonar Lake is situated inside the Deccan Plateau – an enormous plain of volcanic basalt rock created by eruptions some 65 million years ago. Its location in this basalt field suggested to some geologists that it was a volcanic crater. Today, however, Lonar Lake is understood to be the result of a meteorite impact.",
        image: "images/lonar.jpg",
        author: "Mohit Sapkal",
        date: new Date(Date.now() - 86400000)
    },
    {
        title: "Ellora Caves: A Monolithic Masterpiece",
        slug: "ellora-caves-monolithic-masterpiece",
        excerpt: "Explore the Kailasa temple, the largest monolithic rock excavation in the world.",
        content: "Ellora is a UNESCO World Heritage Site located in the Aurangabad district of Maharashtra, India. It is one of the largest rock-cut Hindu temple cave complexes in the world, featuring Hindu, Buddhist and Jain monuments, and artwork, dating from the 600–1000 CE period.\n\nCave 16, in particular, features the largest single monolithic rock excavation in the world, the Kailasa temple, a chariot-shaped monument dedicated to Lord Shiva. The Kailasa temple excavation also features sculptures depicting various Hindu deities as well as relief panels summarizing the two major Hindu epics.\n\nEllora was a vibrant commercial center on an ancient trade route. Today, it stands as a testament to the religious harmony of ancient India, with monuments from three different faiths co-existing in one location.",
        image: "images/Ellora cave.jpg",
        author: "Mohit Sapkal",
        date: new Date(Date.now() - 172800000)
    },
    {
        title: "The Flavors of Maharashtra: A Culinary Journey",
        slug: "flavors-of-maharashtra",
        excerpt: "Discover the spicy and savory delights of Maharashtrian cuisine, from Puran Poli to Misal Pav.",
        content: "Maharashtrian cuisine is a diverse and flavorful world of its own. Known for its bold spices and unique textures, it offers something for every palate. Whether you're a vegetarian or a non-vegetarian, the state's culinary heritage will leave you craving more.\n\nFrom the world-famous Misal Pav and Vada Pav (the Indian burger) to the sweet and comforting Puran Poli, every dish tells a story of the region it belongs to. The coastal regions offer fresh and spicy seafood (Malvani cuisine), while the interiors focus on millets and robust spice mixes like 'Kanda Lasun Masala'.\n\nWhen you travel with AjantaElloraOdyssey.com, we don't just show you the sights; we take you on a culinary adventure that stays with you forever.",
        image: "images/hero-bg.png",
        author: "Admin",
        date: new Date(Date.now() - 259200000)
    },
    {
        title: "Spiritual Solace: The Jyotirlingas of Maharashtra",
        slug: "spiritual-solace-jyotirlingas",
        excerpt: "A guide to the five holy Jyotirlingas located in Maharashtra and their religious significance.",
        content: "Maharashtra is home to five of the twelve Jyotirlingas, the most sacred shrines dedicated to Lord Shiva. These temples are not just centers of faith but also marvels of ancient architecture and centers of deep spiritual energy.\n\nTrimbakeshwar near Nashik, Bhimashankar near Pune, Grishneshwar near Ellora, Aundha Nagnath in Hingoli, and Parli Vaijnath in Beed - each of these shrines has a unique legend and atmosphere. Grishneshwar, being closest to the Ellora caves, is a must-visit for anyone exploring the heritage of Chhatrapati Sambhajinagar.\n\nOur Heritage & Spiritual tour package is designed to provide seekers with a seamless pilgrimage experience, combining site-seeing with soul-stirring visits to these holy abodes.",
        image: "images/sai.jpg",
        author: "Mohit Sapkal",
        date: new Date(Date.now() - 345600000)
    }
];

async function seed() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for seeding...');
        
        await BlogPost.deleteMany({});
        console.log('Cleared existing blogs.');
        
        await BlogPost.insertMany(seedBlogs);
        console.log('Successfully seeded sample blogs.');
        
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding data:', err);
    }
}

seed();
