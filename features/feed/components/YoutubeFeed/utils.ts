import { Dimensions } from 'react-native';
import { YouTubeVideo } from './types';
import { YOUTUBE_API_KEY } from '../../../../config/youtube.config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const isLikelyShort = (video: YouTubeVideo): boolean => {
  const hasShortTag = 
    video.snippet.title.toLowerCase().includes('#shorts') ||
    video.snippet.description.toLowerCase().includes('#shorts');

  const thumbnail = video.snippet.thumbnails.high || video.snippet.thumbnails.default;
  const isVertical = thumbnail.height > thumbnail.width;

  return hasShortTag || isVertical;
};

export const calculateDimensions = (video: YouTubeVideo) => {
  const thumbnail = video.snippet.thumbnails.high || video.snippet.thumbnails.default;
  const aspectRatio = thumbnail.width / thumbnail.height;
  
  const width = SCREEN_WIDTH;
  const height = width / aspectRatio;
  
  return {
    width,
    height
  };
};

export const getVideoUrl = async (videoId: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=player&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    if (data.items && data.items[0]) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  } catch (error) {
    console.error('Error getting video URL:', error);
    return null;
  }
}; 