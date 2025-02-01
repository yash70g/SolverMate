import React, { useState, useEffect } from 'react';
import Upload from './components/Upload';
import './style.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import Solution from "./components/Solution"; // Corrected import path

function App() {
    const [pdfs, setPDFs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)
     const [solutionUrl, setSolutionUrl] = useState(null);

    useEffect(() => {
        fetchPDFs();
    }, []);

  const fetchPDFs = async () => {
    try {
      const response = await axios.get('/api/pdfs');
      if (response.status === 200) {
        if (response.data && response.data.success && response.data.data) {
           setPDFs(response.data.data);
        } else {
            setPDFs([]);
          setError(response.data.message || 'Failed to fetch PDFs');
        }
      } else {
        setError(`Failed to fetch PDFs. Status: ${response.status}`);
      }
        setLoading(false)
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      setError(error.response?.data?.message || "Error fetching PDFs");
        setLoading(false);
    }
  };

    const handleSolution = (fileName) => {
    // Create a URL for the solution file
    const url = `/api/solutions/${fileName}`;

    // Open the solution file in a new tab
    window.open(url, '_blank');
};

   const handlePdfUploadSuccess = (data) => {
        if (data && data.solutionsFile) {
            setPDFs(prevPdfs => [...prevPdfs, data]);
          setSolutionUrl(`/api/solutions/${data.solutionsFile}`);
          window.open(`/api/solutions/${data.solutionsFile}`, '_blank');
       }else{
        setError("Failed to load Solution URL");
       }
};

    const containerVariants = {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

      return (
        <motion.div
         className="container"
         variants={containerVariants}
        initial="initial"
         animate="animate"
       >
            <h1>PDF Processor</h1>
            <Upload setPDFs={setPDFs} setError={setError} fetchPDFs={fetchPDFs}  onUploadSuccess={handlePdfUploadSuccess}/>
            {error && <p className="error-message">{error}</p>}
             {pdfs && pdfs.map((pdf, index) => (
                 <Solution key={index} pdf={pdf} onSolutionClick={handleSolution} />
                ))}
        </motion.div>
    );
}

export default App;