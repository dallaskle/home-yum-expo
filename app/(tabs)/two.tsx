import { StyleSheet, View } from 'react-native';
import { YouTubeViewer } from '@/features/feed/components/YoutubeFeed/YouTubeViewer';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <YouTubeViewer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333'
  },
});
