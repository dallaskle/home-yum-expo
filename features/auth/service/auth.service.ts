import { auth } from '@/config/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/database.types';
import { UserAPI } from '../api/user.api';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

export interface AuthResponse {
  firebaseUser: FirebaseUser;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expirationTime: number;
  };
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const tokens = {
      accessToken: (userCredential.user as any).stsTokenManager.accessToken,
      refreshToken: (userCredential.user as any).stsTokenManager.refreshToken,
      expirationTime: (userCredential.user as any).stsTokenManager.expirationTime,
    };
    
    // Fetch user data from our backend
    const user = await UserAPI.getUser();
    
    await this.saveAuthData(userCredential.user, user, tokens);
    
    return {
      firebaseUser: userCredential.user,
      user,
      tokens,
    };
  }

  async signup(email: string, password: string): Promise<AuthResponse> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const tokens = {
      accessToken: (userCredential.user as any).stsTokenManager.accessToken,
      refreshToken: (userCredential.user as any).stsTokenManager.refreshToken,
      expirationTime: (userCredential.user as any).stsTokenManager.expirationTime,
    };
    
    // Create user in our backend
    const user = await UserAPI.createUser();
    
    await this.saveAuthData(userCredential.user, user, tokens);
    
    return {
      firebaseUser: userCredential.user,
      user,
      tokens,
    };
  }

  async logout(): Promise<void> {
    await signOut(auth);
    await this.clearAuthData();
  }

  async saveAuthData(firebaseUser: FirebaseUser, user: User, tokens: AuthResponse['tokens']): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens)),
      AsyncStorage.setItem(USER_KEY, JSON.stringify({ firebaseUser, user }))
    ]);
  }

  async clearAuthData(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY)
    ]);
  }

  async getStoredAuth(): Promise<AuthResponse | null> {
    try {
      const [tokensStr, userStr] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (!tokensStr || !userStr) return null;

      const tokens = JSON.parse(tokensStr);
      const { firebaseUser, user } = JSON.parse(userStr);

      // Check if token is expired
      if (tokens.expirationTime < Date.now()) {
        await this.clearAuthData();
        return null;
      }

      return { firebaseUser, user, tokens };
    } catch (error) {
      console.error('Error getting stored auth:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
