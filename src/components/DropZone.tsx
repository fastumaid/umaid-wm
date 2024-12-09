import React from 'react';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  accept: string;
  onFileSelect: (file: File) => void;
  type: 'image' | 'video';
}

export function DropZone({ accept, onFileSelect, type }: DropZoneProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith(type)) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`file-input-${type}`)?.click()}
    >
      <input
        id={`file-input-${type}`}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        Drag and drop your {type} here, or click to select
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supported formats: {accept.split(',').join(', ')}
      </p>
    </div>
  );
}