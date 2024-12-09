export interface DetectionResponse {
  class_counts: Record<string, number>;
}

export interface ApiError {
  error: string;
}