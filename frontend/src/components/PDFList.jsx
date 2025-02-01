import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { FaDownload } from 'react-icons/fa';
import Solution from './Solution';
import Loading from './Loading';


const PDFList = ({pdfs, loading}) => {
    const [selectedSolution, setSelectedSolution] = useState(null);

    const handleDownload = async (fileName) => {
        try {
            const response = await axios.get(`/api/solutions/${fileName}`, {
            responseType: 'blob'
            });
          saveAs(response.data, fileName);
        } catch (error) {
            console.error('Error downloading solution:', error);
        }
      };

      const handleView = (fileName) =>{
         setSelectedSolution(fileName);
      }

    if(loading){
        return  <Loading loading={true} />
    }

    return(
    <div className="uploaded-file-list">
        {selectedSolution && <Solution fileName={selectedSolution} onClose={() => setSelectedSolution(null)}/> }

        {!pdfs || pdfs.length === 0 ? <p>No files processed yet</p> : null}
        <div className="pdf-list">
        {pdfs && pdfs.map(pdf => (
            <div key={pdf._id} className="pdf-item">
                 <p>File Name: {pdf.originalFileName}</p>
                 <div>
                    <button className='download-button' onClick={() => handleDownload(pdf.solutionsFileName)}>
                    <FaDownload />
                </button>
                <button className="download-button" onClick={() => handleView(pdf.solutionsFileName)}>View</button>
                </div>
            </div>
        ))}
    </div>

    </div>
    );
}
export default PDFList;