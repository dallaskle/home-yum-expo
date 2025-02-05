import { StyleSheet, View } from 'react-native';
import { TryListScreen } from '@/features/feed/components/TryList/TryListScreen';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <TryListScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333'
  },
});
