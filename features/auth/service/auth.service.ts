import { auth } from '@/config/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/database.types';
import { UserAPI } from '../api/user.api';

const USER_KEY = '@user_data';

export interface AuthResponse {
  firebaseUser: FirebaseUser;
  user: User;
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Fetch user data from our backend
    const user = await UserAPI.getUser();
    
    await this.saveAuthData(userCredential.user, user);
    
    return {
      firebaseUser: userCredential.user,
      user,
    };
  }

  async signup(email: string, password: string): Promise<AuthResponse> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user in our backend
    const user = await UserAPI.createUser();
    
    await this.saveAuthData(userCredential.user, user);
    
    return {
      firebaseUser: userCredential.user,
      user,
    };
  }

  async logout(): Promise<void> {
    await signOut(auth);
    await this.clearAuthData();
  }

  async saveAuthData(firebaseUser: FirebaseUser, user: User): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify({ firebaseUser, user }));
  }

  async clearAuthData(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  }

  async getStoredAuth(): Promise<AuthResponse | null> {
    try {
      const userStr = await AsyncStorage.getItem(USER_KEY);
      if (!userStr) return null;

      const { firebaseUser, user } = JSON.parse(userStr);
      return { firebaseUser, user };
    } catch (error) {
      console.error('Error getting stored auth:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
