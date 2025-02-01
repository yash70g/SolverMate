import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';

const Upload = ({ setPDFs, setError, fetchPDFs }) => {
const [loading, setLoading] = useState(false);
const onDrop = useCallback(acceptedFiles => {
    setLoading(true);
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('pdfFile', file);

    axios.post('/api/process-pdf', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(response => {
            toast.success(response.data.message);
            setLoading(false);
            fetchPDFs();
            setError(null);
        })
        .catch(error => {
            toast.error("Failed to process PDF");
            console.error('Error uploading file:', error);
            setError(error.response?.data?.message || 'An error occurred');
            setLoading(false);
        });
    }, [fetchPDFs, setError]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

return (
    <>
    <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="toast-container"
    />
    <div className="upload-area">
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'drag-over' : ''}`}>
            <input {...getInputProps()} />
        <p>Drag 'n' drop a PDF file here, or click to select a file</p>
        </div>

        <Loading loading={loading} />
    </div>
    </>
);
};

export default Upload;