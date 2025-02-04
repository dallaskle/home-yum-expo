import { StyleSheet, ScrollView } from 'react-native';
import { View } from '@/components/Themed';
import { VideoUploadForm } from '@/features/feed/components/VideoUploadForm';

export default function TabTwoScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <VideoUploadForm />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  content: {
    flex: 1,
    backgroundColor: '#333333',
  },
});
