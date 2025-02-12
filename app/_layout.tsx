import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { auth } from '@/config/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/(auth)/login');
      }
    });

    return () => unsubscribe();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <RootLayoutNav />
      <Toast 
        config={{
          success: (props) => (
            <View style={{
              padding: 16,
              backgroundColor: Colors[colorScheme ?? 'light'].success,
              borderRadius: 8,
              marginHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{props.text1}</Text>
                {props.text2 && <Text style={{ color: 'white', fontSize: 14, marginTop: 4 }}>{props.text2}</Text>}
              </View>
            </View>
          ),
          error: (props) => (
            <View style={{
              padding: 16,
              backgroundColor: Colors[colorScheme ?? 'light'].error,
              borderRadius: 8,
              marginHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{props.text1}</Text>
                {props.text2 && <Text style={{ color: 'white', fontSize: 14, marginTop: 4 }}>{props.text2}</Text>}
              </View>
            </View>
          )
        }}
      />
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoading, isInitialized, initialize } = useAuthStore();

  // Always call useEffect
  useEffect(() => {
    initialize();
  }, []);

  const customTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: Colors[colorScheme ?? 'light'].accent,
      background: Colors[colorScheme ?? 'light'].background,
      text: Colors[colorScheme ?? 'light'].text,
      border: Colors[colorScheme ?? 'light'].border,
      card: Colors[colorScheme ?? 'light'].background,
    },
  };

  // Instead of conditional rendering, render both states but use opacity/display
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={customTheme}>
        {/* Loading State */}
        <View 
          style={[
            { 
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors[colorScheme ?? 'light'].background,
            },
            { display: (isLoading || !isInitialized) ? 'flex' : 'none' }
          ]}
        >
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].accent} />
        </View>

        {/* Main Navigation */}
        <View style={{ flex: 1, opacity: (isLoading || !isInitialized) ? 0 : 1 }}>
          <Stack
            screenOptions={{
              headerShown: useClientOnlyValue(false, true),
              contentStyle: { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
          </Stack>
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
