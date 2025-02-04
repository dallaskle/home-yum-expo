import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { authService, AuthResponse } from '../service/auth.service';
import { auth } from '@/config/auth';
import { onAuthStateChanged, Unsubscribe } from 'firebase/auth';
import { User } from '@/types/database.types';
import { UserAPI } from '../api/user.api';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  tokens: AuthResponse['tokens'] | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  isSigningUp: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<Unsubscribe>;
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

interface AuthStateUpdate {
  firebaseUser?: FirebaseUser | null;
  user?: User | null;
  tokens?: AuthResponse['tokens'] | null;
  error?: string | null;
  isLoading?: boolean;
  isInitialized?: boolean;
  isSigningUp?: boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const updateState = (updates: AuthStateUpdate) => {
    set((state) => ({ ...state, ...updates }));
  };

  return {
    firebaseUser: null,
    user: null,
    tokens: null,
    isLoading: false,
    error: null,
    isInitialized: false,
    isSigningUp: false,

    setUser: (user: User | null) => {
      updateState({ user });
    },

    updateUser: async (userData: Partial<User>) => {
      try {
        updateState({ isLoading: true, error: null });
        await UserAPI.updateUser(userData);
        const updatedUser = await UserAPI.getUser();
        updateState({ user: updatedUser, isLoading: false });
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : 'Failed to update user',
          isLoading: false,
        });
        throw error;
      }
    },

    initialize: async () => {
      if (get().isInitialized) {
        // Return a no-op unsubscribe function if already initialized
        return () => {};
      }
      
      updateState({ isLoading: true });
      
      try {
        const storedAuth = await authService.getStoredAuth();
        if (storedAuth && storedAuth.tokens.expirationTime > Date.now()) {
          updateState({
            firebaseUser: storedAuth.firebaseUser,
            user: storedAuth.user,
            tokens: storedAuth.tokens,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error checking stored auth:', error);
      }

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const currentState = get();
            if (currentState.isSigningUp || currentState.firebaseUser?.uid === firebaseUser.uid) {
              return;
            }

            const tokens = {
              accessToken: (firebaseUser as any).stsTokenManager.accessToken,
              refreshToken: (firebaseUser as any).stsTokenManager.refreshToken,
              expirationTime: (firebaseUser as any).stsTokenManager.expirationTime,
            };
            
            try {
              const user = await UserAPI.getUser();
              await authService.saveAuthData(firebaseUser, user, tokens);
              updateState({
                firebaseUser,
                user,
                tokens,
                error: null,
              });
            } catch (error) {
              if (!currentState.isSigningUp) {
                await authService.clearAuthData();
                updateState({
                  firebaseUser: null,
                  user: null,
                  tokens: null,
                  error: 'User profile not found',
                });
              }
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
            if (!get().isSigningUp) {
              updateState({
                error: 'Failed to fetch user data',
                isLoading: false,
              });
            }
          }
        } else {
          const currentState = get();
          if (currentState.firebaseUser && !currentState.isSigningUp) {
            await authService.clearAuthData();
            updateState({
              firebaseUser: null,
              user: null,
              tokens: null,
              error: null,
            });
          }
        }
      });

      updateState({ isInitialized: true, isLoading: false });
      return unsubscribe;
    },

    login: async (email: string, password: string) => {
      try {
        updateState({ isLoading: true, error: null });
        const response = await authService.login(email, password);
        updateState({
          firebaseUser: response.firebaseUser,
          user: response.user,
          tokens: response.tokens,
          error: null,
          isLoading: false,
        });
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : 'Failed to login',
          isLoading: false,
        });
        throw error;
      }
    },

    signup: async (email: string, password: string) => {
      try {
        updateState({ isLoading: true, error: null, isSigningUp: true });
        
        const response = await authService.signup(email, password);
        
        try {
          const user = await UserAPI.createUser();
          
          updateState({
            firebaseUser: response.firebaseUser,
            user,
            tokens: response.tokens,
            error: null,
            isLoading: false,
            isSigningUp: false,
          });
        } catch (error) {
          await authService.logout();
          throw new Error('Failed to create user profile');
        }
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : 'Failed to signup',
          isLoading: false,
          isSigningUp: false,
        });
        throw error;
      }
    },

    logout: async () => {
      try {
        updateState({ isLoading: true, error: null });
        await authService.logout();
        updateState({
          firebaseUser: null,
          user: null,
          tokens: null,
          error: null,
          isLoading: false,
        });
      } catch (error) {
        updateState({
          error: error instanceof Error ? error.message : 'Failed to logout',
          isLoading: false,
        });
        throw error;
      }
    },
  };
});
