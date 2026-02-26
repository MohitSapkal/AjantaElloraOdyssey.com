const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eternaltrail';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Database Models
const Contact = mongoose.model('Contact', new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    service: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
}));

const Enquiry = mongoose.model('Enquiry', new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    date: String,
    duration: Number,
    people: Number,
    tour: String,
    vehicle: String,
    accommodation: String,
    hotel: String,
    notes: String,
    createdAt: { type: Date, default: Date.now }
}));

const GuideBooking = mongoose.model('GuideBooking', new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    date: String,
    arrangement: String,
    language: String,
    details: String,
    createdAt: { type: Date, default: Date.now }
}));

// API Routes

// Handle General Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json({ message: 'Contact message saved successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save contact message' });
    }
});

// Handle Detailed Enquiry Form
app.post('/api/enquiry', async (req, res) => {
    try {
        const newEnquiry = new Enquiry(req.body);
        await newEnquiry.save();
        res.status(201).json({ message: 'Enquiry saved successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save enquiry' });
    }
});

// Handle Guide Booking Form
app.post('/api/guide-booking', async (req, res) => {
    try {
        const newGuideBooking = new GuideBooking(req.body);
        await newGuideBooking.save();
        res.status(201).json({ message: 'Guide booking request saved successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save guide booking' });
    }
});

// Fallback to index.html for any other routes (helps with refresh on SPA, optional if it's strictly mostly HTML pages)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
