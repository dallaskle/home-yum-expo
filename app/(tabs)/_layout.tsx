import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, router } from 'expo-router';
import { Pressable, ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useReactionsStore } from '@/features/feed/store/reactions.store';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
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

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, isLoading, isInitialized } = useAuthStore();

  // Handle navigation based on auth state
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isInitialized && !isLoading) {
      if (!user) {
        // Add a small delay to prevent rapid redirects during auth state changes
        timeoutId = setTimeout(() => {
          router.replace('/login');
        }, 100);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isInitialized, isLoading, user]);

  // Show loading state while checking auth
  if (!isInitialized || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors[colorScheme ?? 'light'].background }}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].accent} />
      </View>
    );
  }

  // Don't render tabs if not authenticated
  if (!user) {
    return null;
  }

  const customTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: Colors[colorScheme ?? 'light'].accent,
      background: '#333333',
      text: '#FFFFFF',
      border: 'transparent',
      card: 'transparent',
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#333333' }}>
      <ThemeProvider value={customTheme}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: 'transparent',
              position: 'absolute',
              elevation: 10,
              height: 72,
              paddingBottom: 20,
              shadowColor: '#FF6600',
              shadowOffset: {
                width: 0,
                height: -4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].accent,
            tabBarInactiveTintColor: '#FFFFFF',
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Feed',
              tabBarIcon: ({ color }) => <TabBarIcon name="video-camera" color={color} />,
            }}
          />
          <Tabs.Screen
            name="two"
            options={{
              title: 'Want to try',
              tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
              tabBarStyle: {
                backgroundColor: 'transparent',
                position: 'absolute',
                elevation: 10,
                height: 72,
                paddingBottom: 20,
                shadowColor: '#FF6600',
                shadowOffset: {
                  width: 0,
                  height: -4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
              tabBarStyle: {
                backgroundColor: '#333333',
                position: 'absolute',
                elevation: 10,
                height: 72,
                paddingBottom: 20,
                shadowColor: '#FF6600',
                shadowOffset: {
                  width: 0,
                  height: -4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
            }}
          />
        </Tabs>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
