import React, { useState } from 'react';
import { uploadDocument } from '../../services/documents';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

const Documents = () => {
  const [uploading, setUploading] = useState(false);
  const onDrop = async (files) => {
    setUploading(true);
    try {
      await uploadDocument(files[0]);
      toast.success('Document uploaded');
    } finally { setUploading(false); }
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Documents</h1>
      <div {...getRootProps()} className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer">
        <input {...getInputProps()} />
        {uploading ? <p>Uploading...</p> : <p>Drag & drop or click to upload</p>}
      </div>
    </div>
  );
};
export default Documents;
