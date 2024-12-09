import React, { useState } from 'react';

export function ProcessingSection({ title, type, endpoint }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log('Selected file:', selectedFile);
    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append(type, file);

    setStatus('Uploading and processing...');
    try {
      const res = await fetch(`/${endpoint}`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        console.log('API Response:', data);
        setResponse(data);
        setStatus('Processing complete.');
      } else {
        setStatus('Error: Unable to process the file.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('Error: Unable to upload file.');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium">{title}</h3>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept={type === 'image' ? 'image/*' : 'video/*'}
            onChange={handleFileChange}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload and Process
          </button>
        </div>
      </form>
      {file && type === 'image' && (
        <div className="mt-4">
          <h4 className="font-semibold">Image Preview:</h4>
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded Preview"
            className="max-w-full rounded-lg"
          />
        </div>
      )}
      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
      {response && response.image_url && (
        <div className="mt-4">
          <h4 className="font-semibold">Processed Image:</h4>
          <img
            src={response.image_url}
            alt="Processed Output"
            className="max-w-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
