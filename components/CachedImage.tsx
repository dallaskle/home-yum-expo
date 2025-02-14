import { Image } from 'expo-image';
import { StyleProp, ImageStyle } from 'react-native';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

interface CachedImageProps {
  source: string | null | undefined;
  style: StyleProp<ImageStyle>;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export function CachedImage({ source, style, contentFit = 'cover' }: CachedImageProps) {
  return (
    <Image
      source={source?.replace(/\?$/, '') || ''}
      style={style}
      contentFit={contentFit}
      transition={200}
      placeholder={blurhash}
      cachePolicy="memory-disk"
    />
  );
} 