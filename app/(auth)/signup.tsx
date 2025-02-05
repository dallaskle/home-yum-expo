import { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/features/auth/store/auth.store';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const colorScheme = useColorScheme();
  
  const { signup, error, isLoading, isInitialized, user } = useAuthStore();

  useEffect(() => {
    // If already logged in, redirect to tabs
    if (isInitialized && user) {
      router.replace('/(tabs)');
    }
  }, [isInitialized, user]);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    setValidationError('');
    
    try {
      await signup(email, password);
    } catch (err) {
      // Error is handled by the store
      console.error('Signup failed:', err);
    }
  };

  const displayError = validationError || error;

  return (
    <View style={[
      styles.container,
      { backgroundColor: Colors[colorScheme ?? 'light'].background }
    ]}>
      <Text style={[
        styles.title,
        { color: Colors[colorScheme ?? 'light'].text }
      ]}>Sign Up</Text>
      
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
      
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderColor: Colors[colorScheme ?? 'light'].border,
            color: Colors[colorScheme ?? 'light'].text
          }
        ]}
        placeholder="Confirm password"
        placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!isLoading}
      />
      
      {displayError ? <Text style={styles.error}>{displayError}</Text> : null}
      
      <Pressable
        style={[
          styles.button,
          { 
            backgroundColor: Colors[colorScheme ?? 'light'].accent,
            opacity: isLoading ? 0.7 : 1
          }
        ]}
        onPress={handleSignup}
        disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Signing up...' : 'Sign Up'}</Text>
      </Pressable>
      
      <Pressable onPress={() => router.push('./login')} disabled={isLoading}>
        <Text style={{ 
          color: Colors[colorScheme ?? 'light'].accent, 
          marginTop: 10,
          opacity: isLoading ? 0.7 : 1
        }}>
          Already have an account? Login
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
}); 