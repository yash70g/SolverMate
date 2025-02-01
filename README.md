# PDF Processor App
Remember to replace placeholders like YOUR_USERNAME, YOUR_REPO_NAME, YOUR_GEMINI_API_KEY, and your MongoDB URI with your actual values

This application processes PDF files, extracts coding problems (C++), generates solutions using the Gemini API, and provides a summary of the PDF content.  It consists of a Node.js/Express backend and a React frontend.

## Table of Contents

-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [Backend Setup (server/)](#backend-setup-server)
-   [Frontend Setup (client/)](#frontend-setup-client)
-   [Testing](#testing)
-   [Troubleshooting](#troubleshooting)
-   [Contributing](#contributing)

## Features

-   Upload PDF files.
-   Extract coding problems (C++) from the PDF.
-   Generate C++ solutions using the Gemini API.
-   Provide a summary of the PDF content.
-   Download generated solutions.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://www.google.com/search?q=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)  // Replace with your repo URL
    cd PDF-Processor-App  // Go to the project root directory
    ```

2.  **Backend Installation:**

    ```bash
    cd server
    npm install  // Install backend dependencies
    ```

3.  **Frontend Installation:**

    ```bash
    cd client
    npm install  // Install frontend dependencies
    ```

## Usage

1.  **Backend Setup:**

    *   Create a `.env` file in the `server` directory.
    *   Add your Gemini API key and MongoDB connection URI:

        ```
        GEMINI_API_KEY=YOUR_GEMINI_API_KEY
        MONGODB_URI=mongodb://localhost:27017/pdf_data // Or your MongoDB Atlas URI
        ```

    *   Start the backend server:

        ```bash
        cd server
        npm start  // or npm run dev if you have nodemon
        ```

2.  **Frontend Setup:**

    *   Start the frontend development server:

        ```bash
        cd client
        npm start
        ```

3.  **Open the application:** The React app should open in your browser (usually at `http://localhost:5173`).

4.  **Upload a PDF:** Use the "Choose File" input to select a PDF file.

5.  **Process PDF:** Click the "Upload" button. The app will extract coding problems, generate solutions using the Gemini API, provide a summary, and display the results.  The solutions will be saved as a text file in the `solutions` folder on the server, and the user will be prompted to download the file.


6.  **View Processed PDFs:** The app will display a list of previously processed PDFs.

7.  **View Solutions:** Click on a PDF entry in the list to download the corresponding solutions file.

## Project Structure
```
PDF-Processor-App/
├── client/         <-- React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Upload.jsx
│   │   │   ├── Solution.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── ...
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── ...
└── server/         <-- Node.js/Express backend
├── server.js
├── package.json
├── uploads/       <-- Uploaded PDFs are stored here
├── solutions/     <-- Generated solutions are stored here
└── ...
```
## Backend Setup (server/)

1.  **Dependencies:** The backend uses Express.js, Multer, pdf-parse, the Gemini API library, Mongoose, and dotenv.  See the `server/package.json` file for the full list.

2.  **Environment Variables:**  The `.env` file is used to store sensitive information (API keys, database URI).  *Do not commit this file to version control.*

3.  **Routes:**
    *   `/api/process-pdf`: Handles PDF uploads, extracts problems, generates solutions, and saves data to MongoDB.
    *   `/api/pdfs`: Retrieves a list of processed PDFs from MongoDB.
    *   `/api/solutions/:filename`: Serves the generated solutions file.
    *   `/api/test`: A test endpoint.

## Frontend Setup (client/)

1.  **Dependencies:** The frontend uses React, axios, and framer-motion. See the `client/package.json` file for the full list.

2.  **Components:**
    *   `Upload`: Handles PDF uploads.
    *   `Solution`: Displays information about a processed PDF and provides a link to download the solutions.
    *   `App`: The main component that manages state and renders the other components.

## Testing

1.  **Backend:**  Use Jest and Supertest to write unit and integration tests for the backend API.  See the `server/pdf.test.js` example (or create one in a `test` directory).

2.  **Frontend:** Use React Testing Library and Jest to test your React components.

## Troubleshooting

*   **`EADDRINUSE` error:** If you get this error, another process is using the port.  Identify and kill the process.
*   **Gemini API errors:** Check your API key and the Gemini API documentation.
*   **MongoDB connection errors:** Verify your MongoDB connection URI.
*   **File upload issues:** Check the Multer configuration and ensure the `uploads` directory exists.

## Contributing

Contributions are welcome!  Please open an issue or submit a pull request.

Remember to replace placeholders like YOUR_USERNAME, YOUR_REPO_NAME, YOUR_GEMINI_API_KEY, and your MongoDB URI with your actual values
