const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// נתיב הבדיקה הראשי
app.get('/', (req, res) => {
    res.send('Hello World');
});

// הגדרת משתני חיבור (נמשכים רק מתוך ה-.env)
const mongoUri = process.env.MONGO_URI;
const localUri = process.env.MONGO_LOCAL_URI || 'mongodb://127.0.0.1:27017/SvExam';

console.log('Connecting to Database...');

// פונקציית הפעלת השרת
function startServer() {
    if (!app.locals.listening) {
        app.listen(port, () => {
            console.log(`Server is running on port ${port} successfully!`);
        });
        app.locals.listening = true;
    }
}

// ניסיון חיבור ל-Atlas
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 })
    .then(() => {
        console.log('Connected to MongoDB Atlas! successfully!');
        startServer();
    })
    .catch((err) => {
        console.warn('Atlas connection failed:', err.message);
        console.log('Trying local MongoDB...');

        // ניסיון חיבור מקומי כגיבוי
        mongoose.connect(localUri, { serverSelectionTimeoutMS: 4000 })
            .then(() => {
                console.log('Connected to local MongoDB! successfully!');
                startServer();
            })
            .catch((localErr) => {
                console.error('MongoDB connection failed completely:', localErr.message);
                // הפעלת השרת בכל מקרה כדי שה-Frontend לא יקרוס
                startServer();
            });
    });