import { StyleSheet } from 'react-native';
import { VideoFeed } from '@/features/feed/components/VideoFeed';

export default function TabOneScreen() {
  return <VideoFeed />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
