import React from 'react';
import { DetectionResponse } from '../types/api';

interface ResultDisplayProps {
  results: DetectionResponse['class_counts'] | null;
}

export function ResultDisplay({ results }: ResultDisplayProps) {
  if (!results) return null;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h3 className="text-lg font-semibold mb-3">Detection Results</h3>
      <div className="space-y-2">
        {Object.entries(results).length === 0 ? (
          <p className="text-gray-500">No objects detected with confidence >= 50%</p>
        ) : (
          Object.entries(results).map(([className, count]) => (
            <div key={className} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">{className}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Count:</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {count}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}