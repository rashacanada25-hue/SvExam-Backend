const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// נתיב הבדיקה הראשי לפרונט-אנד
app.get('/', (req, res) => { res.send('Hello World');
});

// שינוי 1: שימוש ישיר ב-127.0.0.1 במקום localhost כדי למנוע בעיות IPv6 במחשבי המעבדה
const mongoUri = process.env.MONGO_URI || "mongodb://rasha-26:SvExam2026@ac-tdvmb-shard-00-00.tdvmb.mongodb.net:27017,ac-tdvmb-shard-00-01.tdvmb.mongodb.net:27017,ac-tdvmb-shard-00-02.tdvmb.mongodb.net:27017/task_manager_api?ssl=true&replicaSet=atlas-9x0261-shard-0&authSource=admin&retryWrites=true&w=majority";
const localUri = process.env.MONGO_LOCAL_URI || 'mongodb://127.0.0.1:27017/SvExam';

console.log('Connecting to Database...');


mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 })
.then(() => {
 console.log('Connected to MongoDB Atlas! successfully!');
 startServer();
 })
 .catch((err) => {
 console.warn('Atlas connection failed:', err.message);
 console.log('Trying local MongoDB... successfully!');

 mongoose.connect(localUri, { serverSelectionTimeoutMS: 4000 })
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

function startServer() {
if (!app.locals.listening) {
 app.listen(port, () => {
 console.log(`Server is running on port ${port} successfully!`);
});
 app.locals.listening = true;
}
}