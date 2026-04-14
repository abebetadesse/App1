import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../services/api';

const PortfolioUploader = ({ profileId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [plagiarismFlag, setPlagiarismFlag] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    const formData = new FormData();
    acceptedFiles.forEach(file => formData.append('portfolio', file));
    formData.append('profileId', profileId);
    
    try {
      const response = await api.post('/profile-owners/portfolio', formData);
      if (response.data.plagiarismFlag) {
        setPlagiarismFlag(response.data.plagiarismFlag);
      } else {
        onUploadComplete?.(response.data);
      }
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
    }
  }, [profileId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'audio/*': ['.mp3', '.wav'],
      'video/*': ['.mp4', '.mov']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  return (
    <div>
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
        <input {...getInputProps()} />
        {uploading ? <p>Uploading...</p> : <p>Drag & drop portfolio files here, or click to select</p>}
      </div>
      {plagiarismFlag && (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          ⚠️ Potential plagiarism detected. Your upload is pending review.
        </div>
      )}
    </div>
  );
};

export default PortfolioUploader;
