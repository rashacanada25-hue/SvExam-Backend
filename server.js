const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // טוען את המשתנים מתוך קובץ ה-.env

const app = express();
const port = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- נתיבי בדיקה (Routes) ---
app.get('/', (req, res) => {
    res.send('Hello World! Server is up and running.');
});

// --- שליפת הקישורים מתוך ה-env ---
// כאן השרת מושך את ה-MONGO_URI שהגדרת ב-.env
const mongoUri = process.env.MONGO_URI; 
const localUri = process.env.MONGO_LOCAL_URI || 'mongodb://127.0.0.1:27017/SvExam';

console.log('Connecting to Database...');

// --- פונקציית הפעלת השרת ---
function startServer() {
    if (!app.locals.listening) {
        app.listen(port, () => {
            console.log(`Server is running on port ${port} successfully!`);
        });
        app.locals.listening = true;
    }
}

// --- ניהול החיבור ל-MongoDB ---

// 1. ניסיון חיבור ראשוני ל-MongoDB Atlas בענן (באמצעות הקישור מה-.env)
mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB Atlas! successfully!');
        startServer(); // מפעיל את השרת רק אחרי שהתחבר לענן
    })
    .catch((err) => {
        console.warn('Atlas connection failed:', err.message);
        console.log('Trying local MongoDB...');

        // 2. ניסיון חיבור מקומי כגיבוי במידה ואין אינטרנט במעבדה
        mongoose.connect(localUri)
            .then(() => {
                console.log('Connected to local MongoDB! successfully!');
                startServer();
            })
            .catch((localErr) => {
                console.error('MongoDB connection failed completely:', localErr.message);
                // הפעלת השרת בכל מקרה כדי שפורט 3000 יישאר פתוח ל-React
                startServer();
            });
    });