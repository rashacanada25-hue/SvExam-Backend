require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/movies/generate', async (req, res) => {
  const { title, genre } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `כתוב תיאור קצר ומרתק לסרט בסגנון ${genre} עם השם ${title}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ description: response.text() });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'שגיאה ביצירת תיאור' });
  }
});

const PORT = process.env.PORT || 3000;
// ודא שמשתנה MONGO_URI מוגדר ב-.env שלך
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error(err));