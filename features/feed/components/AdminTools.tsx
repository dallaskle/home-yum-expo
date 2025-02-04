import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { BulkUploadAPI } from '../api/bulk-upload';

export function AdminTools() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleBulkUpload = async () => {
    try {
      setIsUploading(true);
      setResult('');
      
      const uploadedVideos = await BulkUploadAPI.bulkUploadVideos();
      
      const resultMessage = `Successfully created ${uploadedVideos.length} video entries:\n\n` +
        uploadedVideos.map(video => `- ${video.videoTitle} (${video.mealDescription})`).join('\n');
      
      setResult(resultMessage);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={isUploading ? "Creating entries..." : "Create Video Entries from Supabase"}
        onPress={handleBulkUpload}
        disabled={isUploading}
      />
      {result ? (
        <Text style={styles.result}>{result}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16
  },
  result: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20
  }
}); 