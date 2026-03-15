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
mongoose.connect(mongoURI)
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

// API Routes

// Blog Routes
app.get('/api/blogs', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const blogs = await BlogPost.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await BlogPost.countDocuments();

        res.json({
            blogs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBlogs: total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});

app.get('/api/blogs/:slug', async (req, res) => {
    try {
        const blog = await BlogPost.findOne({ slug: req.params.slug });
        if (!blog) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        res.json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch blog post' });
    }
});

app.post('/api/blogs', async (req, res) => {
    try {
        const { title, excerpt, content, author, image } = req.body;
        
        // Generate a simple slug from title
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const newBlog = new BlogPost({
            title,
            slug,
            excerpt,
            content,
            author,
            image,
            date: new Date()
        });

        await newBlog.save();
        res.status(201).json({ message: 'Blog post created successfully!', blog: newBlog });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'A blog with this title/slug already exists' });
        }
        res.status(500).json({ error: 'Failed to create blog post' });
    }
});

app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await BlogPost.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        res.json({ message: 'Blog post deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete blog post' });
    }
});

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
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
