import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { DropZone } from './DropZone';
import { ResultDisplay } from './ResultDisplay';
import { DetectionResponse, ApiError } from '../types/api';

interface ProcessingSectionProps {
  title: string;
  type: 'image' | 'video';
  endpoint: string;
}

export function ProcessingSection({ title, type, endpoint }: ProcessingSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DetectionResponse['class_counts'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos
    
    if (file.size > maxSize) {
      setError(`File size exceeds the maximum limit (${maxSize / 1024 / 1024}MB)`);
      return false;
    }
    return true;
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!validateFile(selectedFile)) return;
    
    setFile(selectedFile);
    setError(null);
    setResults(null);
    
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append(type, file);

    try {
      const response = await fetch(`http://localhost:6001/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json() as DetectionResponse | ApiError;

      if ('error' in data) {
        throw new Error(data.error);
      }

      if (Object.keys(data.class_counts).length === 0) {
        setError('No objects detected with confidence >= 50%');
        return;
      }

      setResults(data.class_counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          {type === 'image' ? 
            'Upload an image to detect and count objects with confidence >= 50%.' :
            'Upload a video to analyze frames (1 FPS) and count detected objects with confidence >= 50%.'}
        </p>
      </div>

      <DropZone
        accept={type === 'image' ? '.jpg,.jpeg,.png' : '.mp4'}
        onFileSelect={handleFileSelect}
        type={type}
      />

      {preview && (
        <div className="mt-4">
          {type === 'image' ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
          ) : (
            <video
              src={preview}
              controls
              className="max-h-64 w-full rounded-lg"
            />
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleProcess}
          disabled={!file || loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {loading ? 
            `Processing ${type}...` : 
            `Process ${type}`
          }
        </button>
        
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Reset
        </button>
      </div>

      <ResultDisplay results={results} />
    </div>
  );
}