import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { showToast } from '../common/ToastProvider';

export const DropzoneUploader = ({ onUpload, accept = 'image/*,application/pdf', maxSize = 5242880 }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length) {
      showToast.error(`File too large or invalid type. Max size: ${maxSize / 1048576}MB`);
      return;
    }
    const file = acceptedFiles[0];
    if (file) onUpload(file);
  }, [onUpload, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  });

  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-600'}`}>
      <input {...getInputProps()} />
      <Upload className="mx-auto mb-2 text-gray-400" size={32} />
      {isDragActive ? <p>Drop the file here...</p> : <p>Drag & drop or click to upload</p>}
      <p className="text-xs text-gray-500 mt-1">Max size: {maxSize / 1048576}MB</p>
    </div>
  );
};
