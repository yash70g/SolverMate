// server.js (Backend - Node.js, Express, MongoDB)
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path'); // Import path for file operations

const app = express();
const port = process.env.PORT || 5000;

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/pdf_data';

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define MongoDB Schema and Model
const pdfSchema = new mongoose.Schema({
    originalFileName: String,
    extractedText: String,
    generatedText: String,
    solutionsFileName: String,
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

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
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
        let pdfText = data.text;

        // Find the index of the first "Q1"
        const q1Index = pdfText.indexOf("Q1");

        // If "Q1" is found, extract text from that point onwards
        if (q1Index !== -1) {
            pdfText = pdfText.substring(q1Index);
        }
        // Extract coding problems (this is a simple example; you might need more robust logic)
       const problemRegex = /(Q\d+\s*[\s\S]*?)(?=Q\d+\s*|$)/g; // Match questions starting with Q1, Q2, etc.
        const problems = Array.from(pdfText.matchAll(problemRegex), m => m[1].trim());

        let solutionsText = "";
        const userString = "23103007 Yash Gupta"; // Define the string here.
        for (let i = 0; i < problems.length; i++) {
            const problem = problems[i];
            const prompt = `Provide the C++ code without comments, using namespace std for this coding problem: ${problem} ONLY GIVE CODE`;
            const result = await model.generateContent(prompt);
            const geminiResponse = await result.response;
            let generatedSolution = geminiResponse.text();
            generatedSolution = generatedSolution.replace(/```cpp\s*|```/g, ''); // Remove ```cpp ``` and ```
            solutionsText += `Question ${i + 1}:\n${generatedSolution}\n\n`;
        }

       let baseFileName = `${userString}-solutions.txt`; // Create base file name
        let solutionsFileName = baseFileName;
        let index = 1;

        while (fs.existsSync(path.join('solutions', solutionsFileName))) {
            const fileNameParts = baseFileName.split('.txt');
            solutionsFileName = `${fileNameParts[0]}-${index}.txt`;
            index++;
        }

        const solutionsFilePath = path.join('solutions', solutionsFileName);
        fs.mkdirSync(path.dirname(solutionsFilePath), { recursive: true }); // Create the solutions directory if it doesn't exist
        fs.writeFileSync(solutionsFilePath, solutionsText);

        // Basic summary/analysis
        const summaryPrompt = `Summarize the following text: ${pdfText}`;
        const summaryResult = await model.generateContent(summaryPrompt);
        const summaryResponse = await summaryResult.response;
        const generatedSummary = summaryResponse.text();

        const newPDFData = new PDFData({
            originalFileName: originalFileName,
            extractedText: pdfText,
            generatedText: generatedSummary,
            solutionsFileName: solutionsFileName,
        });

        await newPDFData.save();

        res.json({ message: 'PDF processed and saved successfully', generatedText: generatedSummary, solutionsFile: solutionsFileName });

        fs.unlinkSync(pdfPath);

    } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).json({ error: error.message || 'An error occurred' });
    }
});

// Route to retrieve all processed PDFs
app.get('/api/pdfs', async (req, res) => {
    try {
        const pdfs = await PDFData.find({});
        res.json(pdfs);
    } catch (error) {
        console.error("Error retrieving PDFs:", error);
        res.status(500).json({ error: error.message || "Error retrieving PDFs" });
    }
});

app.get('/api/solutions/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join('solutions', filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading solution file:", err);
            return res.status(404).send('File not found');
        }
        res.setHeader('Content-Type', 'text/plain');
        res.send(data);
    });
});

app.get('/api/test', (req, res) => {
    res.json({ message: "Hello from test!" });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});