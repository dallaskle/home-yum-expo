export interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high?: { width: number; height: number };
      default: { width: number; height: number };
    };
  };
  contentDetails?: {
    duration: string;
  };
}

export interface SearchResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
} 