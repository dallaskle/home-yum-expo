import { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { BulkUploadAPI } from '@/features/feed/api/bulk-upload';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState('');
  const colorScheme = useColorScheme();
  
  const { login, error, isLoading, isInitialized, user } = useAuthStore();

  useEffect(() => {
    // If already logged in, redirect to tabs
    if (isInitialized && user) {
      router.replace('/(tabs)');
    }
  }, [isInitialized, user]);

  const handleLogin = async () => {
    try {
      await login('dallas.klein@gauntletai.com', 'password');
      router.replace('/(tabs)');
    } catch (err) {
      // Error is handled by the store
      console.error('Login failed:', err);
    }
  };

  const handleBulkUpload = async () => {
    try {
      setIsUploading(true);
      setUploadResult('');
      
      // Login first if not already logged in
      if (!user) {
        await login('dallas.klein@gauntletai.com', 'password');
      }
      
      const uploadedVideos = await BulkUploadAPI.bulkUploadVideos();
      
      const resultMessage = `Successfully created ${uploadedVideos.length} video entries:\n\n` +
        uploadedVideos.map(video => `- ${video.videoTitle} (${video.mealDescription})`).join('\n');
      
      setUploadResult(resultMessage);
    } catch (error) {
      setUploadResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: Colors[colorScheme ?? 'light'].background }
    ]}>
      <Text style={[
        styles.title,
        { color: Colors[colorScheme ?? 'light'].text }
      ]}>Welcome to HomeYum</Text>
      
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderColor: Colors[colorScheme ?? 'light'].border,
            color: Colors[colorScheme ?? 'light'].text
          }
        ]}
        placeholder="Enter email"
        placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
      />
      
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderColor: Colors[colorScheme ?? 'light'].border,
            color: Colors[colorScheme ?? 'light'].text
          }
        ]}
        placeholder="Enter password"
        placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Pressable
        style={[
          styles.button,
          { 
            backgroundColor: Colors[colorScheme ?? 'light'].accent,
            opacity: isLoading ? 0.7 : 1
          }
        ]}
        onPress={handleLogin}
        disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          { 
            backgroundColor: Colors[colorScheme ?? 'light'].accent,
            opacity: isUploading ? 0.7 : 1,
            marginTop: 10
          }
        ]}
        onPress={handleBulkUpload}
        disabled={isUploading}>
        <Text style={styles.buttonText}>
          {isUploading ? 'Creating entries...' : 'Create Video Entries from Supabase'}
        </Text>
      </Pressable>
      
      {uploadResult ? (
        <Text style={[styles.result, { color: Colors[colorScheme ?? 'light'].text }]}>
          {uploadResult}
        </Text>
      ) : null}
      
      <Pressable onPress={() => router.push('./signup')} disabled={isLoading}>
        <Text style={{ 
          color: Colors[colorScheme ?? 'light'].accent, 
          marginTop: 10,
          opacity: isLoading ? 0.7 : 1
        }}>
          Don't have an account? Sign Up
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#ff3b30',
    marginBottom: 10,
  },
  result: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
    width: '100%',
  },
}); 