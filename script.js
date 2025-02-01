// server.js (Backend - Node.js, Express, MongoDB)
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GeminiAPI } = require('@google/generative-ai');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pdf_data'; // Your MongoDB URI

mongoose.connect(mongoURI) // No need for the options anymore
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Define MongoDB Schema and Model
const pdfSchema = new mongoose.Schema({
    originalFileName: String,
    extractedText: String,
    generatedText: String,
});
const PDFData = mongoose.model('PDFData', pdfSchema);

// Multer configuration
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

// Gemini API setup
const geminiApiKey = process.env.GEMINI_API_KEY;

app.use(express.json());

app.post('/api/process-pdf', upload.single('pdfFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const pdfPath = req.file.path;
        const originalFileName = req.file.originalname;
        const dataBuffer = fs.readFileSync(pdfPath);

        const data = await pdf(dataBuffer);
        const pdfText = data.text;

        const prompt = `Summarize or analyze the following text:\n\n${pdfText}`;

        const gemini = new GeminiAPI({ key: geminiApiKey });
        const geminiResponse = await gemini.generateText({
            model: 'gemini-pro',
            prompt,
            maxOutputTokens: 500,
        });

        const generatedText = geminiResponse.candidates[0].output;

        const newPDFData = new PDFData({
            originalFileName: originalFileName,
            extractedText: pdfText,
            generatedText: generatedText,
        });
        await newPDFData.save();

        res.json({ message: 'PDF processed and saved successfully', generatedText });

        fs.unlinkSync(pdfPath);

    } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).json({ error: error.message || 'An error occurred' });
    }
});

// Route to retrieve all processed PDFs
app.get('/api/pdfs', async (req, res) => {
    try {
        const pdfs = await PDFData.find({}); // Find all PDFs in the database
        res.json(pdfs); // Send the PDFs as JSON
    } catch (error) {
        console.error("Error retrieving PDFs:", error);
        res.status(500).json({ error: error.message || "Error retrieving PDFs" });
    }
});
app.get('/api/test', (req, res) => {
    res.json({ message: "Hello from test!" });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});